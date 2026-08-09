import fs from 'fs';
import * as cheerio from 'cheerio';

const seasons = [
  { id: 'down-under-vs-tw-s1', franchise: 'down-under-vs-tw', page: 'Drag_Race_Down_Under_vs_The_World_(Season_1)' },
  { id: 'mexico-latina-royale-s1', franchise: 'mexico-latina-royale', page: 'Drag_Race_M%C3%A9xico:_Latina_Royale_(Season_1)' },
  { id: 'philippines-slaysian-s1', franchise: 'philippines-slaysian', page: 'Drag_Race_Philippines:_Slaysian_Royale_(Season_1)' },
  { id: 'france-s4', franchise: 'france', page: 'Drag_Race_France_(Season_4)' },
  { id: 'espana-all-stars-s1', franchise: 'espana-all-stars', page: 'Drag_Race_Espa%C3%B1a:_All_Stars_(Season_1)' },
  { id: 'france-all-stars-s1', franchise: 'france-all-stars', page: 'Drag_Race_France_All_Stars_(Season_1)' },
  { id: 'global-all-stars-s1', franchise: 'global-all-stars', page: 'RuPaul%27s_Drag_Race_Global_All_Stars' },
  { id: 'down-under-s4', franchise: 'down-under', page: 'Drag_Race_Down_Under_(Season_4)' },
  // Untucked não tem novas queens, mas vamos tratar depois se der tempo
];

function slugify(text) {
    if (!text) return '';
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function scrapeSeason(seasonInfo) {
  console.log(`\n\n--- Scraping ${seasonInfo.id} ---`);
  const res = await fetch(`https://rupaulsdragrace.fandom.com/api.php?action=parse&page=${seasonInfo.page}&prop=text&format=json`);
  const data = await res.json();
  if (!data.parse) {
      console.log('PAGE NOT FOUND');
      return;
  }
  const $ = cheerio.load(data.parse.text['*']);
  
  let castTable = null;
  $('.wikitable').each((i, table) => {
    const text = $(table).text().toLowerCase();
    if ((text.includes('contestant') || text.includes('queen') || text.includes('drag name')) && !text.includes('episode')) {
      if (!castTable) castTable = table;
    }
  });

  const queens = [];
  if (castTable) {
    $(castTable).find('tr').each((i, tr) => {
      if (i === 0) return;
      const cols = $(tr).find('td, th');
      
      let name = "";
      let img = "";
      cols.each((j, col) => {
          const hasImg = $(col).find('img').length > 0;
          if (hasImg) {
              name = $(col).text().trim();
              if (!name) name = $(col).next().text().trim();
              img = $(col).find('img').attr('data-src') || $(col).find('img').attr('src');
          }
      });

      if (!name) name = $(cols[0]).text().trim();
      let outcome = $(cols[cols.length - 1]).text().trim();
      
      if (img && img.includes('/scale-to-width-down/')) {
         img = img.replace(/\/scale-to-width-down\/\d+/, '/scale-to-width-down/400');
      }

      if (name && name !== 'Name' && name !== 'Contestant') {
          // Remover citações do nome ex: "Queen[a]"
          name = name.replace(/\[[a-z]\]/g, '');
          queens.push({ id: slugify(name), name, outcome, img });
      }
    });
  }

  let epTable = null;
  $('.wikitable').each((i, table) => {
    const text = $(table).text().toLowerCase();
    if (text.includes('original airdate') || text.includes('original release')) {
      if (!epTable) epTable = table;
    }
  });

  const episodes = [];
  if (epTable) {
    $(epTable).find('tr').each((i, tr) => {
       const hasTh = $(tr).find('th').length > 0;
       if ($(tr).attr('class') && $(tr).attr('class').includes('vevent')) {
           // episode row
           const td = $(tr).find('td');
           const title = $(td[0]).text().trim().replace(/"/g, '');
           const dateStr = $(td[td.length - 1]).text().trim();
           episodes.push({ title, dateStr });
       }
    });
  }

  console.log(`Extracted ${queens.length} queens and ${episodes.length} episodes`);
  if (queens.length > 0) console.log('Queen 1:', queens[0]);
  if (episodes.length > 0) console.log('Ep 1:', episodes[0]);

  return { season: seasonInfo, queens, episodes };
}

async function run() {
    const results = [];
    for (const s of seasons) {
        const data = await scrapeSeason(s);
        if (data) results.push(data);
    }
    fs.writeFileSync('fandom_scrape_results.json', JSON.stringify(results, null, 2));
}

run();
