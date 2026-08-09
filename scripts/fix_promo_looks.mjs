import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

function getSeasonPageName(seasonId) {
    if (seasonId.startsWith('us-regular-s')) {
        const num = seasonId.replace('us-regular-s', '');
        return `RuPaul's_Drag_Race_(Season_${num})`;
    }
    if (seasonId.startsWith('us-all-stars-s')) {
        const num = seasonId.replace('us-all-stars-s', '');
        return `RuPaul's_Drag_Race_All_Stars_(Season_${num})`;
    }
    if (seasonId.startsWith('can-regular-s')) {
        const num = seasonId.replace('can-regular-s', '');
        return `Canada's_Drag_Race_(Season_${num})`;
    }
    if (seasonId.startsWith('uk-regular-s')) {
        const num = seasonId.replace('uk-regular-s', '');
        return `RuPaul's_Drag_Race_UK_(Series_${num})`;
    }
    return null;
}

async function scrapeSeasonPromos() {
    const { data: seasons } = await sb.from('seasons').select('id');
    const { data: seasonQueens } = await sb.from('season_queens').select('queen_id, season_id, queens(name)');
    
    let sqlOutput = `-- STANDARDIZED PROMO LOOKS\n\n`;

    for (const season of seasons) {
        const pageName = getSeasonPageName(season.id);
        if (!pageName) continue;
        
        console.log(`Processing ${season.id} -> ${pageName}`);
        try {
            const res = await fetch(`https://rupaulsdragrace.fandom.com/api.php?action=parse&page=${encodeURIComponent(pageName)}&prop=text&format=json`);
            const data = await res.json();
            if (!data.parse) continue;
            
            const $ = cheerio.load(data.parse.text['*']);
            const queensInSeason = seasonQueens.filter(q => q.season_id === season.id);
            
            for (const q of queensInSeason) {
                const queenName = q.queens.name;
                let imgUrl = null;
                
                // Procurar por alt tags que contenham o nome da Queen na tabela ou galeria
                $('img').each((_, el) => {
                    if (imgUrl) return; // Ja achou
                    const alt = $(el).attr('alt') || '';
                    if (alt.includes(queenName)) {
                        const img = $(el).attr('src') || $(el).attr('data-src');
                        if (img && img.includes('scale-to-width-down') && !img.includes('S1_Cast')) {
                            imgUrl = img.replace(/\/scale-to-width-down\/\d+/, '/scale-to-width-down/400');
                        }
                    }
                });
                
                // Se nao achou, procurar na wikitable por texto
                if (!imgUrl) {
                    $('table.wikitable tr').each((_, row) => {
                        if (imgUrl) return;
                        const text = $(row).text();
                        if (text.includes(queenName)) {
                            const img = $(row).find('img').first().attr('src') || $(row).find('img').first().attr('data-src');
                            if (img && img.includes('scale-to-width-down') && !img.includes('S1_Cast')) {
                                imgUrl = img.replace(/\/scale-to-width-down\/\d+/, '/scale-to-width-down/400');
                            }
                        }
                    });
                }
                
                if (imgUrl) {
                    sqlOutput += `UPDATE public.season_queens SET image_url = '${imgUrl.split('?')[0]}' WHERE queen_id = '${q.queen_id}' AND season_id = '${season.id}';\n`;
                }
            }
        } catch (e) {
            console.error(`Error on ${season.id}:`, e.message);
        }
    }
    
    fs.writeFileSync('STANDARDIZE_PROMOS.sql', sqlOutput);
    console.log('Done!');
}

scrapeSeasonPromos();
