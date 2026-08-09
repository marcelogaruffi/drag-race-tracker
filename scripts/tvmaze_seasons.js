const fs = require('fs');

const franchises = [
  { id: 'us-regular', q: 'RuPaul\'s Drag Race' },
  { id: 'us-all-stars', q: 'RuPaul\'s Drag Race All Stars' },
  { id: 'us-untucked', q: 'RuPaul\'s Drag Race: Untucked' },
  { id: 'can-regular', q: 'Canada\'s Drag Race' },
  { id: 'can-vs-tw', q: 'Canada\'s Drag Race: Canada vs the World' },
  { id: 'belgique', q: 'Drag Race Belgique' },
  { id: 'brasil', q: 'Drag Race Brasil' },
  { id: 'down-under', q: 'RuPaul\'s Drag Race Down Under' },
  { id: 'espana', q: 'Drag Race España' },
  { id: 'espana-all-stars', q: 'Drag Race España All Stars' },
  { id: 'france', q: 'Drag Race France' },
  { id: 'germany', q: 'Drag Race Germany' },
  { id: 'holland', q: 'Drag Race Holland' },
  { id: 'italia', q: 'Drag Race Italia' },
  { id: 'mexico', q: 'Drag Race México' },
  { id: 'philippines', q: 'Drag Race Philippines' },
  { id: 'sverige', q: 'Drag Race Sverige' },
  { id: 'thailand', q: 'Drag Race Thailand' },
  { id: 'global-all-stars', q: 'RuPaul\'s Drag Race Global All Stars' },
  { id: 'uk-regular', q: 'RuPaul\'s Drag Race UK' },
  { id: 'uk-vs-tw', q: 'RuPaul\'s Drag Race UK vs the World' },
  { id: 'secret-celebrity', q: 'RuPaul\'s Secret Celebrity Drag Race' }
];

async function generateTVMazeSeasons() {
  let sql = 'DELETE FROM seasons;\n\n';
  sql += 'INSERT INTO seasons (id, franchise_id, name, release_year, type, cover_image) VALUES \n';
  let values = [];

  for (const item of franchises) {
    try {
      const res = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(item.q)}`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        const showId = data[0].show.id;
        
        // Fetch seasons for this show
        const seasonsRes = await fetch(`https://api.tvmaze.com/shows/${showId}/seasons`);
        const seasonsData = await seasonsRes.json();
        
        for (const season of seasonsData) {
          // Ignorar temporadas especiais (season 0)
          if (season.number === null || season.number === 0) continue;

          const year = season.premiereDate ? season.premiereDate.substring(0, 4) : 'NULL';
          const cover = season.image && season.image.original ? `'${season.image.original}'` : 'NULL';
          const type = item.id.includes('all-stars') ? 'all_stars' : (item.id.includes('untucked') ? 'untucked' : 'regular');
          const name = `Season ${season.number}`;
          const id = `${item.id}-s${season.number}`;
          
          values.push(`('${id}', '${item.id}', '${name}', ${year}, '${type}', ${cover})`);
        }
      }
    } catch (e) {
      console.error(`Error fetching ${item.q}`, e.message);
    }
  }
  
  sql += values.join(',\n') + ';\n';
  
  fs.writeFileSync('scripts/seed_all_seasons.sql', sql);
  console.log('SQL generated at scripts/seed_all_seasons.sql');
}

generateTVMazeSeasons();
