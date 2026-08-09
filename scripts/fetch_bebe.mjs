import * as cheerio from 'cheerio';
async function run() {
    const res = await fetch(`https://rupaulsdragrace.fandom.com/api.php?action=parse&page=BeBe_Zahara_Benet&prop=text&format=json`);
    const data = await res.json();
    const $ = cheerio.load(data.parse.text['*']);
    const img = $('.pi-image-thumbnail').attr('src') || $('.pi-image-thumbnail').attr('data-src');
    console.log(img);
}
run();
