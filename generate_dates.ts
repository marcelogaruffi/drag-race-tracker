import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// Mapeamento manual das franquias para os IDs do TVMaze
const showIds: Record<string, number> = {
  'us-regular': 23992,
  'us-untucked': 23993,
  'us-all-stars': 23994,
  'uk-regular': 42878,
  'uk-vs-tw': 59664,
  'can-regular': 43105,
  'can-all-stars': 64757,
  'down-under': 53282,
  'down-under-vs-tw': 77093, // Preciso confirmar
  'holland': 49479,
  'espana': 52367,
  'espana-all-stars': 74805,
  'italia': 58514,
  'france': 59047,
  'france-all-stars': 78929,
  'philippines': 59668,
  'philippines-untucked': 64327,
  'philippines-slaysian': 0, // TBA
  'belgique': 61330,
  'sverige': 61332,
  'mexico': 63784,
  'mexico-latina-royale': 0, // TBA
  'brasil': 63785,
  'germany': 63786,
  'global-all-stars': 72740,
  'secret-celebrity': 47525,
  'us-all-stars-untucked': 63319
};

async function main() {
  const { data: seasons } = await supabase.from('seasons').select('id, franchise_id, name, type');
  const { data: episodes } = await supabase.from('episodes').select('id, season_id, episode_number');
  
  if (!seasons || !episodes) return;
  
  let sql = '-- SCRIPT DE CORREÇÃO DE DATAS GERADO VIA TVMAZE\n\n';
  
  for (const franchiseId of Object.keys(showIds)) {
    const showId = showIds[franchiseId];
    if (showId === 0) continue; 
    
    console.log(`Buscando TVMaze Show ${showId} para franquia ${franchiseId}...`);
    try {
      const res = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
      if (!res.ok) continue;
      const tvMazeEpisodes = await res.json();
      
      const franchiseSeasons = seasons.filter(s => s.franchise_id === franchiseId);
      
      for (const season of franchiseSeasons) {
        const seasonNumMatch = season.name.match(/\d+/);
        if (!seasonNumMatch) continue;
        const seasonNum = parseInt(seasonNumMatch[0]);
        
        const seasonEpisodes = episodes.filter(e => e.season_id === season.id);
        
        for (const ep of seasonEpisodes) {
          const tvMazeEp = tvMazeEpisodes.find((tve: any) => tve.season === seasonNum && tve.number === ep.episode_number);
          if (tvMazeEp && tvMazeEp.airdate) {
            sql += `UPDATE public.episodes SET air_date = '${tvMazeEp.airdate}' WHERE id = '${ep.id}';\n`;
          }
        }
      }
    } catch (e) {
      console.log(`Erro ao buscar ${franchiseId}`);
    }
  }
  
  fs.writeFileSync('C:/Users/Marcelo Garuffi/.gemini/antigravity/brain/b34c1362-0f25-483f-9f5c-c20f92468cdb/FIX_DATES.sql', sql);
  console.log('Script FIX_DATES.sql gerado com sucesso na pasta de artefatos!');
}

main();
