import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  
  const { data: insertData, error: insertError } = await supabase
    .from('user_progress')
    .upsert({ user_id: '11111111-1111-1111-1111-111111111111', episode_id: 'test' })
    .select();
    
  const { data, error } = await supabase.from('user_progress').select('*');
  
  return NextResponse.json({ insertData, insertError, data, error });
}
