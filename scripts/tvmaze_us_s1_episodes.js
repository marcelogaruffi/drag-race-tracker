const fs = require('fs');

async function generateEpisodes() {
  const showQ = "RuPaul's Drag Race";
  
  try {
    const res = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(showQ)}`);
    const data = await res.json();
    const showId = data[0].show.id;
    
    // Fetch seasons
    const seasonsRes = await fetch(`https://api.tvmaze.com/shows/${showId}/seasons`);
    const seasonsData = await seasonsRes.json();
    
    // Find season 1
    const s1 = seasonsData.find(s => s.number === 1);
    
    // Fetch episodes for S1
    const epRes = await fetch(`https://api.tvmaze.com/seasons/${s1.id}/episodes`);
    const epData = await epRes.json();
    
    let sql = 'DELETE FROM episodes WHERE season_id = \'us-regular-s1\';\n\n';
    sql += 'INSERT INTO episodes (id, season_id, name, episode_number, duration, air_date, thumb_image) VALUES \n';
    
    let values = [];
    for (const ep of epData) {
      const id = `us-regular-s1-e${ep.number}`;
      const name = ep.name.replace(/'/g, "''");
      const duration = ep.runtime ? ep.runtime : 'NULL';
      const airDate = ep.airdate ? `'${ep.airdate}'` : 'NULL';
      const thumb = ep.image && ep.image.original ? `'${ep.image.original}'` : 'NULL';
      
      values.push(`('${id}', 'us-regular-s1', '${name}', ${ep.number}, ${duration}, ${airDate}, ${thumb})`);
    }
    
    sql += values.join(',\n') + ';\n';
    
    fs.writeFileSync('scripts/seed_us_s1_episodes.sql', sql);
    console.log('SQL generated for S1 episodes');
  } catch (e) {
    console.error(e);
  }
}

generateEpisodes();
