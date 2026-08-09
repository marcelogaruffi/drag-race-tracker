import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seasonsToScrape = [
  { url: 'https://en.wikipedia.org/wiki/Canada%27s_Drag_Race_season_1', season_id: 'can-regular-s1' },
  { url: 'https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_1', season_id: 'us-regular-s1' },
  { url: 'https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_2', season_id: 'us-regular-s2' },
  { url: 'https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_8', season_id: 'us-all-stars-s8' },
  { url: 'https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_UK_series_1', season_id: 'uk-regular-s1' },
  { url: 'https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_UK_vs_the_World_series_1', season_id: 'uk-vs-tw-s1' },
];

function slugify(name) {
  let s = name.toLowerCase();
  s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  s = s.replace(/[^a-z0-9\s-]/g, "");
  s = s.replace(/\s+/g, "-");
  return s;
}

async function scrape() {
  console.log("Iniciando a raspagem de dados (Robô Caçador de Spoilers)...");
  
  const values = [];

  for (const season of seasonsToScrape) {
    try {
      console.log(`\nBuscando tabela da temporada: ${season.season_id}...`);
      const { data } = await axios.get(season.url, {
        headers: {
          'User-Agent': 'DragRaceTrackerBot/1.0 (https://github.com/my-project; myemail@example.com) axios/1.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5'
        }
      });
      const $ = cheerio.load(data);
      
      let table = null;
      // Procura tabelas que contenham cabeçalhos típicos de track record
      $('table.wikitable').each((i, el) => {
        const text = $(el).find('tr').first().text().toLowerCase();
        if (text.includes('contestant') || text.includes('queen')) {
          table = el;
          return false; // break
        }
      });

      if (!table) {
        console.log(`❌ Não achou a tabela de Track Record para ${season.season_id}`);
        continue;
      }

      console.log(`✅ Tabela encontrada. Extraindo eliminações...`);

      const rows = $(table).find('tr');
      
      rows.each((i, row) => {
        if (i === 0) return; // pular cabeçalho
        
        const cols = $(row).find('td, th');
        if (cols.length < 2) return;
        
        let queenName = "";
        let currentEp = 1;

        cols.each((j, col) => {
          const $col = $(col);
          const rawText = $col.text().trim();
          const text = rawText.toUpperCase().replace(/\[.*?\]/g, ''); // remove notas de rodapé [1]
          const bgClass = $col.attr('class') || '';
          const colSpan = parseInt($col.attr('colspan') || '1', 10);
          
          // Heurística para achar o nome da Queen (geralmente é a primeira célula longa que não é número nem título)
          if (!queenName) {
            // Ignorar números (posições) ou a palavra Contestant/Age
            if (isNaN(parseInt(text)) && text.length > 2 && !['CONTESTANT', 'QUEEN', 'AGE', 'HOMETOWN'].includes(text)) {
              queenName = text;
            }
            return; // vai pra próxima célula
          }

          // Se achou o nome, as próximas células curtas provavelmente são os episódios
          if (text.length > 15) return; // ignora cidade/hometown
          if (!isNaN(parseInt(text)) && text.length < 3) return; // ignora idade

          const queenId = slugify(queenName);
          let statusEncontrado = null;

          if (text === 'ELIM' || text === 'OUT' || bgClass.includes('eliminated') || text.includes('ELIM')) {
            statusEncontrado = 'eliminated';
          } else if (text === 'WINNER' || text.includes('WINNER') || bgClass.includes('winner')) {
            statusEncontrado = 'winner';
          } else if (text === 'RUNNER-UP' || text === 'RUNNER UP' || text === 'RU') {
            statusEncontrado = 'runner_up';
          } else if (text === 'MISS C' || text.includes('CONGENIALITY')) {
            statusEncontrado = 'miss_congeniality';
          }

          if (statusEncontrado) {
             const episodeId = `${season.season_id}-e${currentEp}`;
             values.push(`  ('${episodeId}', '${queenId}', '${statusEncontrado}')`);
             console.log(`   -> [Ep ${currentEp}] ${queenName} (${queenId}): ${statusEncontrado}`);
          }
          
          // Avança o número do episódio baseado no colspan (ex: ficou ausente 2 eps, ou é safe em ep duplo)
          // Mas na prática de tabelas da wiki, colspan > 1 geralmente significa ausente até voltar. 
          currentEp += colSpan;
        });
      });
      
    } catch (err) {
       console.error(`Erro ao processar ${season.season_id}:`, err.message);
    }
  }

  // Gera o arquivo final
  if (values.length > 0) {
    let sql = `-- AUTO GENERATED EPISODE RESULTS BY ROBÔ CAÇADOR DE SPOILERS\n\n`;
    sql += `INSERT INTO episode_results (episode_id, queen_id, status) VALUES\n`;
    sql += values.join(',\n');
    sql += `\nON CONFLICT DO NOTHING;\n`;

    const outputPath = path.join(__dirname, 'SEED_RESULTS_AUTOMATICO.sql');
    fs.writeFileSync(outputPath, sql, 'utf-8');
    console.log(`\n🎉 SUCESSO! Arquivo gerado com ${values.length} resultados em: ${outputPath}`);
  } else {
    console.log("\n⚠️ Nenhum resultado foi extraído. Verifique o console.");
  }
}

scrape();
