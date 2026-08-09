import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function compare() {
  const excelData = JSON.parse(fs.readFileSync('scripts/parsed_excel.json', 'utf8'));
  
  // Get all seasons for us-regular
  const { data: seasons } = await supabase.from('seasons').select('id, name').eq('franchise_id', 'us-regular');
  
  if (!seasons) {
    console.log("No seasons found in DB for us-regular");
    return;
  }
  
  console.log("--- COMPARING EXCEL TO DATABASE (US-REGULAR) ---");
  for (const s of seasons) {
    const seasonStr = s.name.replace('Season ', '');
    const excelQueens = excelData[seasonStr];
    
    if (!excelQueens) {
      console.log(`[Missing in Excel] Season ${seasonStr} is in DB but not in Excel.`);
      continue;
    }
    
    const { data: dbQueens } = await supabase.from('season_queens').select('queen_id').eq('season_id', s.id);
    const dbQueenIds = dbQueens.map(q => q.queen_id.toLowerCase());
    
    const excelQueenNames = excelQueens.map(q => q.queen.toLowerCase());
    
    const missingInDb = excelQueenNames.filter(q => !dbQueenIds.some(dbq => dbq.includes(q.replace(/\s+/g, '-')) || q.replace(/\s+/g, '-').includes(dbq)));
    const missingInExcel = dbQueenIds.filter(dbq => !excelQueenNames.some(q => dbq.includes(q.replace(/\s+/g, '-')) || q.replace(/\s+/g, '-').includes(dbq)));
    
    if (missingInDb.length > 0 || missingInExcel.length > 0) {
      console.log(`\nSeason ${seasonStr} Differences:`);
      if (missingInDb.length > 0) console.log(`  - Queens in EXCEL but not in DB: ${missingInDb.join(', ')}`);
      if (missingInExcel.length > 0) console.log(`  - Queens in DB but not in EXCEL: ${missingInExcel.join(', ')}`);
    } else {
      console.log(`Season ${seasonStr}: All queens match perfectly!`);
    }
  }
}

compare().catch(console.error);
