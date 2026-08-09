const fs = require('fs');

const franchises = [
  { id: 'us-regular', q: 'RuPaul\'s Drag Race' },
  { id: 'us-all-stars', q: 'RuPaul\'s Drag Race All Stars' },
  { id: 'us-untucked', q: 'RuPaul\'s Drag Race: Untucked' },
  { id: 'can-regular', q: 'Canada\'s Drag Race' },
  { id: 'can-all-stars', q: 'Canada\'s Drag Race: Canada vs the World' }, // Note: we corrected this earlier
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

async function generateAllEpisodes() {
  let sql = 'DELETE FROM episodes;\n\n';
  sql += 'INSERT INTO episodes (id, season_id, title, episode_number, duration, air_date, thumb_image) VALUES \n';
  
  let values = [];

  for (const item of franchises) {
    try {
      // 1. Achar o show ID no TVMaze
      const res = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(item.q)}`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        const showId = data[0].show.id;
        
        // 2. Buscar TODOS os episódios do show
        const epRes = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
        const epData = await epRes.json();
        
        for (const ep of epData) {
          // Só pegamos episódios normais (season > 0)
          if (ep.season && ep.season > 0) {
            const seasonId = `${item.id}-s${ep.season}`;
            const id = `${seasonId}-e${ep.number || ep.id}`; // usar id como fallback se numero for nulo
            const title = ep.name.replace(/'/g, "''");
            const duration = ep.runtime ? ep.runtime : 'NULL';
            const airDate = ep.airdate ? `'${ep.airdate}'` : 'NULL';
            const thumb = ep.image && ep.image.original ? `'${ep.image.original}'` : 'NULL';
            const number = ep.number ? ep.number : 99; // Fallback for specials listed in normal season
            
            values.push(`('${id}', '${seasonId}', '${title}', ${number}, ${duration}, ${airDate}, ${thumb})`);
          }
        }
      }
      
      // Delay pequeno para não dar rate limit (TVMaze: 20 calls/10 seconds)
      await new Promise(r => setTimeout(r, 200));
    } catch (e) {
      console.error(`Error fetching episodes for ${item.q}`, e.message);
    }
  }
  
  sql += values.join(',\n') + ';\n';
  
  fs.writeFileSync('scripts/seed_all_episodes_massive.sql', sql);
  console.log('Massive SQL generated at scripts/seed_all_episodes_massive.sql');
}

generateAllEpisodes();
