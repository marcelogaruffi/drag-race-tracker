import axios from 'axios';
import * as cheerio from 'cheerio';

async function testSeason(pageName) {
  const url = `https://rupaulsdragrace.fandom.com/api.php?action=parse&page=${encodeURIComponent(pageName)}&format=json`;
  const { data } = await axios.get(url);
  const $ = cheerio.load(data.parse.text["*"]);

  let progressTable = null;
  $('table.wikitable').each((i, el) => {
    const firstRowText = $(el).find('tr').first().text().toLowerCase();
    const secondRowText = $(el).find('tr').eq(1).text().toLowerCase();
    
    if ((firstRowText.includes('contestant') || secondRowText.includes('contestant')) && 
        (firstRowText.match(/\b1\b/) || firstRowText.includes('ep. 1') || firstRowText.includes('ep 1') ||
         secondRowText.match(/\b1\b/) || secondRowText.includes('ep. 1') || secondRowText.includes('ep 1'))) {
       progressTable = el;
       return false;
    }
  });

  let ep1Index = 5; // We saw it starts at 5 for Symone
  $(progressTable).find('tr').each((i, row) => {
    if (i < 2) return;
    let queenName = "";
    let colIndex = 0;
    let currentEp = 1;
    $(row).find('th, td').each((j, el) => {
        const $col = $(el);
        const text = $col.text().trim().toUpperCase().replace(/\[.*?\]/g, ''); 
        const colSpan = parseInt($col.attr('colspan') || '1', 10);
        
        if (colIndex < ep1Index) {
          if (!queenName && isNaN(parseInt(text)) && text.length > 2 && text !== 'PHOTO' && !text.includes('SEASON')) {
              queenName = text;
          }
        } else if (colIndex >= ep1Index && queenName) {
           console.log(`[Ep ${currentEp}] ${queenName} -> ${text}`);
           if (text === 'ELIM' || text === 'OUT') {
               console.log(`[Ep ${currentEp}] ${queenName} -> eliminated`);
           }
           currentEp += colSpan;
        }
        colIndex += colSpan;
    });
  });
}

testSeason("RuPaul's_Drag_Race_(Season_13)");
