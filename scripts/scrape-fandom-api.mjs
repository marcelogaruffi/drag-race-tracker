import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seasonsToScrape = [
  { page: "Canada's_Drag_Race_(Season_1)", season_id: 'can-regular-s1' },
  { page: "RuPaul's_Drag_Race_(Season_1)", season_id: 'us-regular-s1' },
  { page: "RuPaul's_Drag_Race_(Season_2)", season_id: 'us-regular-s2' },
  { page: "RuPaul's_Drag_Race_All_Stars_(Season_8)", season_id: 'us-all-stars-s8' },
  { page: "RuPaul's_Drag_Race_UK_(Series_1)", season_id: 'uk-regular-s1' },
  { page: "RuPaul's_Drag_Race_UK_vs_The_World_(Series_1)", season_id: 'uk-vs-tw-s1' },
];

function slugify(name) {
  let s = name.toLowerCase();
  s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  s = s.replace(/[^a-z0-9\s-]/g, "");
  s = s.replace(/\s+/g, "-");
  return s;
}

async function scrape() {
  console.log("🤖 Iniciando o Robô Definitivo (Fandom API)...");
  
  const queenInserts = new Map();
  const seasonQueensInserts = [];
  const resultsInserts = [];

  for (const season of seasonsToScrape) {
    try {
      console.log(`\nBuscando dados da API para: ${season.page}...`);
      const url = `https://rupaulsdragrace.fandom.com/api.php?action=parse&page=${encodeURIComponent(season.page)}&format=json`;
      const { data } = await axios.get(url);
      
      if (!data || !data.parse) {
         console.log(`❌ Erro: Página não encontrada ou API falhou para ${season.page}`);
         continue;
      }
      
      const html = data.parse.text["*"];
      const $ = cheerio.load(html);
      
      console.log(`✅ HTML carregado com sucesso.`);

      // 1. Extrair Queens e Imagens da Tabela "Contestants"
      let contestantsTable = null;
      $('table.wikitable').each((i, el) => {
        const text = $(el).find('tr').first().text().toLowerCase();
        if (text.includes('contestant') && (text.includes('age') || text.includes('hometown') || text.includes('outcome'))) {
          contestantsTable = el;
          return false;
        }
      });

      if (contestantsTable) {
        $(contestantsTable).find('tr').each((i, row) => {
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
             console.log(`   👑 Found Queen: ${name} (Image: ${image_url ? 'Yes' : 'No'})`);
          }
        });
      } else {
        console.log(`⚠️ Tabela 'Contestants' não encontrada.`);
      }

      // 2. Extrair Resultados da Tabela "Contestant Progress"
      let progressTable = null;
      $('table.wikitable').each((i, el) => {
        const text = $(el).find('tr').first().text().toLowerCase();
        if (text.includes('contestant') && text.includes('1')) {
           if (el !== contestantsTable) {
              progressTable = el;
              return false;
           }
        }
      });
      
      if (!progressTable) {
         progressTable = $('#Contestant_Progress').parent().nextAll('table.wikitable').first()[0] 
                      || $('#Contestant_progress').parent().nextAll('table.wikitable').first()[0];
      }

      if (progressTable) {
        $(progressTable).find('tr').each((i, row) => {
          if (i === 0) return;
          
          const cols = $(row).find('td, th');
          if (cols.length < 2) return;
          
          let queenName = "";
          let currentEp = 1;

          cols.each((j, col) => {
            const $col = $(col);
            const text = $col.text().trim().toUpperCase().replace(/\[.*?\]/g, ''); 
            const colSpan = parseInt($col.attr('colspan') || '1', 10);
            
            if (!queenName) {
              if (isNaN(parseInt(text)) && text.length > 2 && !['CONTESTANT', 'QUEEN'].includes(text)) {
                queenName = text;
              }
              return; 
            }

            if (text.length > 15) return; 
            if (!isNaN(parseInt(text)) && text.length < 3) return; 

            const queenId = slugify(queenName);
            let statusEncontrado = null;
            
            if (text === 'WINNER' || text.includes('WINNER')) {
              statusEncontrado = 'winner';
            } else if (text === 'RUNNER-UP' || text === 'RUNNER UP' || text === 'RU') {
              statusEncontrado = 'runner_up';
            } else if (text === 'ELIM' || text === 'OUT' || text.includes('ELIM')) {
              statusEncontrado = 'eliminated';
            } else if (text === 'MISS C' || text.includes('CONGENIALITY') || text === 'MISS S') {
              statusEncontrado = 'miss_congeniality';
            }

            if (statusEncontrado) {
               const episodeId = `${season.season_id}-e${currentEp}`;
               resultsInserts.push(`('${episodeId}', '${queenId}', '${statusEncontrado}')`);
               console.log(`   -> [Ep ${currentEp}] ${queenName}: ${statusEncontrado}`);
            }
            
            currentEp += colSpan;
          });
        });
      } else {
         console.log(`⚠️ Tabela 'Contestant Progress' não encontrada.`);
      }
      
    } catch (err) {
       console.error(`Erro ao processar ${season.page}:`, err.message);
    }
  }

  let sql = `-- O ROBÔ DEFINITIVO - FANDOM API SCRAPING\n\n`;
  
  sql += `-- 1. Inserindo Queens com Fotos\n`;
  sql += `INSERT INTO queens (id, name, image_url) VALUES\n`;
  const queenValues = Array.from(queenInserts.values()).map(q => {
     const safeName = q.name.replace(/'/g, "''");
     return `('${q.id}', '${safeName}', '${q.image_url}')`;
  });
  sql += queenValues.join(',\n') + `\nON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url;\n\n`;

  if (seasonQueensInserts.length > 0) {
    sql += `-- 2. Vinculando Queens às Temporadas\n`;
    sql += `INSERT INTO season_queens (season_id, queen_id) VALUES\n`;
    sql += [...new Set(seasonQueensInserts)].join(',\n') + `\nON CONFLICT DO NOTHING;\n\n`;
  }

  if (resultsInserts.length > 0) {
    sql += `-- 3. Cadastrando Resultados dos Episódios\n`;
    sql += `INSERT INTO episode_results (episode_id, queen_id, status) VALUES\n`;
    sql += resultsInserts.join(',\n') + `\nON CONFLICT DO NOTHING;\n\n`;
  }

  const outputPath = path.join(__dirname, 'SEED_TOTAL_AUTOMATICO.sql');
  fs.writeFileSync(outputPath, sql, 'utf-8');
  console.log(`\n🎉 SUCESSO! Arquivo gerado em: ${outputPath}`);
}

scrape();
