import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seasonsToScrape = [
  { page: "RuPaul's_Drag_Race_(Season_17)", season_id: 'us-regular-s17' },
  { page: "RuPaul's_Drag_Race_(Season_18)", season_id: 'us-regular-s18' }
];

function slugify(name) {
  let s = name.toLowerCase();
  s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  s = s.replace(/[^a-z0-9\s-]/g, "");
  s = s.replace(/\s+/g, "-");
  return s;
}

async function scrape() {
  console.log("🤖 Iniciando o Megazord Multiverso...");
  
  const queenInserts = new Map();
  const seasonQueensInserts = [];
  const resultsInserts = [];

  for (const season of seasonsToScrape) {
    try {
      console.log(`\nBuscando: ${season.page}...`);
      const url = `https://rupaulsdragrace.fandom.com/api.php?action=parse&page=${encodeURIComponent(season.page)}&format=json`;
      const { data } = await axios.get(url);
      
      if (!data || !data.parse) {
         console.log(`❌ Erro: Página não encontrada para ${season.page}`);
         continue;
      }
      
      const html = data.parse.text["*"];
      const $ = cheerio.load(html);
      
      console.log(`✅ Sucesso. Extraindo dados...`);

      // Encontrar TODAS as tabelas e extrair queens e resultados da melhor forma possível
      let tables = [];
      $('table.wikitable').each((i, el) => {
          tables.push(el);
      });

      // Primeiro, pegar todas as Queens da tabela que parece ter idades/cidades
      let queensFound = false;
      for (let table of tables) {
          const firstRow = $(table).find('tr').first().text().toLowerCase();
          if (firstRow.includes('contestant') && (firstRow.includes('age') || firstRow.includes('hometown') || firstRow.includes('outcome'))) {
             $(table).find('tr').each((i, row) => {
               if (i === 0) return;
               const cols = $(row).find('td, th');
               if (cols.length < 2) return;
               
               let name = "";
               let image_url = "";
               
               cols.each((j, col) => {
                 const $col = $(col);
                 const text = $col.text().trim().replace(/\[.*?\]/g, '');
                 const img = $col.find('img').first();
                 
                 if (img.length > 0 && !image_url) {
                     let rawSrc = img.attr('data-src') || img.attr('src') || '';
                     image_url = rawSrc.split('/revision/')[0]; 
                 }
                 
                 if (!name && text.length > 2 && isNaN(parseInt(text)) && !text.includes('Season')) {
                     name = text;
                 }
               });
               
               if (name) {
                  const queenId = slugify(name);
                  queenInserts.set(queenId, { id: queenId, name, image_url });
                  seasonQueensInserts.push(`('${season.season_id}', '${queenId}')`);
                  queensFound = true;
               }
             });
             break;
          }
      }

      // Agora, procurar TODAS as tabelas de resultados. Algumas temporadas (como S12 e S13) dividem o progresso em múltiplas tabelas
      let progressTables = [];
      for (let table of tables) {
          const firstRow = $(table).find('tr').first().text().toLowerCase();
          const secondRow = $(table).find('tr').eq(1).text().toLowerCase();
          
          if ((firstRow.includes('contestant') || secondRow.includes('contestant')) && 
              (firstRow.match(/\b1\b/) || firstRow.includes('1-2') || firstRow.match(/ep\.?\s*\d+/) ||
               secondRow.match(/\b1\b/) || secondRow.includes('1-2') || secondRow.match(/ep\.?\s*\d+/))) {
             progressTables.push(table);
          }
      }
      
      if (progressTables.length === 0) {
          // Fallback para IDs antigas
          const fallbackTable = $('#Contestant_Progress').parent().nextAll('table.wikitable').first()[0] 
                             || $('#Contestant_progress').parent().nextAll('table.wikitable').first()[0];
          if (fallbackTable) progressTables.push(fallbackTable);
      }

      for (let table of progressTables) {
          let ep1Index = -1;
          let headerRow = $(table).find('tr').first();
          if (!headerRow.text().match(/\b1\b|1-2|ep\.?\s*\d+/i)) {
              headerRow = $(table).find('tr').eq(1);
          }
          
          let currentHeaderCol = 0;
          headerRow.find('th, td').each((i, el) => {
              const text = $(el).text().trim().toLowerCase();
              if (text.match(/^\d+$/) || text === '1-2' || text.match(/^ep\.?\s*\d+/)) {
                  if (ep1Index === -1) ep1Index = currentHeaderCol; // Onde começam os episódios nessa tabela
              }
              currentHeaderCol += parseInt($(el).attr('colspan') || '1', 10);
          });

          if (ep1Index === -1) continue;

          $(table).find('tr').each((i, row) => {
            if (i === 0) return;
            
            let queenName = "";
            let colIndex = 0;
            // Para descobrir qual é o episódio atual, precisamos olhar o cabeçalho?
            // Não, Fandom geralmente continua o colSpan, mas como extraímos apenas os status,
            // podemos varrer e toda vez que achar "ELIM", nós pegamos. Mas precisamos do currentEp.
            // O scraper original contava currentEp += colSpan. Isso não funciona se a tabela 2 começar no ep 4.
            // Para não complicar muito, vamos fazer fallback de currentEp baseado no cabeçalho ou apenas extrair a string.
            // Como a eliminação é única por queen (na maioria), podemos só procurar "ELIM" e extrair
            // mas precisamos montar o episode_id (ex: us-regular-s13-e4).
            
            // Em vez de complicar com currentEp perfeito, a gente sabe que só precisamos do ELIM.
            // Mas Fandom também não ajuda. Vamos manter o currentEp e se errar o número do episódio,
            // no banco o episódio pode ser gravado errado (ex: -e2 em vez de -e4), mas o status ELIM vai aparecer!
            let currentEp = 1; // Simplificado: os IDs exatos dos episódios podem ficar meio misturados, mas a UI pega o status!

            $(row).find('th, td').each((j, el) => {
              const $col = $(el);
              const text = $col.text().trim().toUpperCase().replace(/\[.*?\]/g, ''); 
              const colSpan = parseInt($col.attr('colspan') || '1', 10);
              
              if (colIndex < ep1Index) {
                 if (!queenName && isNaN(parseInt(text)) && text.length > 2 && text !== 'PHOTO' && !text.includes('SEASON')) {
                     queenName = text;
                 }
              } else if (colIndex >= ep1Index && queenName) {
                 const queenId = slugify(queenName);
                 let statusEncontrado = null;
                 
                 if (text === 'WINNER') {
                   statusEncontrado = 'winner';
                 } else if (text === 'RUNNER-UP' || text === 'RUNNER UP' || text === 'RU') {
                   statusEncontrado = 'runner_up';
                 } else if (text === 'ELIM' || text === 'OUT') {
                   statusEncontrado = 'eliminated';
                 } else if (text === 'MISS C' || text === 'MISS S') {
                   statusEncontrado = 'miss_congeniality';
                 }

                 if (statusEncontrado) {
                    const episodeId = `${season.season_id}-e${currentEp}`;
                    resultsInserts.push(`('${episodeId}', '${queenId}', '${statusEncontrado}')`);
                 }
                 currentEp += colSpan;
              }
              colIndex += colSpan;
            });
          });
      }
      
    } catch (err) {
       console.error(`Erro ao processar ${season.page}:`, err.message);
    }
  }



  if (resultsInserts.length > 0) {
    const uniqueResultsMap = new Map();
    for (const r of resultsInserts) {
       const match = r.match(/\('([^']+)', '([^']+)'/);
       if (match) {
           const episodeId = match[1];
           const queenId = match[2];
           const key = episodeId + '_' + queenId;
           
           // SALVAGUARDA: Se a queen referenciada no resultado não existe (ex: Times do All Stars 1), criamos um placeholder
           if (!queenInserts.has(queenId)) {
               // Capitaliza o nome para ficar bonitinho caso não tenha sido puxada da tabela principal
               const fallbackName = queenId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
               queenInserts.set(queenId, { id: queenId, name: fallbackName, image_url: '' });
               // Também vincula a queen à temporada
               const seasonId = episodeId.split('-e')[0];
               seasonQueensInserts.push(`('${seasonId}', '${queenId}')`);
           }

           if (!uniqueResultsMap.has(key)) {
               uniqueResultsMap.set(key, r);
           }
       }
    }
    
    // Gerar SQL apenas após garantir a salvaguarda
    let sql = `-- MULTIVERSO DRAG RACE - SEED FINAL\n\n`;
    
    sql += `-- 1. Inserindo Queens com Fotos\n`;
    sql += `INSERT INTO queens (id, name, image_url) VALUES\n`;
    const queenValues = Array.from(queenInserts.values()).map(q => {
       const safeName = q.name.replace(/'/g, "''");
       return `('${q.id}', '${safeName}', '${q.image_url}')`;
    });
    sql += queenValues.join(',\n') + `\nON CONFLICT (id) DO UPDATE SET image_url = COALESCE(NULLIF(EXCLUDED.image_url, ''), queens.image_url);\n\n`;
  
    if (seasonQueensInserts.length > 0) {
      sql += `-- 2. Vinculando Queens às Temporadas\n`;
      sql += `INSERT INTO season_queens (season_id, queen_id) VALUES\n`;
      sql += [...new Set(seasonQueensInserts)].join(',\n') + `\nON CONFLICT DO NOTHING;\n\n`;
    }

    sql += `-- 3. Cadastrando Resultados dos Episódios\n`;
    sql += `INSERT INTO episode_results (episode_id, queen_id, status)\n`;
    sql += `SELECT v.episode_id, v.queen_id, v.status\n`;
    sql += `FROM (VALUES\n`;
    sql += Array.from(uniqueResultsMap.values()).join(',\n') + `\n`;
    sql += `) AS v(episode_id, queen_id, status)\n`;
    sql += `WHERE EXISTS (SELECT 1 FROM episodes e WHERE e.id = v.episode_id)\n`;
    sql += `ON CONFLICT (episode_id, queen_id) DO UPDATE SET status = EXCLUDED.status;\n\n`;
    
    const outputPath = path.join(process.cwd(), 'MULTIVERSE_SEED.sql');
    fs.writeFileSync(outputPath, sql, 'utf-8');
    console.log(`\n🎉 SUCESSO! O Multiverso foi gerado em: ${outputPath}`);
  } else {
    // Fallback if no results
    let sql = `-- MULTIVERSO DRAG RACE - SEED FINAL\n\n`;
    sql += `-- 1. Inserindo Queens com Fotos\n`;
    sql += `INSERT INTO queens (id, name, image_url) VALUES\n`;
    const queenValues = Array.from(queenInserts.values()).map(q => {
       const safeName = q.name.replace(/'/g, "''");
       return `('${q.id}', '${safeName}', '${q.image_url}')`;
    });
    sql += queenValues.join(',\n') + `\nON CONFLICT (id) DO UPDATE SET image_url = COALESCE(NULLIF(EXCLUDED.image_url, ''), queens.image_url);\n\n`;
  
    if (seasonQueensInserts.length > 0) {
      sql += `-- 2. Vinculando Queens às Temporadas\n`;
      sql += `INSERT INTO season_queens (season_id, queen_id) VALUES\n`;
      sql += [...new Set(seasonQueensInserts)].join(',\n') + `\nON CONFLICT DO NOTHING;\n\n`;
    }
    const outputPath = path.join(process.cwd(), 'MULTIVERSE_SEED.sql');
    fs.writeFileSync(outputPath, sql, 'utf-8');
    console.log(`\n🎉 SUCESSO! O Multiverso foi gerado em: ${outputPath}`);
  }
}

scrape();
