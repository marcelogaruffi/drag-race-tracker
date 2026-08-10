import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function main() {
  const { error } = await supabase.from('franchises').update({name: "Canada's Drag Race All Stars (vs The World)"}).eq('id', 'can-all-stars');
  console.log(error || 'Success');
}
main();
