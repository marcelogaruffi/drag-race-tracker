const fs = require('fs');

const franchises = [
  { id: 'us-all-stars', search: 'RuPaul\'s_Drag_Race_All_Stars' },
  { id: 'us-all-stars-untucked', search: 'RuPaul\'s_Drag_Race_All_Stars:_Untucked!' },
  { id: 'can-all-stars', search: 'Canada\'s_Drag_Race:_Canada_vs._The_World' },
  { id: 'us-regular', search: 'RuPaul\'s_Drag_Race' },
  { id: 'us-untucked', search: 'RuPaul\'s_Drag_Race:_Untucked!' },
  { id: 'can-regular', search: 'Canada\'s_Drag_Race' },
  { id: 'belgique', search: 'Drag_Race_Belgique' },
  { id: 'brasil', search: 'Drag_Race_Brasil' },
  { id: 'down-under', search: 'RuPaul\'s_Drag_Race_Down_Under' },
  { id: 'down-under-vs-tw', search: 'RuPaul\'s_Drag_Race_Down_Under_vs._The_World' },
  { id: 'espana', search: 'Drag_Race_España' },
  { id: 'espana-all-stars', search: 'Drag_Race_España_All_Stars' },
  { id: 'france', search: 'Drag_Race_France' },
  { id: 'france-all-stars', search: 'Drag_Race_France_All_Stars' },
  { id: 'germany', search: 'Drag_Race_Germany' },
  { id: 'holland', search: 'Drag_Race_Holland' },
  { id: 'italia', search: 'Drag_Race_Italia' },
  { id: 'mexico', search: 'Drag_Race_México' },
  { id: 'mexico-el-recuento', search: 'Drag_Race_México' }, // fallback
  { id: 'mexico-latina-royale', search: 'Drag_Race_México' }, // fallback
  { id: 'philippines', search: 'Drag_Race_Philippines' },
  { id: 'philippines-slaysian', search: 'Drag_Race_Philippines' }, // fallback
  { id: 'philippines-untucked', search: 'Drag_Race_Philippines:_Untucked!' },
  { id: 'sverige', search: 'Drag_Race_Sverige' },
  { id: 'thailand', search: 'Drag_Race_Thailand' },
  { id: 'global-all-stars', search: 'RuPaul\'s_Drag_Race_Global_All_Stars' },
  { id: 'uk-regular', search: 'RuPaul\'s_Drag_Race_UK' },
  { id: 'uk-vs-tw', search: 'RuPaul\'s_Drag_Race_UK_vs._The_World' },
  { id: 'secret-celebrity', search: 'RuPaul\'s_Secret_Celebrity_Drag_Race' },
  { id: 'ruvealed-us', search: 'RuVealed' }
];

async function generateSql() {
  let sql = 'ALTER TABLE franchises ADD COLUMN IF NOT EXISTS cover_image text;\n\n';
  
  for (const franchise of franchises) {
    try {
      const url = `https://rupaulsdragrace.fandom.com/api.php?action=query&titles=${encodeURIComponent(franchise.search)}&prop=pageimages&format=json&pithumbsize=600`;
      const res = await fetch(url);
      const data = await res.json();
      
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      
      let imageUrl = null;
      if (pageId !== '-1' && pages[pageId].thumbnail) {
        imageUrl = pages[pageId].thumbnail.source;
      }
      
      if (imageUrl) {
        sql += `UPDATE franchises SET cover_image = '${imageUrl.replace(/'/g, "''")}' WHERE id = '${franchise.id}';\n`;
      }
    } catch (e) {
      console.error(`Failed to fetch for ${franchise.id}:`, e.message);
    }
  }
  
  fs.writeFileSync('scripts/update_covers.sql', sql);
  console.log('SQL generated at scripts/update_covers.sql');
}

generateSql();
