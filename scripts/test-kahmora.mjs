import axios from 'axios';
import * as cheerio from 'cheerio';

async function testKahmora() {
  const url = `https://rupaulsdragrace.fandom.com/api.php?action=parse&page=RuPaul%27s_Drag_Race_(Season_13)&format=json`;
  const { data } = await axios.get(url);
  const $ = cheerio.load(data.parse.text["*"]);

  $('table.wikitable').each((i, table) => {
    $(table).find('tr').each((j, row) => {
       const text = $(row).text().toUpperCase();
       if (text.includes('KAHMORA')) {
          console.log("FOUND KAHMORA ROW!");
          $(row).find('td, th').each((k, col) => {
             console.log(`Col ${k}: ` + $(col).text().trim());
          });
       }
    });
  });
}

testKahmora();
