import React from 'react';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { getCustomUser } from '@/app/actions/auth';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function WatchingPage() {
  const supabase = await createClient();
  const user = await getCustomUser();
  
  if (!user) {
    redirect('/');
  }

  // Fetch all user progress
  const { data: up } = await supabase.from('user_progress').select('episode_id').eq('user_id', user.id);
  const userWatchedSet = new Set(up?.map(x => x.episode_id) || []);

  // Fetch all episodes and group by season
  const { data: allEps } = await supabase.from('episodes').select('id, season_id');
  const episodesPerSeason: Record<string, string[]> = {};
  
  if (allEps) {
    allEps.forEach((ep: any) => {
      if (!episodesPerSeason[ep.season_id]) episodesPerSeason[ep.season_id] = [];
      episodesPerSeason[ep.season_id].push(ep.id);
    });
  }

  // Find seasons in progress
  const inProgressSeasonIds: string[] = [];
  
  for (const [seasonId, epIds] of Object.entries(episodesPerSeason)) {
    const totalEps = epIds.length;
    const watchedEps = epIds.filter(id => userWatchedSet.has(id)).length;
    
    if (watchedEps > 0 && watchedEps < totalEps) {
      inProgressSeasonIds.push(seasonId);
    }
  }

  // Fetch details for in-progress seasons
  const { data: seasons } = await supabase
    .from('seasons')
    .select('*, franchises(name)')
    .in('id', inProgressSeasonIds.length > 0 ? inProgressSeasonIds : ['dummy-id']);

  return (
    <main className="page-wrapper container flex flex-col items-center gap-8 px-4 py-8 md:px-16 md:py-12">
      <header className="flex flex-col items-center gap-2" style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h1 className="neon-text title-sub" style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>
          O que estou assistindo
        </h1>
        <p className="gold-text text-sm md:text-base" style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>
          Temporadas em andamento
        </p>
        <Link href="/" style={{ color: 'var(--color-neon-pink)', marginTop: '1rem', textDecoration: 'underline' }}>
          ← Voltar para o Início
        </Link>
      </header>

      <section className="poster-grid">
        {seasons && seasons.length > 0 ? (
          seasons.map((season, idx) => {
            const totalEps = episodesPerSeason[season.id]?.length || 0;
            const watchedEps = episodesPerSeason[season.id]?.filter(id => userWatchedSet.has(id)).length || 0;
            const progressPercent = Math.round((watchedEps / totalEps) * 100);

            return (
              <Link href={`/season/${season.id}`} key={season.id} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '100%', transition: 'all 0.3s ease' }}>
                  <article className="poster-card" style={{ position: 'relative', borderColor: 'var(--color-neon-pink)', backgroundColor: 'transparent' }}>
                    {season.cover_image ? (
                      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <Image 
                          src={season.cover_image} 
                          alt={season.name} 
                          fill
                          sizes="(max-width: 768px) 25vw, 150px"
                          style={{ objectFit: 'cover' }}
                          className="poster-img"
                          priority={idx < 20}
                          loading={idx < 20 ? undefined : 'lazy'}
                          quality={50}
                        />
                      </div>
                    ) : (
                      <div style={{ backgroundColor: '#2a1111', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#ff007f', opacity: 0.5, fontSize: '3rem' }}>🎬</span>
                      </div>
                    )}
                    
                    {/* Progress Bar Overlay */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0, left: 0, right: 0,
                      height: '6px',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderBottomLeftRadius: '8px',
                      borderBottomRightRadius: '8px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${progressPercent}%`,
                        backgroundColor: '#00d2ff',
                        boxShadow: '0 0 10px #00d2ff'
                      }} />
                    </div>

                  </article>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.65rem', color: '#00d2ff', textTransform: 'uppercase', fontWeight: 'bold' }}>
                      {season.franchises?.name}
                    </span>
                    <h3 className="poster-title-below" style={{ color: '#fff', marginTop: '0.2rem' }}>{season.name}</h3>
                    <span className="gold-text" style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>
                      {watchedEps} / {totalEps} eps vistos
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--color-text-muted)' }}>
            Nenhuma temporada em andamento no momento. Vá explorar alguma franquia!
          </div>
        )}
      </section>
    </main>
  );
}
