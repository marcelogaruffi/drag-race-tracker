import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchFandomImage(queenName) {
  try {
    const searchUrl = `https://rupaulsdragrace.fandom.com/api.php?action=query&list=search&srsearch=${encodeURIComponent(queenName)}&utf8=&format=json`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    
    if (searchData.query.search.length > 0) {
      const pageTitle = searchData.query.search[0].title;
      
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
    console.log("Error fetching for", queenName, e.message);
  }
  return null;
}

async function run() {
  console.log("Fetching images for queens that are missing or new...");
  
  const excelData = JSON.parse(fs.readFileSync('scripts/parsed_excel.json', 'utf8'));
  const allQueenNames = new Set();
  Object.values(excelData).forEach(seasonQueens => {
    seasonQueens.forEach(q => allQueenNames.add(q.queen));
  });

  const { data: dbQueens } = await supabase.from('queens').select('id, name, image_url');
  const dbQueensMap = new Map();
  if (dbQueens) {
    dbQueens.forEach(q => dbQueensMap.set(q.name.toLowerCase(), q));
  }

  const updates = [];
  
  const cleanId = (name) => name.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/\\s+/g, '-');

  for (const qName of allQueenNames) {
    const dbMatch = dbQueensMap.get(qName.toLowerCase());
    if (!dbMatch || !dbMatch.image_url) {
      console.log(`Need image for: ${qName}`);
      const imgUrl = await fetchFandomImage(qName);
      if (imgUrl) {
        console.log(`Found image: ${imgUrl}`);
        const qId = cleanId(qName);
        updates.push(`UPDATE queens SET image_url = '${imgUrl.replace(/'/g, "''")}' WHERE id = '${qId}';`);
      } else {
        console.log(`No image found on Fandom for: ${qName}`);
      }
    }
  }

  if (updates.length > 0) {
    fs.appendFileSync('SUPER_SEED.sql', '\\n\\n-- ATUALIZANDO IMAGENS QUE FALTAVAM\\n' + updates.join('\\n') + '\\n');
    console.log(`Appended ${updates.length} image updates to SUPER_SEED.sql`);
  } else {
    console.log("No new images needed.");
  }
}

run();
