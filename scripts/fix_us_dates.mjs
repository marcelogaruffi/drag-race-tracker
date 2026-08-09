import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const updates = [
    { id: 'us-regular-s13', year: 2021 },
    { id: 'us-regular-s14', year: 2022 },
    { id: 'us-regular-s15', year: 2023 },
    { id: 'us-regular-s16', year: 2024 },
    { id: 'us-regular-s17', year: 2025 },
    { id: 'us-regular-s18', year: 2026 }
  ];

  for (const {id, year} of updates) {
    const { error } = await supabase
      .from('seasons')
      .update({ release_year: year })
      .eq('id', id);
      
    if (error) {
      console.error(`Error updating ${id}:`, error);
    } else {
      console.log(`Updated ${id} to ${year}`);
    }
  }
}

run();
