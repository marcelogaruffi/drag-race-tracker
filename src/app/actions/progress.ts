"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getCustomUser } from "@/app/actions/auth";

// Marca um único episódio como visto
export async function markEpisodeWatched(episodeId: string, seasonId: string) {
  const supabase = await createClient();
  const user = await getCustomUser();
  if (!user) return;
  
  const { error } = await supabase
    .from('user_progress')
    .upsert({ user_id: user.id, episode_id: episodeId });
    
  if (error) console.error("Error upserting:", error);
    
  revalidatePath(`/season/${seasonId}`);
}

// Desmarca um único episódio
export async function unmarkEpisodeWatched(episodeId: string, seasonId: string) {
  const supabase = await createClient();
  const user = await getCustomUser();
  if (!user) return;
  
  await supabase
    .from('user_progress')
    .delete()
    .match({ user_id: user.id, episode_id: episodeId });
    
  revalidatePath(`/season/${seasonId}`);
}

// Marca todos os episódios de uma temporada como vistos
export async function markSeasonWatched(seasonId: string, episodeIds: string[]) {
  const supabase = await createClient();
  const user = await getCustomUser();
  if (!user) return;
  
  const inserts = episodeIds.map(id => ({ user_id: user.id, episode_id: id }));
  
  await supabase
    .from('user_progress')
    .upsert(inserts, { onConflict: 'user_id, episode_id' });
    
  revalidatePath(`/season/${seasonId}`);
}

// Desmarca todos os episódios de uma temporada
export async function unmarkSeasonWatched(seasonId: string, episodeIds: string[]) {
  const supabase = await createClient();
  const user = await getCustomUser();
  if (!user) return;
  
  await supabase
    .from('user_progress')
    .delete()
    .eq('user_id', user.id)
    .in('episode_id', episodeIds);
    
  revalidatePath(`/season/${seasonId}`);
}
