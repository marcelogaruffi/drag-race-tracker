import fs from 'fs';

// Função para formatar texto p/ ID
function slugify(text) {
    if (!text) return '';
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

// Este json será preenchido com as repostas dos subagentes
const rawData = JSON.parse(fs.readFileSync('subagents_data.json', 'utf8'));

let sqlQueens = '-- INSERT QUEENS\nINSERT INTO public.queens (id, name, image_url) VALUES\n';
let sqlSeasonQueens = '-- INSERT SEASON QUEENS\nINSERT INTO public.season_queens (season_id, queen_id, placement) VALUES\n';
let sqlEpisodes = '-- INSERT EPISODES\nINSERT INTO public.episodes (id, season_id, episode_number, title, air_date) VALUES\n';

const queensValues = [];
const seasonQueensValues = [];
const episodesValues = [];
const seenQueens = new Set(); // Para não duplicar inserts de queens

for (const franchise of rawData) {
    const sId = franchise.season_id;
    
    // Queens
    if (franchise.queens) {
        for (const q of franchise.queens) {
            const qId = slugify(q.name);
            if (!seenQueens.has(qId)) {
                seenQueens.add(qId);
                // Como não temos a foto, deixamos NULL por enquanto.
                // O usuário pode atualizar com a URL correta depois ou deixamos o layout lidar com isso
                queensValues.push(`('${qId}', '${q.name.replace(/'/g, "''")}', NULL)`);
            }
            seasonQueensValues.push(`('${sId}', '${qId}', '${q.placement ? q.placement.replace(/'/g, "''") : 'TBA'}')`);
        }
    }
    
    // Episodes
    if (franchise.episodes) {
        for (const ep of franchise.episodes) {
            const epId = `${sId}-e${ep.number}`;
            let date = ep.date || '2024-01-01'; // Fallback se não der pra parsear
            episodesValues.push(`('${epId}', '${sId}', ${ep.number}, '${ep.title.replace(/'/g, "''")}', '${date}')`);
        }
    }
}

let finalSql = '';
if (queensValues.length > 0) finalSql += sqlQueens + queensValues.join(',\n') + '\nON CONFLICT (id) DO NOTHING;\n\n';
if (seasonQueensValues.length > 0) finalSql += sqlSeasonQueens + seasonQueensValues.join(',\n') + '\nON CONFLICT ON CONSTRAINT season_queens_pkey DO NOTHING;\n\n';
if (episodesValues.length > 0) finalSql += sqlEpisodes + episodesValues.join(',\n') + '\nON CONFLICT (id) DO NOTHING;\n\n';

fs.writeFileSync('SUPER_SEED_PART_3.sql', finalSql, 'utf8');
console.log('Gerado SUPER_SEED_PART_3.sql');
