import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProgress() {
  const { data, error } = await supabase.from('user_progress').select('*');
  console.log('Progress:', data);
  if (error) console.error('Error:', error);
}

checkProgress();
