import React from 'react';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import EpisodeList from '@/components/EpisodeList';
import CastList from '@/components/CastList';
import { getCustomUser, forceUnlockSeason, reLockSeason } from '@/app/actions/auth';
import { cookies } from 'next/headers';

export const revalidate = 0;

function getParentSeasonId(seasonId: string): string | null {
  if (seasonId.startsWith('us-untucked-')) {
    return seasonId.replace('us-untucked-', 'us-regular-');
  }
  if (seasonId.startsWith('us-all-stars-untucked-')) {
    return seasonId.replace('us-all-stars-untucked-', 'us-all-stars-');
  }
  if (seasonId.startsWith('philippines-untucked-')) {
    return seasonId.replace('philippines-untucked-', 'philippines-');
  }
  return null;
}

export default async function SeasonPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const resolvedParams = await params;
  
  // Busca a temporada
  const { data: season } = await supabase
    .from('seasons')
    .select('*, franchises(*)')
    .eq('id', resolvedParams.id)
    .single();

  const isUntucked = season?.franchises?.name?.toLowerCase().includes('untucked');
  const parentSeasonId = isUntucked && season ? getParentSeasonId(season.id) : null;

  // Busca os episódios dessa temporada
  const { data: episodes } = await supabase
    .from('episodes')
    .select('*')
    .eq('season_id', resolvedParams.id)
    .order('episode_number');

  // Busca o elenco (Meet the Queens) - Se for untucked, puxa da principal
  const castSeasonId = parentSeasonId || resolvedParams.id;
  const { data: castData } = await supabase
    .from('season_queens')
    .select('queen_id, placement, image_url, queens(*)')
    .eq('season_id', castSeasonId);

  // Busca os episódios do parente (se houver) para mapear os episode_results
  let parentEpisodes: any[] = [];
  if (parentSeasonId) {
    const { data: pEps } = await supabase
      .from('episodes')
      .select('id, episode_number, thumb_image')
      .eq('season_id', parentSeasonId);
    if (pEps) parentEpisodes = pEps;
    
    // Mapear thumbnail do parente para o episódio de untucked
    if (episodes) {
      episodes.forEach(ep => {
        if (!ep.thumb_image) {
          const pEp = parentEpisodes.find(p => p.episode_number === ep.episode_number);
          if (pEp && pEp.thumb_image) {
            ep.thumb_image = pEp.thumb_image;
          }
        }
      });
    }
  }

  // Busca os resultados dos episódios
  const episodesToFetchResultsFor = parentSeasonId ? parentEpisodes.map(ep => ep.id) : (episodes?.map(ep => ep.id) || []);
  const { data: rawEpisodeResults } = await supabase
    .from('episode_results')
    .select('episode_id, queen_id, status, queens(name, image_url)')
    .in('episode_id', episodesToFetchResultsFor);
    
  const episodeResults = rawEpisodeResults?.map(res => {
    const castInfo = castData?.find(c => c.queen_id === res.queen_id);
    // Se for untucked, precisamos "traduzir" o episode_id do resultado pai para o episódio filho
    let mappedEpisodeId = res.episode_id;
    if (parentSeasonId) {
      const parentEpNumber = parentEpisodes.find(p => p.id === res.episode_id)?.episode_number;
      const childEp = episodes?.find(c => c.episode_number === parentEpNumber);
      if (childEp) mappedEpisodeId = childEp.id;
    }

    return {
      ...res,
      episode_id: mappedEpisodeId,
      queens: {
        ...(res.queens as any),
        image_url: castInfo?.image_url || (res.queens as any)?.image_url
      }
    };
  }) || [];

  // Busca o progresso do usuário e a nota
  const user = await getCustomUser();
  let progress = null;
  let parentProgress = null;
  let initialRating = 0;
  
  if (user) {
    const { data } = await supabase
      .from('user_progress')
      .select('episode_id')
      .eq('user_id', user.id)
      .in('episode_id', episodes?.map(ep => ep.id) || []);
    progress = data;
    
    if (parentSeasonId) {
       const { data: pData } = await supabase
         .from('user_progress')
         .select('episode_id')
         .eq('user_id', user.id)
         .in('episode_id', episodesToFetchResultsFor);
       parentProgress = pData;
    }

    const { data: ratingData } = await supabase.rpc('get_season_rating', {
      p_user_id: user.id,
      p_season_id: season?.id
    });
    
    if (ratingData) initialRating = ratingData;
  }

  const watchedSet = new Set(progress?.map(p => p.episode_id) || []);
  const parentWatchedSet = new Set(parentProgress?.map(p => p.episode_id) || []);
  
  // No Untucked, os episódios pais assistidos controlam o unlock
  const parentWatchedNumbers = parentSeasonId ? parentEpisodes.filter(pe => parentWatchedSet.has(pe.id)).map(pe => pe.episode_number) : [];
  
  // A lógica de firstEpisodeWatched deve se basear no parent se for untucked, para revelar o cast
  const firstEpisodeId = parentSeasonId 
    ? (parentEpisodes.find(e => e.episode_number === 1)?.id)
    : (episodes && episodes.length > 0 ? episodes[0].id : null);
  const secondEpisodeId = parentSeasonId
    ? (parentEpisodes.find(e => e.episode_number === 2)?.id)
    : (episodes && episodes.length > 1 ? episodes[1].id : null);

  const hasWatchedFirstEpisode = firstEpisodeId ? (parentSeasonId ? parentWatchedSet.has(firstEpisodeId) : watchedSet.has(firstEpisodeId)) : false;
  const hasWatchedSecondEpisode = secondEpisodeId ? (parentSeasonId ? parentWatchedSet.has(secondEpisodeId) : watchedSet.has(secondEpisodeId)) : false;
  
  const fourthEpisodeId = parentSeasonId
    ? (parentEpisodes.find(e => e.episode_number === 4)?.id)
    : (episodes && episodes.length > 3 ? episodes[3].id : null);
  const seventhEpisodeId = parentSeasonId
    ? (parentEpisodes.find(e => e.episode_number === 7)?.id)
    : (episodes && episodes.length > 6 ? episodes[6].id : null);

  const hasWatchedFourthEpisode = fourthEpisodeId ? (parentSeasonId ? parentWatchedSet.has(fourthEpisodeId) : watchedSet.has(fourthEpisodeId)) : false;
  const hasWatchedSeventhEpisode = seventhEpisodeId ? (parentSeasonId ? parentWatchedSet.has(seventhEpisodeId) : watchedSet.has(seventhEpisodeId)) : false;
  
  const relevantSeasonIdForSplit = parentSeasonId || (season ? season.id : '');

  if (!season) {
    return (
      <main className="container flex flex-col items-center justify-center gap-8" style={{ minHeight: '100vh' }}>
        <h1 className="neon-text" style={{ fontSize: '2rem' }}>Temporada não encontrada</h1>
        <Link href="/" className="gold-text" style={{ textDecoration: 'underline' }}>Voltar para o início</Link>
      </main>
    );
  }

  // Busca as temporadas dessa franquia para navegação (próxima / anterior)
  const { data: allSeasons } = await supabase
    .from('seasons')
    .select('id')
    .eq('franchise_id', season.franchise_id)
    .order('release_year');

  const currentIndex = allSeasons?.findIndex(s => s.id === season.id) ?? -1;
  const prevSeasonId = currentIndex > 0 ? allSeasons![currentIndex - 1].id : null;
  const nextSeasonId = (allSeasons && currentIndex !== -1 && currentIndex < allSeasons.length - 1) 
    ? allSeasons[currentIndex + 1].id : null;

  // Verifica bloqueio das setas
  let prevLocked = false;
  let nextLocked = false;
  let currentLocked = false;
  let prevReason = '';
  let nextReason = '';
  let currentReason = '';
  let wasBypassed = false;

  if (user && allSeasons) {
    const seasonIds = allSeasons.map(s => s.id);
    const { data: locks } = await supabase.rpc('get_locked_seasons', { 
      p_user_id: user.id, 
      p_season_ids: seasonIds 
    });

    if (locks) {
      const prevLock = prevSeasonId ? locks.find((l: any) => l.season_id === prevSeasonId) : null;
      const nextLock = nextSeasonId ? locks.find((l: any) => l.season_id === nextSeasonId) : null;
      const currentLock = locks.find((l: any) => l.season_id === season.id);

      const cookieStore = await cookies();
      const unlockedCookie = cookieStore.get("unlocked_seasons");
      let unlockedSeasons: string[] = [];
      if (unlockedCookie?.value) {
        try { unlockedSeasons = JSON.parse(unlockedCookie.value); } catch(e) {}
      }

      if (prevLock && !unlockedSeasons.includes(prevSeasonId as string)) { prevLocked = true; prevReason = `${prevLock.required_franchise_name} - ${prevLock.required_season_name}`; }
      if (nextLock && !unlockedSeasons.includes(nextSeasonId as string)) { nextLocked = true; nextReason = `${nextLock.required_franchise_name} - ${nextLock.required_season_name}`; }
      if (currentLock) {
        if (!unlockedSeasons.includes(season.id)) {
          currentLocked = true;
          currentReason = `${currentLock.required_franchise_name} - ${currentLock.required_season_name}`;
        } else {
          wasBypassed = true;
        }
      }
    }
  }

  // Se a própria temporada atual estiver bloqueada, oculta o conteúdo
  if (currentLocked) {
    return (
      <main className="container flex flex-col items-center justify-center gap-8" style={{ minHeight: '100vh', textAlign: 'center' }}>
        <h1 className="neon-text" style={{ fontSize: '3rem' }}>🔒 ALERTA DE SPOILER</h1>
        <p style={{ color: '#ff007f', fontSize: '1.2rem' }}>
          Para assistir {season.franchises?.name} - {season.name}, você precisa primeiro assistir:<br/><br/>
          <strong>{currentReason}</strong>
        </p>
        <Link href={`/franchise/${season.franchise_id}`} className="gold-text" style={{ textDecoration: 'underline' }}>
          Voltar para as temporadas
        </Link>
        <form action={async () => {
          "use server";
          await forceUnlockSeason(season.id);
        }} style={{ marginTop: '2rem' }}>
          <button type="submit" style={{
            backgroundColor: 'transparent',
            color: '#666',
            border: '1px solid #666',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            textTransform: 'uppercase'
          }} className="hover:scale-105">
            Estou ciente, quero forçar o desbloqueio
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="page-wrapper container flex flex-col items-center gap-8">
      <header className="flex flex-col items-center gap-4" style={{ textAlign: 'center', marginBottom: '2rem', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', width: '100%' }}>
          {prevSeasonId ? (
            prevLocked ? (
              <span title={`Bloqueado: Assista ${prevReason} antes`} style={{ color: '#331111', fontSize: '2.5rem', cursor: 'not-allowed', padding: '0 1rem' }}>
                🔒
              </span>
            ) : (
              <Link href={`/season/${prevSeasonId}`} style={{ color: 'var(--color-neon-pink)', fontSize: '2.5rem', textDecoration: 'none', transition: 'transform 0.2s', padding: '0 1rem' }} className="hover:scale-110">
                &#8592;
              </Link>
            )
          ) : <span style={{ width: '4.5rem' }}></span>}
          
          <h1 className="neon-text title-sub" style={{ letterSpacing: '2px', textTransform: 'uppercase', margin: 0, flex: 1 }}>
            {season.franchises?.name} - {season.name}
          </h1>

          {nextSeasonId ? (
            nextLocked ? (
              <span title={`Bloqueado: Assista ${nextReason} antes`} style={{ color: '#331111', fontSize: '2.5rem', cursor: 'not-allowed', padding: '0 1rem' }}>
                🔒
              </span>
            ) : (
              <Link href={`/season/${nextSeasonId}`} style={{ color: 'var(--color-neon-pink)', fontSize: '2.5rem', textDecoration: 'none', transition: 'transform 0.2s', padding: '0 1rem' }} className="hover:scale-110">
                &#8594;
              </Link>
            )
          ) : <span style={{ width: '4.5rem' }}></span>}
        </div>

        <Link href={`/franchise/${season.franchise_id}`} className="gold-text hover:text-white transition-colors" style={{ textDecoration: 'underline' }}>
          Voltar para a página da franquia
        </Link>
        {wasBypassed && (
          <form action={async () => {
            "use server";
            await reLockSeason(season.id);
          }} style={{ marginTop: '1rem' }}>
            <button type="submit" style={{
              backgroundColor: 'transparent',
              color: '#666',
              border: '1px dashed #666',
              padding: '0.4rem 0.8rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.7rem',
              textTransform: 'uppercase'
            }} className="hover:scale-105">
              🔒 Bloquear Novamente (Restaurar Alerta)
            </button>
          </form>
        )}
      </header>

      {hasWatchedFirstEpisode && castData && castData.length > 0 && (
        <CastList castData={
          (relevantSeasonIdForSplit === 'us-regular-s12' && hasWatchedFirstEpisode && !hasWatchedSecondEpisode) 
            ? castData.filter((q: any) => ['crystal-methyd', 'gigi-goode', 'jackie-cox', 'heidi-n-closet', 'widow-vondu', 'brita', 'nicky-doll'].includes(q.queens.id))
            : (relevantSeasonIdForSplit === 'us-regular-s14' && hasWatchedFirstEpisode && !hasWatchedSecondEpisode)
            ? castData.filter((q: any) => ['willow-pill', 'bosco', 'kerri-colby', 'orion-story', 'kornbread-the-snack-jet', 'alyssa-hunter', 'june-jambalaya'].includes(q.queens.id))
            : (relevantSeasonIdForSplit === 'us-regular-s16' && hasWatchedFirstEpisode && !hasWatchedSecondEpisode)
            ? castData.filter((q: any) => ['sapphira-cristl', 'q', 'morphine-love-dion', 'dawn', 'xunami-muse', 'amanda-tori-meating', 'mirage'].includes(q.queens.id))
            : (relevantSeasonIdForSplit === 'us-all-stars-s10')
            ? castData.filter((q: any) => {
                const group1 = ['phoenix', 'olivia-lux', 'deja-skye', 'irene-the-alien', 'aja', 'bosco'];
                const group2 = ['jorgeous', 'lydia-b-kollins', 'kerri-colby', 'mistress-isabelle-brooks', 'nicole-paige-brooks', 'tina-burner'];
                if (hasWatchedSeventhEpisode) return true;
                if (hasWatchedFourthEpisode) return group1.includes(q.queens.id) || group2.includes(q.queens.id);
                return group1.includes(q.queens.id);
              })
            : (relevantSeasonIdForSplit === 'us-all-stars-s11')
            ? castData.filter((q: any) => {
                const group1 = ['mystique-summers', 'morphine-love-dion', 'morgan-mcmichaels', 'lucky-starzzz', 'akeria-c-davenport', 'dawn'];
                const group2 = ['vicacious', 'salina-estitties', 'aura-mayari', 'april-carrin', 'silky-nutmeg-ganache', 'crystal-methyd'];
                if (hasWatchedSeventhEpisode) return true;
                if (hasWatchedFourthEpisode) return group1.includes(q.queens.id) || group2.includes(q.queens.id);
                return group1.includes(q.queens.id);
              })
            : castData
        } />
      )}

      <EpisodeList 
        episodes={episodes || []} 
        seasonId={season.id}
        initialWatched={Array.from(watchedSet)} 
        episodeResults={episodeResults || []}
        initialRating={initialRating}
        parentWatchedNumbers={parentSeasonId ? parentWatchedNumbers : undefined}
        parentSeasonId={parentSeasonId || undefined}
        parentTotalEpisodes={parentSeasonId ? parentEpisodes.length : undefined}
      />
    </main>
  );
}
