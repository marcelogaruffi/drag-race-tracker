const fs = require('fs');

const queries = [
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

async function generateTVMazeCovers() {
  let sql = '-- TVMaze Posters\n';
  
  for (const item of queries) {
    try {
      const res = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(item.q)}`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        // Pega o primeiro resultado (o mais relevante)
        const show = data[0].show;
        if (show.image && show.image.original) {
          sql += `UPDATE franchises SET cover_image = '${show.image.original}' WHERE id = '${item.id}';\n`;
        }
      }
    } catch (e) {
      console.error(`Error fetching ${item.q}`, e.message);
    }
  }
  
  fs.writeFileSync('scripts/tvmaze_covers.sql', sql);
  console.log('SQL generated at scripts/tvmaze_covers.sql');
}

generateTVMazeCovers();
