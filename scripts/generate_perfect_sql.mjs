import fs from 'fs';
import * as cheerio from 'cheerio';

const franchisesPages = {
    'us-all-stars-untucked': 'RuPaul%27s_Drag_Race_All_Stars:_Untucked',
    'down-under-vs-tw': 'Drag_Race_Down_Under_vs_The_World_(Season_1)',
    'espana-all-stars': 'Drag_Race_Espa%C3%B1a:_All_Stars_(Season_1)',
    'france-all-stars': 'Drag_Race_France_All_Stars_(Season_1)',
    'mexico-latina-royale': 'Drag_Race_M%C3%A9xico:_Latina_Royale_(Season_1)',
    'philippines-slaysian': 'Drag_Race_Philippines:_Slaysian_Royale_(Season_1)',
    'philippines-untucked': 'Drag_Race_Philippines_Untucked',
    'global-all-stars': 'RuPaul%27s_Drag_Race_Global_All_Stars',
    'down-under-s4': 'Drag_Race_Down_Under_(Season_4)',
    'france-s4': 'Drag_Race_France_(Season_4)'
};

const rawData = JSON.parse(fs.readFileSync('subagents_data.json', 'utf8'));

// Adicionar Untuckeds manualmente (Eles só tem episódios, não tem queens novas)
const untuckedSeasonsInfo = [
    { id: 'philippines-untucked-s1', eps: 10, title: 'Untucked - Episode' },
    { id: 'philippines-untucked-s2', eps: 12, title: 'Untucked - Episode' },
    { id: 'philippines-untucked-s3', eps: 10, title: 'Untucked - Episode' },
    { id: 'us-all-stars-untucked-s1', eps: 6, title: 'Untucked - Episode' },
    { id: 'us-all-stars-untucked-s5', eps: 8, title: 'Untucked - Episode' },
    { id: 'us-all-stars-untucked-s6', eps: 12, title: 'Untucked - Episode' },
    { id: 'us-all-stars-untucked-s7', eps: 12, title: 'Untucked - Episode' },
    { id: 'us-all-stars-untucked-s8', eps: 12, title: 'Untucked - Episode' },
    { id: 'us-all-stars-untucked-s9', eps: 12, title: 'Untucked - Episode' },
];

for (const u of untuckedSeasonsInfo) {
    const epList = [];
    for (let i = 1; i <= u.eps; i++) {
        epList.push({ number: i, title: `${u.title} ${i}`, date: '2024-01-01' });
    }
    rawData.push({ season_id: u.id, queens: [], episodes: epList });
}

function slugify(text) {
    if (!text) return '';
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function scrapeImagesAndCovers() {
    console.log('Fetching images from Fandom...');
    
    let sqlFranchisesUpdate = '-- UPDATE FRANCHISE COVERS\n';
    let sqlSeasonsUpdate = '-- UPDATE SEASON COVERS\n';
    
    // Scrape Covers for Franchises / Seasons
    for (const [franchiseId, pageSlug] of Object.entries(franchisesPages)) {
        try {
            const res = await fetch(`https://rupaulsdragrace.fandom.com/api.php?action=parse&page=${pageSlug}&prop=text&format=json`);
            const data = await res.json();
            if (data && data.parse) {
                const $ = cheerio.load(data.parse.text['*']);
                let img = $('.pi-image-thumbnail').attr('src') || $('.pi-image-thumbnail').attr('data-src');
                if (img) {
                    img = img.split('/revision/')[0] + '/revision/latest/scale-to-width-down/400';
                    sqlFranchisesUpdate += `UPDATE public.franchises SET cover_image = '${img}' WHERE id = '${franchiseId.replace('-s1', '').replace('-s4', '')}';\n`;
                    sqlSeasonsUpdate += `UPDATE public.seasons SET cover_image = '${img}' WHERE franchise_id = '${franchiseId.replace('-s1', '').replace('-s4', '')}';\n`;
                }
                
                // Procurar imagens das queens para a season atual
                const seasonObj = rawData.find(r => r.season_id.includes(franchiseId) || franchiseId.includes(r.season_id));
                if (seasonObj && seasonObj.queens) {
                    for (const q of seasonObj.queens) {
                        // Tentar achar img por alt ou dentro de link com title
                        let qImg = $(`a[title="${q.name}"] img`).attr('data-src') || $(`a[title="${q.name}"] img`).attr('src');
                        if (!qImg) {
                             // tenta buscar pela primeira palavra do nome
                             const firstName = q.name.split(' ')[0];
                             qImg = $(`a[title^="${firstName}"] img`).attr('data-src') || $(`a[title^="${firstName}"] img`).attr('src');
                        }
                        if (qImg) {
                             q.img = qImg.split('/revision/')[0] + '/revision/latest/scale-to-width-down/400';
                        }
                    }
                }
            }
        } catch (e) {
            console.log(`Failed to fetch cover for ${franchiseId}`);
        }
    }

    // Gerar SQL Final
    let sqlQueens = '-- INSERT QUEENS\nINSERT INTO public.queens (id, name, image_url) VALUES\n';
    let sqlSeasonQueens = '-- INSERT SEASON QUEENS\nINSERT INTO public.season_queens (season_id, queen_id, placement) VALUES\n';
    let sqlEpisodes = '-- INSERT EPISODES\nINSERT INTO public.episodes (id, season_id, episode_number, title, air_date) VALUES\n';

    const queensValues = [];
    const seasonQueensValues = [];
    const episodesValues = [];
    const seenQueens = new Set(); 

    for (const franchise of rawData) {
        const sId = franchise.season_id;
        
        if (franchise.queens) {
            for (const q of franchise.queens) {
                const qId = slugify(q.name);
                if (!seenQueens.has(qId)) {
                    seenQueens.add(qId);
                    let imgVal = q.img ? `'${q.img}'` : 'NULL';
                    queensValues.push(`('${qId}', '${q.name.replace(/'/g, "''")}', ${imgVal})`);
                }
                seasonQueensValues.push(`('${sId}', '${qId}', '${q.placement ? q.placement.replace(/'/g, "''") : 'TBA'}')`);
            }
        }
        
        if (franchise.episodes) {
            for (const ep of franchise.episodes) {
                const epId = `${sId}-e${ep.number}`;
                let date = ep.date || '2024-01-01'; 
                episodesValues.push(`('${epId}', '${sId}', ${ep.number}, '${ep.title.replace(/'/g, "''")}', '${date}')`);
            }
        }
    }

    let finalSql = '';
    
    // Adicionar Franchises e Seasons (reutilizado do script 2 corrigido)
    finalSql += fs.readFileSync('SUPER_SEED_PART_2.sql', 'utf8') + '\n\n';

    if (queensValues.length > 0) finalSql += sqlQueens + queensValues.join(',\n') + '\nON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url;\n\n';
    if (seasonQueensValues.length > 0) finalSql += sqlSeasonQueens + seasonQueensValues.join(',\n') + '\nON CONFLICT ON CONSTRAINT season_queens_pkey DO NOTHING;\n\n';
    if (episodesValues.length > 0) finalSql += sqlEpisodes + episodesValues.join(',\n') + '\nON CONFLICT (id) DO NOTHING;\n\n';
    
    finalSql += sqlFranchisesUpdate + '\n';
    finalSql += sqlSeasonsUpdate + '\n';

    fs.writeFileSync('FINAL_PERFECT_SEED.sql', finalSql, 'utf8');
    console.log('Gerado FINAL_PERFECT_SEED.sql com capas e episodios untucked');
}

scrapeImagesAndCovers();
