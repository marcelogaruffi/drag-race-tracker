import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const seasonId = 'can-as-s1';
const franchiseId = 'can-as';

const data = {
  "queens": [
    { "name": "Aurora Matrix", "placement": "Winner" },
    { "name": "Nearah Nuff", "placement": "Runner-Up" },
    { "name": "Jada Shada Hudson", "placement": "3rd/4th" },
    { "name": "Sami Landri", "placement": "3rd/4th" },
    { "name": "Tiffany Ann Co.", "placement": "5th" },
    { "name": "Makayla Couture", "placement": "6th" },
    { "name": "Juice Boxx", "placement": "7th" },
    { "name": "Pythia", "placement": "8th" },
    { "name": "Jackie Cox", "placement": "9th" }
  ],
  "episodes": [
    { "number": 1, "title": "Miss Charisma, Uniqueness, Nerve, and Talent Pageant", "date": "July 9, 2026" },
    { "number": 2, "title": "Song of the Summer", "date": "July 16, 2026" },
    { "number": 3, "title": "The Design Auction", "date": "July 23, 2026" },
    { "number": 4, "title": "Drag Prime Minister", "date": "July 30, 2026" },
    { "number": 5, "title": "Win To Get In", "date": "August 6, 2026" },
    { "number": 6, "title": "Grand Finale", "date": "August 13, 2026" }
  ]
};

function normalizeName(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function main() {
  console.log("Inserting Season...");
  const { error: sErr } = await supabase.from('seasons').upsert({
    id: seasonId,
    franchise_id: franchiseId,
    name: "Season 1",
    release_year: 2026,
    type: 'all_stars'
  });
  if (sErr) console.error("Season Err:", sErr);

  console.log("Inserting Episodes...");
  const eps = data.episodes.map(ep => ({
    id: `${seasonId}-e${ep.number}`,
    season_id: seasonId,
    episode_number: ep.number,
    title: ep.title,
    air_date: new Date(ep.date).toISOString().split('T')[0]
  }));
  const { error: epErr } = await supabase.from('episodes').upsert(eps);
  if (epErr) console.error("Episodes Err:", epErr);

  console.log("Handling Queens...");
  for (const q of data.queens) {
    const qid = 'queen-' + normalizeName(q.name);
    
    // Upsert queen
    await supabase.from('queens').upsert({
      id: qid,
      name: q.name,
      image_url: 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/05/RuPaul_RPDR_S16.jpg'
    }, { onConflict: 'id' });

    // Link to season
    await supabase.from('season_queens').upsert({
      season_id: seasonId,
      queen_id: qid,
      placement: q.placement
    });
    
    // Add Finale result
    let status = 'ELIM';
    if (q.placement === 'Winner') status = 'WINNER';
    else if (q.placement === 'Runner-Up') status = 'RUNNER UP';
    else if (q.placement === '3rd' || q.placement === '4th' || q.placement === '3rd/4th' || q.placement === 'Top 4' || q.placement === 'Top 3') status = 'FINALIST';
    
    if (status !== 'ELIM') {
      await supabase.from('episode_results').upsert({
        id: `${seasonId}-e6-${qid}`,
        episode_id: `${seasonId}-e6`,
        queen_id: qid,
        status: status
      });
    }
  }

  console.log("Done!");
}

main();
