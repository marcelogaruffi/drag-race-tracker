import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function main() {
  // 1. Rename existing 'can-all-stars' to 'Canada vs The World'
  const { error: err1 } = await supabase
    .from('franchises')
    .update({ name: "Canada's Drag Race: Canada vs The World" })
    .eq('id', 'can-all-stars');
    
  if (err1) {
    console.error("Error updating existing franchise:", err1);
    return;
  }
  
  // 2. Insert new 'Canada's Drag Race: All Stars'
  const { error: err2 } = await supabase
    .from('franchises')
    .upsert({ 
      id: 'can-as', 
      name: "Canada's Drag Race: All Stars", 
      country: 'Canada',
      sort_order: 25 
    });
    
  if (err2) {
    console.error("Error inserting new franchise:", err2);
    return;
  }
  
  console.log("Success! Fixed Canada franchises.");
}

main();
