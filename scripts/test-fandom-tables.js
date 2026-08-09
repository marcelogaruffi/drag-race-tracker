const axios = require('axios');
const cheerio = require('cheerio');

axios.get('https://rupaulsdragrace.fandom.com/api.php?action=parse&page=RuPaul%27s_Drag_Race_(Season_1)&format=json')
  .then(r => {
    const $ = cheerio.load(r.data.parse.text['*']);
    $('table.wikitable').each((i, el) => {
      console.log('Table ' + i + ' First Row: ' + $(el).find('tr').first().text().trim().replace(/\s+/g, ' '));
      
      const secondRow = $(el).find('tr').eq(1).text().trim().replace(/\s+/g, ' ');
      console.log('Table ' + i + ' Second Row: ' + secondRow);
    });
  });
