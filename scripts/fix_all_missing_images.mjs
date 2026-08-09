import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchFandomImage(queenName) {
  try {
    // 1. Search Fandom
    const searchUrl = `https://rupaulsdragrace.fandom.com/api.php?action=query&list=search&srsearch=${encodeURIComponent(queenName)}&utf8=&format=json`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    
    if (searchData.query.search && searchData.query.search.length > 0) {
      // Find the best match, usually the first one that looks like a queen's name
      // Avoid generic season pages
      let pageTitle = searchData.query.search[0].title;
      for (const res of searchData.query.search) {
          if (!res.title.toLowerCase().includes('season')) {
              pageTitle = res.title;
              break;
          }
      }
      
      // 2. Fetch the thumbnail for the page
      const imageQueryUrl = `https://rupaulsdragrace.fandom.com/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=pageimages&pithumbsize=500&format=json`;
      const imgRes = await fetch(imageQueryUrl);
      const imgData = await imgRes.json();
      
      const pages = imgData.query.pages;
      const pageId = Object.keys(pages)[0];
      
      if (pages[pageId].thumbnail) {
        return pages[pageId].thumbnail.source;
      }
    }
  } catch (e) {
    console.log("Error fetching Fandom for", queenName, e.message);
  }
  return null;
}

async function run() {
  console.log("Fetching queens without images...");
  
  const { data, error } = await supabase
    .from('queens')
    .select('id, name')
    .is('image_url', null);

  if (error || !data) {
    console.error("Error fetching queens from DB:", error);
    return;
  }
  
  console.log(`Found ${data.length} queens missing images.`);
  
  let sqlStatements = [];
  let updatedCount = 0;
  for (const queen of data) {
    console.log(`Searching for: ${queen.name}`);
    const imgUrl = await fetchFandomImage(queen.name);
    
    if (imgUrl) {
      console.log(` -> Found: ${imgUrl}`);
      // sanitize queen id and imgUrl just in case
      sqlStatements.push(`UPDATE queens SET image_url = '${imgUrl.replace(/'/g, "''")}' WHERE id = '${queen.id.replace(/'/g, "''")}';`);
      updatedCount++;
    } else {
      console.log(` -> No image found on Fandom for ${queen.name}`);
    }
    
    // throttle slightly
    await new Promise(res => setTimeout(res, 300));
  }
  
  const fs = await import('fs');
  fs.writeFileSync('C:\\\\DragRaceTracker\\\\drag-race-tracker\\\\UPDATE_QUEENS_IMAGES.sql', sqlStatements.join('\\n'), 'utf8');
  
  console.log(`\\nFinished! Successfully generated SQL to update ${updatedCount} out of ${data.length} queens.`);
}

run();
