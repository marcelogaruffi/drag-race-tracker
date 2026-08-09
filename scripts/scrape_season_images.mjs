import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import * as cheerio from 'cheerio';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Buscando capas faltando nas franquias e seasons...");
  
  const { data: franchises } = await supabase.from('franchises').select('*').is('cover_image', null);
  const { data: seasons } = await supabase.from('seasons').select('*').is('cover_image', null);
  
  const pageMap = {
    'us-all-stars-untucked': 'RuPaul%27s_Drag_Race_All_Stars:_Untucked',
    'philippines-untucked': 'Drag_Race_Philippines_Untucked',
    'global-all-stars': 'RuPaul%27s_Drag_Race_Global_All_Stars',
    'can-vs-tw': 'Canada%27s_Drag_Race:_Canada_vs_The_World'
  };

  for (const item of [...franchises, ...seasons]) {
    const isFranchise = !!item.country;
    let franchiseId = isFranchise ? item.id : item.franchise_id;
    let pageSlug = pageMap[franchiseId];
    
    if (!pageSlug) {
      if (item.name.includes('Untucked')) continue;
      pageSlug = encodeURIComponent(item.name.replace(/-/g, ' '));
    }
    
    try {
      const res = await fetch(`https://rupaulsdragrace.fandom.com/api.php?action=parse&page=${pageSlug}&prop=text&format=json`);
      const data = await res.json();
      if (data && data.parse) {
        const $ = cheerio.load(data.parse.text['*']);
        let img = $('.pi-image-thumbnail').attr('src') || $('.pi-image-thumbnail').attr('data-src');
        if (img) {
          img = img.split('/revision/')[0] + '/revision/latest/scale-to-width-down/400';
          if (isFranchise) {
            await supabase.from('franchises').update({ cover_image: img }).eq('id', item.id);
            console.log(`✅ Capa de franquia atualizada: ${item.name}`);
          } else {
            await supabase.from('seasons').update({ cover_image: img }).eq('id', item.id);
            console.log(`✅ Capa de season atualizada: ${item.name}`);
          }
        }
      }
    } catch (e) {
      console.log(`❌ Falha na capa: ${item.name}`);
    }
  }

  // HARDCODED FALLBACKS for Untucked
  await supabase.from('franchises').update({ cover_image: 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/14/UntuckedASLogo.png/revision/latest/scale-to-width-down/400' }).eq('id', 'us-all-stars-untucked');
  await supabase.from('seasons').update({ cover_image: 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/1/14/UntuckedASLogo.png/revision/latest/scale-to-width-down/400' }).eq('franchise_id', 'us-all-stars-untucked');
  await supabase.from('franchises').update({ cover_image: 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/5e/UntuckedPHLogo.webp/revision/latest/scale-to-width-down/400' }).eq('id', 'philippines-untucked');
  await supabase.from('seasons').update({ cover_image: 'https://static.wikia.nocookie.net/logosrupaulsdragrace/images/5/5e/UntuckedPHLogo.webp/revision/latest/scale-to-width-down/400' }).eq('franchise_id', 'philippines-untucked');

  console.log("Buscando imagens faltando nas queens...");
  const { data: missingQueens } = await supabase.from('queens').select('*').is('image_url', null);
  
  if (missingQueens && missingQueens.length > 0) {
      const queryNames = missingQueens.map(q => q.name);
      console.log(`Procurando por ${queryNames.length} queens...`);
      
      const res = await fetch(`https://rupaulsdragrace.fandom.com/api.php?action=parse&page=RuPaul%27s_Drag_Race_Global_All_Stars&prop=text&format=json`);
      const data = await res.json();
      const pageText = data.parse.text['*'];
      
      for (const q of missingQueens) {
          const escapedName = q.name.split(' ')[0]; // Search just first name to be safe
          const regex = new RegExp(`alt="[^"]*${escapedName}[^"]*".*?src="(https:\\/\\/static\\.wikia\\.nocookie\\.net\\/logosrupaulsdragrace\\/images\\/[^"]+)"`, 'is');
          let match = pageText.match(regex);
          
          if (!match) {
             const anyImgRegex = new RegExp(`${escapedName}.*?src="(https:\\/\\/static\\.wikia\\.nocookie\\.net\\/logosrupaulsdragrace\\/images\\/[^"]+)"`, 'is');
             match = pageText.match(anyImgRegex);
          }
          
          if (match && match[1]) {
             let imgUrl = match[1];
             if (imgUrl.includes('/revision/latest')) {
                imgUrl = imgUrl.split('/revision/latest')[0] + '/revision/latest/scale-to-width-down/400';
             } else {
                imgUrl = imgUrl + '/revision/latest/scale-to-width-down/400';
             }
             
             await supabase.from('queens').update({ image_url: imgUrl }).eq('id', q.id);
             console.log(`✅ Imagem da queen atualizada: ${q.name}`);
          }
      }
  }

  console.log("Script finalizado.");
}

main();
