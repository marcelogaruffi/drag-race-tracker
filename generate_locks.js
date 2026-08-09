const fs = require('fs');

const data = JSON.parse(fs.readFileSync('db_dump.json', 'utf8'));
const seasons = data.seasons;
const queens = data.queens;

// Map for quick season lookup by ID
const seasonMap = new Map(seasons.map(s => [s.id, s]));

// Group seasons by franchise
const franchiseSeasons = {};
seasons.forEach(s => {
    if (!franchiseSeasons[s.franchise_id]) franchiseSeasons[s.franchise_id] = [];
    franchiseSeasons[s.franchise_id].push(s);
});

const locks = new Set(); // Set of "target_id|required_id"

// 1. Intra-franchise sequential locks
Object.keys(franchiseSeasons).forEach(f_id => {
    // Sort by release_year, then by name/id fallback
    const list = franchiseSeasons[f_id].sort((a, b) => {
        if (a.release_year !== b.release_year) {
            return (a.release_year || 9999) - (b.release_year || 9999);
        }
        return a.name.localeCompare(b.name);
    });

    for (let i = 1; i < list.length; i++) {
        locks.add(`${list[i].id}|${list[i-1].id}`);
    }
});

// 2. Queen-based locks
// Group queens by queen_id
const queenAppearances = {};
queens.forEach(q => {
    if (!queenAppearances[q.queen_id]) queenAppearances[q.queen_id] = [];
    // Ensure the season exists in our map
    if (seasonMap.has(q.season_id)) {
        queenAppearances[q.queen_id].push(seasonMap.get(q.season_id));
    }
});

Object.keys(queenAppearances).forEach(q_id => {
    const apps = queenAppearances[q_id].sort((a, b) => {
        if (a.release_year !== b.release_year) {
            return (a.release_year || 9999) - (b.release_year || 9999);
        }
        return 0; // if same year, we can't be strictly sure, but usually different franchises
    });

    for (let i = 1; i < apps.length; i++) {
        // The later appearance requires ALL previous appearances explicitly
        // (This ensures no transitive resolution is needed by the SQL function)
        for (let j = 0; j < i; j++) {
            if (apps[i].id !== apps[j].id) {
                locks.add(`${apps[i].id}|${apps[j].id}`);
            }
        }
    }
});

// Generate SQL
let sql = `TRUNCATE TABLE season_requirements;\n\n`;
sql += `INSERT INTO season_requirements (season_id, required_season_id) VALUES\n`;
const lockArray = Array.from(locks).map(l => {
    const [t, r] = l.split('|');
    return `('${t}', '${r}')`;
});

sql += lockArray.join(',\n') + `\nON CONFLICT DO NOTHING;\n`;

fs.writeFileSync('C:/Users/Marcelo Garuffi/.gemini/antigravity/brain/b34c1362-0f25-483f-9f5c-c20f92468cdb/PERFECT_LOCKS.sql', sql);
console.log(`Generated PERFECT_LOCKS.sql with ${lockArray.length} rules.`);
