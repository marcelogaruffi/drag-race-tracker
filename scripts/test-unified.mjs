import axios from 'axios';
import * as cheerio from 'cheerio';

async function testSeason(pageName) {
  const url = `https://rupaulsdragrace.fandom.com/api.php?action=parse&page=${encodeURIComponent(pageName)}&format=json`;
  const { data } = await axios.get(url);
  const $ = cheerio.load(data.parse.text["*"]);

  let progressTable = null;
  
  // Encontrar a tabela que tem o progresso (qualquer uma que tenha cabeçalho indicando episódios)
  $('table.wikitable').each((i, el) => {
    const firstRowText = $(el).find('tr').first().text().toLowerCase();
    const secondRowText = $(el).find('tr').eq(1).text().toLowerCase();
    
    // Se tem "contestant" e tem algum número de episódio (1, ep 1, ep. 1)
    if ((firstRowText.includes('contestant') || secondRowText.includes('contestant')) && 
        (firstRowText.match(/\b1\b/) || firstRowText.includes('ep. 1') || firstRowText.includes('ep 1') ||
         secondRowText.match(/\b1\b/) || secondRowText.includes('ep. 1') || secondRowText.includes('ep 1'))) {
       progressTable = el;
       return false; // Break
    }
  });

  if (!progressTable) {
    console.log(pageName + " -> Progress table not found!");
    return;
  }

  // Achar o índice da coluna do Episódio 1
  let ep1Index = -1;
  let headerRow = $(progressTable).find('tr').first();
  if (!headerRow.text().match(/\b1\b|ep\.? 1/i)) {
      headerRow = $(progressTable).find('tr').eq(1); // Às vezes a primeira linha é só o título da temporada
  }
  
  let currentHeaderCol = 0;
  headerRow.find('th, td').each((i, el) => {
      const text = $(el).text().trim().toLowerCase();
      if (text === '1' || text === 'ep. 1' || text === 'ep 1') {
          ep1Index = currentHeaderCol;
      }
      currentHeaderCol += parseInt($(el).attr('colspan') || '1', 10);
  });

  console.log(pageName + " -> Ep1 starts at col index: " + ep1Index);

  $(progressTable).find('tr').each((i, row) => {
    if (i === 0 || i === 1) return; // Skip headers
    
    let queenName = "";
    let colIndex = 0;
    let currentEp = 1;

    $(row).find('th, td').each((j, el) => {
      const $col = $(el);
      const text = $col.text().trim().toUpperCase().replace(/\[.*?\]/g, ''); 
      const colSpan = parseInt($col.attr('colspan') || '1', 10);
      
      // Encontrar o nome da Queen (normalmente na coluna 0 ou 1, dependendo se tem Rank)
      if (colIndex < ep1Index) {
         if (!queenName && isNaN(parseInt(text)) && text.length > 2 && text !== 'PHOTO') {
             // Basicamente pega o primeiro texto grande antes das colunas de eps
             queenName = text;
         }
      } else if (colIndex >= ep1Index && queenName) {
         // Agora estamos nas colunas de episódios
         if (text === 'WINNER' || text.includes('WINNER')) {
            console.log(`[Ep ${currentEp}] ${queenName} -> winner`);
         } else if (text === 'ELIM' || text === 'OUT' || text.includes('ELIM')) {
            console.log(`[Ep ${currentEp}] ${queenName} -> eliminated`);
         }
         currentEp += colSpan;
      }
      
      colIndex += colSpan;
    });
  });
}

async function run() {
  await testSeason("RuPaul's_Drag_Race_(Season_13)");
}

run();
