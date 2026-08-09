const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeWikipedia() {
  console.log("Starting Wikipedia scraper for Drag Race Queens...");
  let sql = `-- Seed Queens from Wikipedia\n`;
  
  // 1. Scrape US Regular
  console.log("Fetching US Regular contestants...");
  const res = await fetch("https://en.wikipedia.org/wiki/List_of_RuPaul%27s_Drag_Race_contestants");
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const queens = new Map();
  const seasonQueens = [];
  
  // Achar a tabela principal de participantes
  $('table.wikitable.sortable tbody tr').each((i, el) => {
    const cols = $(el).find('td, th');
    if (cols.length >= 5) {
      let name = $(cols[0]).text().trim().replace(/'/g, "''");
      // Remover referências ex: Name[a]
      name = name.replace(/\[.*?\]/g, "");
      
      let seasonRaw = $(cols[3]).text().trim();
      let placement = $(cols[4]).text().trim();
      
      // Parse season (ex: "Season 1", "Season 10")
      const seasonMatch = seasonRaw.match(/Season\s+(\d+)/i);
      if (seasonMatch && name && name !== 'Contestant') {
        const seasonNum = seasonMatch[1];
        const queenId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const seasonId = `us-regular-s${seasonNum}`;
        
        queens.set(queenId, name);
        seasonQueens.push({ seasonId, queenId, placement });
      }
    }
  });

  // 2. Scrape All Stars
  console.log("Fetching All Stars contestants...");
  const resAS = await fetch("https://en.wikipedia.org/wiki/List_of_RuPaul%27s_Drag_Race_All_Stars_contestants");
  const htmlAS = await resAS.text();
  const $as = cheerio.load(htmlAS);
  
  $as('table.wikitable.sortable tbody tr').each((i, el) => {
    const cols = $as(el).find('td, th');
    if (cols.length >= 4) {
      let name = $as(cols[0]).text().trim().replace(/'/g, "''");
      name = name.replace(/\[.*?\]/g, "");
      
      let seasonRaw = $as(cols[1]).text().trim(); // Original season might be col 1, let's assume it's All Stars season in col 3 or something.
      // Usually All Stars table: Name, Original Season, All Stars Season, Placement
      let asSeasonRaw = $as(cols[2]).text().trim();
      let placement = $as(cols[3]).text().trim();
      
      const seasonMatch = asSeasonRaw.match(/Season\s+(\d+)/i) || asSeasonRaw.match(/All Stars\s+(\d+)/i) || asSeasonRaw.match(/(\d+)/);
      if (seasonMatch && name && name !== 'Contestant') {
        const seasonNum = seasonMatch[1];
        const queenId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const seasonId = `us-all-stars-s${seasonNum}`;
        
        queens.set(queenId, name);
        seasonQueens.push({ seasonId, queenId, placement });
      }
    }
  });

  // Generate SQL
  console.log(`Found ${queens.size} unique queens and ${seasonQueens.length} appearances!`);
  
  sql += `\n-- Insert Queens\n`;
  for (const [id, name] of queens.entries()) {
    sql += `INSERT INTO queens (id, name) VALUES ('${id}', '${name}') ON CONFLICT DO NOTHING;\n`;
  }
  
  sql += `\n-- Insert Appearances\n`;
  for (const sq of seasonQueens) {
    sql += `INSERT INTO season_queens (season_id, queen_id, placement) VALUES ('${sq.seasonId}', '${sq.queenId}', '${sq.placement}') ON CONFLICT DO NOTHING;\n`;
  }
  
  fs.writeFileSync('scripts/seed_queens.sql', sql);
  console.log("Saved to scripts/seed_queens.sql");
}

scrapeWikipedia().catch(console.error);
