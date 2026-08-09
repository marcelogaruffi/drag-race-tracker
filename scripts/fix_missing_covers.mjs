import fs from 'fs';
import * as cheerio from 'cheerio';

const missingCovers = {
    'can-vs-tw': 'Canada%27s_Drag_Race:_Canada_vs_The_World',
    'us-all-stars-untucked': 'RuPaul%27s_Drag_Race_All_Stars:_Untucked',
    'philippines-untucked': 'Drag_Race_Philippines_Untucked',
    'global-all-stars': 'RuPaul%27s_Drag_Race_Global_All_Stars'
};

async function fixMissingCovers() {
    let sqlFranchisesUpdate = '-- UPDATE FRANCHISE COVERS\n';
    let sqlSeasonsUpdate = '-- UPDATE SEASON COVERS\n';
    
    for (const [franchiseId, pageSlug] of Object.entries(missingCovers)) {
        try {
            const res = await fetch(`https://rupaulsdragrace.fandom.com/api.php?action=parse&page=${pageSlug}&prop=text&format=json`);
            const data = await res.json();
            if (data && data.parse) {
                const $ = cheerio.load(data.parse.text['*']);
                let img = $('.pi-image-thumbnail').attr('src') || $('.pi-image-thumbnail').attr('data-src');
                if (img) {
                    img = img.split('/revision/')[0] + '/revision/latest/scale-to-width-down/400';
                    sqlFranchisesUpdate += `UPDATE public.franchises SET cover_image = '${img}' WHERE id = '${franchiseId}';\n`;
                    sqlSeasonsUpdate += `UPDATE public.seasons SET cover_image = '${img}' WHERE franchise_id = '${franchiseId}';\n`;
                } else {
                    console.log('No image found for', franchiseId);
                }
            }
        } catch (e) {
            console.log(`Failed to fetch cover for ${franchiseId}`, e);
        }
    }
    
    fs.writeFileSync('FIX_MISSING_COVERS.sql', sqlFranchisesUpdate + '\n' + sqlSeasonsUpdate, 'utf8');
    console.log('Gerado FIX_MISSING_COVERS.sql');
}

fixMissingCovers();
