import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMissingImages() {
  const { data, error } = await supabase
    .from('queens')
    .select('id, name')
    .is('image_url', null);

  if (error) {
    console.error("Error fetching queens:", error);
    return;
  }
  
  if (data.length === 0) {
    console.log("No queens are missing images!");
  } else {
    console.log(`Found ${data.length} queens missing images:`);
    for (const queen of data) {
      console.log(`- ${queen.name} (id: ${queen.id})`);
    }
  }
}

checkMissingImages();
