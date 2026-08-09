import * as cheerio from 'cheerio';

async function run() {
    const urls = ['Alexis_Mateo', 'Carmen_Carrera', 'Delta_Work', 'India_Ferrah', 'Mariah_Paris_Balenciaga', 'Mimi_Imfurst', 'Phoenix', 'Stacy_Layne_Matthews', 'Venus_D-Lite'];
    
    for (const u of urls) {
        const res = await fetch('https://rupaulsdragrace.fandom.com/api.php?action=parse&page='+u+'&prop=text&format=json');
        const data = await res.json();
        const $ = cheerio.load(data.parse.text['*']);
        const imgs = [];
        $('img').each((i, el) => {
            const src = $(el).attr('src') || $(el).attr('data-src');
            if (src && (src.includes('S3') || src.includes('Season_3'))) {
                // Ignore mugshots if we want full body
                if (!src.includes('Mug')) {
                    imgs.push(src.replace(/\/scale-to-width-down\/\d+/, '/scale-to-width-down/400').split('?')[0]);
                }
            }
        });
        console.log(u, imgs);
    }
}
run();
