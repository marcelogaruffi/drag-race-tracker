const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testRpc() {
  const { data, error } = await supabase.rpc('get_locked_seasons', { 
    p_user_id: '37d6cdd2-65de-43d9-9095-fdb28741388a', 
    p_season_ids: ['us-regular-s1', 'us-regular-s2', 'us-regular-s3'] 
  });

  console.log("RPC Error:", error);
  console.log("RPC Data:", data);
}

testRpc();
