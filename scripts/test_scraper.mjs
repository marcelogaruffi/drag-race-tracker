import * as cheerio from 'cheerio';

async function test(pageName) {
  console.log('Fetching', pageName);
  const res = await fetch(`https://rupaulsdragrace.fandom.com/api.php?action=parse&page=${encodeURIComponent(pageName)}&prop=text&format=json`);
  const data = await res.json();
  if (!data.parse || !data.parse.text) {
    console.log('Page not found');
    return;
  }
  const html = data.parse.text['*'];
  const $ = cheerio.load(html);

  const tables = $('.wikitable');
  console.log(`Found ${tables.length} wikitables.`);

  // Cast table is usually the first or second
  let castTable = null;
  tables.each((i, table) => {
    const text = $(table).text().toLowerCase();
    if (text.includes('contestant') || text.includes('queen') || text.includes('drag name')) {
      if (!castTable) castTable = table;
    }
  });

  if (castTable) {
    console.log('--- CAST ---');
    $(castTable).find('tr').each((i, tr) => {
      if (i === 0) return; // header
      const cols = $(tr).find('td, th');
      
      // Achar a coluna que tem a imagem pra pegar o nome dela
      let name = "";
      let img = "";
      cols.each((j, col) => {
          const hasImg = $(col).find('img').length > 0;
          if (hasImg) {
              name = $(col).text().trim() || $(col).next().text().trim();
              img = $(col).find('img').attr('src') || $(col).find('img').attr('data-src');
          }
      });

      if (!name) name = $(cols[0]).text().trim();
      let outcome = $(cols[cols.length - 1]).text().trim();
      
      if (img && img.includes('/scale-to-width-down/')) {
         img = img.replace(/\/scale-to-width-down\/\d+/, '/scale-to-width-down/400');
      }

      console.log(`Name: ${name}, Outcome: ${outcome}, Image: ${img}`);
    });
  }

}

test('Drag Race Down Under vs The World (Season 1)');
