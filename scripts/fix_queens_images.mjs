import fs from 'fs';
import * as cheerio from 'cheerio';

const targetPages = {
    'global-all-stars': 'RuPaul%27s_Drag_Race_Global_All_Stars',
    'down-under-vs-tw': 'Drag_Race_Down_Under_vs_The_World_(Season_1)',
    'espana-all-stars': 'Drag_Race_Espa%C3%B1a:_All_Stars_(Season_1)',
    'france-all-stars': 'Drag_Race_France_All_Stars_(Season_1)',
    'mexico-latina-royale': 'Drag_Race_M%C3%A9xico:_Latina_Royale_(Season_1)',
    'philippines-slaysian': 'Drag_Race_Philippines:_Slaysian_Royale_(Season_1)',
    'down-under-s4': 'Drag_Race_Down_Under_(Season_4)',
    'france-s4': 'Drag_Race_France_(Season_4)'
};

function slugify(text) {
    if (!text) return '';
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function fixQueensImages() {
    let sqlUpdate = '-- FIX MISSING QUEEN IMAGES\n';
    
    for (const [franchiseId, pageSlug] of Object.entries(targetPages)) {
        try {
            const res = await fetch(`https://rupaulsdragrace.fandom.com/api.php?action=parse&page=${pageSlug}&prop=text&format=json`);
            const data = await res.json();
            if (data && data.parse) {
                const $ = cheerio.load(data.parse.text['*']);
                
                let castTable = null;
                $('.wikitable').each((i, table) => {
                    const text = $(table).text().toLowerCase();
                    if ((text.includes('contestant') || text.includes('queen') || text.includes('drag name')) && !text.includes('episode')) {
                        if (!castTable) castTable = table;
                    }
                });

                if (castTable) {
                    $(castTable).find('tr').each((i, tr) => {
                        if (i === 0) return;
                        const cols = $(tr).find('td, th');
                        
                        let name = "";
                        let img = "";
                        cols.each((j, col) => {
                            const hasImg = $(col).find('img').length > 0;
                            if (hasImg) {
                                name = $(col).text().trim();
                                if (!name) name = $(col).next().text().trim();
                                img = $(col).find('img').attr('data-src') || $(col).find('img').attr('src');
                            }
                        });

                        if (!name) name = $(cols[0]).text().trim();
                        
                        if (img && img.includes('/scale-to-width-down/')) {
                            img = img.replace(/\/scale-to-width-down\/\d+/, '/scale-to-width-down/400');
                        }

                        if (name && name !== 'Name' && name !== 'Contestant') {
                            name = name.replace(/\[[a-z]\]/g, '');
                            const qId = slugify(name);
                            if (img) {
                                sqlUpdate += `UPDATE public.queens SET image_url = '${img}' WHERE id = '${qId}';\n`;
                            }
                        }
                    });
                }
            }
        } catch (e) {
            console.log(`Failed to fetch queens for ${franchiseId}`, e);
        }
    }
    
    fs.writeFileSync('FIX_QUEENS_IMAGES.sql', sqlUpdate, 'utf8');
    console.log('Gerado FIX_QUEENS_IMAGES.sql');
}

fixQueensImages();
