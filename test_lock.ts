import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLock() {
  const userId = 'b34c1362-0f25-483f-9f5c-c20f92468cdb';
  
  const { data: locks, error } = await supabase.rpc('get_locked_seasons', {
    p_user_id: userId,
    p_season_ids: ['france-s4', 'us-regular-s4', 'us-all-stars-s4']
  });

  console.log("Locks returned by DB:", locks);
  console.log("Error:", error);
}

testLock();
