import * as cheerio from 'cheerio';

async function run() {
    const pages = [
        'RuPaul%27s_Drag_Race_All_Stars_Untucked_(Season_1)',
        'Drag_Race_Philippines_Untucked_(Season_1)'
    ];

    for (const page of pages) {
        const res = await fetch(`https://rupaulsdragrace.fandom.com/api.php?action=parse&page=${page}&prop=text&format=json`);
        const data = await res.json();
        const $ = cheerio.load(data.parse.text['*']);
        const img = $('.pi-image-thumbnail').attr('src') || $('.pi-image-thumbnail').attr('data-src');
        console.log(page, img);
    }
}

run();
