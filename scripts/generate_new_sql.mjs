const franchises = [
    { id: 'us-all-stars-untucked', name: "RuPaul's Drag Race All Stars: Untucked" },
    { id: 'down-under-vs-tw', name: 'Drag Race Down Under vs. The World' },
    { id: 'espana-all-stars', name: 'Drag Race España All Stars' },
    { id: 'france-all-stars', name: 'Drag Race France All Stars' },
    { id: 'mexico-latina-royale', name: 'Drag Race México: Latina Royale' },
    { id: 'philippines-slaysian', name: 'Drag Race Philippines: Slaysian Royale' },
    { id: 'philippines-untucked', name: 'Drag Race Philippines: Untucked!' },
    { id: 'global-all-stars', name: "RuPaul's Drag Race Global All Stars" },
];

const newSeasons = [
    { id: 'down-under-vs-tw-s1', franchise_id: 'down-under-vs-tw', name: 'Season 1', year: 2026 },
    { id: 'espana-all-stars-s1', franchise_id: 'espana-all-stars', name: 'Season 1', year: 2024 },
    { id: 'france-s4', franchise_id: 'france', name: 'Season 4', year: 2026 },
    { id: 'france-all-stars-s1', franchise_id: 'france-all-stars', name: 'Season 1', year: 2025 },
    { id: 'mexico-latina-royale-s1', franchise_id: 'mexico-latina-royale', name: 'Season 1', year: 2026 },
    { id: 'philippines-slaysian-s1', franchise_id: 'philippines-slaysian', name: 'Season 1', year: 2026 },
    { id: 'global-all-stars-s1', franchise_id: 'global-all-stars', name: 'Season 1', year: 2024 },
    { id: 'down-under-s4', franchise_id: 'down-under', name: 'Season 4', year: 2024 },
];

// Untucked seasons
const untuckedSeasons = [
    { id: 'philippines-untucked-s1', franchise_id: 'philippines-untucked', name: 'Season 1', year: 2022 },
    { id: 'philippines-untucked-s2', franchise_id: 'philippines-untucked', name: 'Season 2', year: 2023 },
    { id: 'philippines-untucked-s3', franchise_id: 'philippines-untucked', name: 'Season 3', year: 2024 },
    { id: 'us-all-stars-untucked-s1', franchise_id: 'us-all-stars-untucked', name: 'Season 1', year: 2012 },
    { id: 'us-all-stars-untucked-s5', franchise_id: 'us-all-stars-untucked', name: 'Season 5', year: 2020 },
    { id: 'us-all-stars-untucked-s6', franchise_id: 'us-all-stars-untucked', name: 'Season 6', year: 2021 },
    { id: 'us-all-stars-untucked-s7', franchise_id: 'us-all-stars-untucked', name: 'Season 7', year: 2022 },
    { id: 'us-all-stars-untucked-s8', franchise_id: 'us-all-stars-untucked', name: 'Season 8', year: 2023 },
    { id: 'us-all-stars-untucked-s9', franchise_id: 'us-all-stars-untucked', name: 'Season 9', year: 2024 },
];

let sql = '';
sql += `-- INSERT FRANCHISES\n`;
sql += `INSERT INTO public.franchises (id, name, country) VALUES\n`;
franchises.forEach((f, i) => {
    sql += `('${f.id}', '${f.name.replace(/'/g, "''")}', '${f.name.includes('España') ? 'ES' : f.name.includes('France') ? 'FR' : f.name.includes('México') ? 'MX' : f.name.includes('Philippines') ? 'PH' : f.name.includes('Down Under') ? 'AU' : 'US'}')${i === franchises.length - 1 ? '' : ','}\n`;
});
sql += `ON CONFLICT (id) DO NOTHING;\n\n`;

sql += `-- INSERT SEASONS\n`;
sql += `INSERT INTO public.seasons (id, franchise_id, name, release_year, type) VALUES\n`;
const allSeasons = [...newSeasons, ...untuckedSeasons];
allSeasons.forEach((s, i) => {
    const type = s.name.includes('All Stars') || s.franchise_id.includes('all-stars') ? 'all-stars' : 
                 s.franchise_id.includes('untucked') ? 'untucked' :
                 s.franchise_id.includes('vs-tw') ? 'vs-the-world' : 'regular';
                 
    sql += `('${s.id}', '${s.franchise_id}', '${s.name}', ${s.year}, '${type}')${i === allSeasons.length - 1 ? '' : ','}\n`;
});
sql += `ON CONFLICT (id) DO NOTHING;\n\n`;

import fs from 'fs';
fs.writeFileSync('SUPER_SEED_PART_2.sql', sql, 'utf8');
console.log('Gerado SUPER_SEED_PART_2.sql (apenas franquias e seasons iniciais)');
