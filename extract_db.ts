import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function extractData() {
  const { data: seasons } = await supabase.from('seasons').select('id, franchise_id, name, release_year, type').order('release_year');
  const { data: franchises } = await supabase.from('franchises').select('id, name');
  const { data: queens } = await supabase.from('season_queens').select('season_id, queen_id, queens(name)');

  fs.writeFileSync('db_dump.json', JSON.stringify({ franchises, seasons, queens }, null, 2));
  console.log('Data dumped to db_dump.json');
}

extractData();
