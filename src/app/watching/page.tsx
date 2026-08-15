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

  // Fetch all episodes and group by season & franchise
  const { data: allEps } = await supabase.from('episodes').select('id, season_id, seasons(franchise_id)');
  const episodesPerSeason: Record<string, string[]> = {};
  const episodesPerFranchise: Record<string, string[]> = {};
  
  if (allEps) {
    allEps.forEach((ep: any) => {
      // Season grouping
      if (!episodesPerSeason[ep.season_id]) episodesPerSeason[ep.season_id] = [];
      episodesPerSeason[ep.season_id].push(ep.id);
      
      // Franchise grouping
      const fId = ep.seasons?.franchise_id;
      if (fId) {
        if (!episodesPerFranchise[fId]) episodesPerFranchise[fId] = [];
        episodesPerFranchise[fId].push(ep.id);
      }
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

  // Find franchises in progress
  const inProgressFranchiseIds: string[] = [];
  for (const [franchiseId, epIds] of Object.entries(episodesPerFranchise)) {
    const totalEps = epIds.length;
    const watchedEps = epIds.filter(id => userWatchedSet.has(id)).length;
    if (watchedEps > 0 && watchedEps < totalEps) {
      inProgressFranchiseIds.push(franchiseId);
    }
  }

  // Fetch details
  const { data: seasons } = await supabase
    .from('seasons')
    .select('*, franchises(name)')
    .in('id', inProgressSeasonIds.length > 0 ? inProgressSeasonIds : ['dummy-id']);
    
  const { data: franchises } = await supabase
    .from('franchises')
    .select('*')
    .in('id', inProgressFranchiseIds.length > 0 ? inProgressFranchiseIds : ['dummy-id']);

  return (
    <main className="page-wrapper container flex flex-col items-center gap-12 px-4 py-8 md:px-16 md:py-12">
      <header className="flex flex-col items-center gap-2" style={{ textAlign: 'center' }}>
        <h1 className="neon-text title-sub" style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>
          O que estou assistindo
        </h1>
        <p className="gold-text text-sm md:text-base" style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>
          Continue de onde parou
        </p>
        <Link href="/" style={{ color: 'var(--color-neon-pink)', marginTop: '1rem', textDecoration: 'underline' }}>
          ← Voltar para o Início
        </Link>
      </header>

      {/* FRANCHISES IN PROGRESS */}
      <section style={{ width: '100%' }}>
        <h2 className="gold-text" style={{ borderBottom: '1px solid #331111', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
          Franquias Iniciadas
        </h2>
        <div className="poster-grid">
          {franchises && franchises.length > 0 ? (
            franchises.map((franchise, idx) => {
              const totalEps = episodesPerFranchise[franchise.id]?.length || 0;
              const watchedEps = episodesPerFranchise[franchise.id]?.filter(id => userWatchedSet.has(id)).length || 0;
              const progressPercent = Math.round((watchedEps / totalEps) * 100);

              return (
                <Link href={`/franchise/${franchise.id}`} key={franchise.id} style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '100%', transition: 'all 0.3s ease' }}>
                    <article className="poster-card" style={{ position: 'relative', borderColor: 'rgba(0, 210, 255, 0.5)', backgroundColor: 'transparent' }}>
                      {franchise.cover_image ? (
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                          <Image 
                            src={franchise.cover_image} 
                            alt={franchise.name} 
                            fill
                            sizes="(max-width: 768px) 25vw, 150px"
                            style={{ objectFit: 'cover' }}
                            className="poster-img"
                            loading="lazy"
                            quality={50}
                          />
                        </div>
                      ) : (
                        <div className="poster-placeholder">
                          <span style={{ fontSize: '3rem' }}>👑</span>
                        </div>
                      )}
                      
                      <div style={{
                        position: 'absolute',
                        top: '12px', left: '12px',
                        backgroundColor: 'rgba(0, 210, 255, 0.9)', color: '#000',
                        padding: '3px 8px', borderRadius: '4px',
                        fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px',
                        boxShadow: '0 0 8px rgba(0, 210, 255, 0.6)', zIndex: 10
                      }}>
                        Iniciado
                      </div>

                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0, height: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', overflow: 'hidden'
                      }}>
                        <div style={{ height: '100%', width: `${progressPercent}%`, backgroundColor: '#00d2ff', boxShadow: '0 0 10px #00d2ff' }} />
                      </div>
                    </article>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <h3 className="poster-title-below" style={{ color: '#fff' }}>{franchise.name}</h3>
                      <span className="gold-text" style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>
                        {progressPercent}% completada
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div style={{ color: 'var(--color-text-muted)' }}>
              Nenhuma franquia em andamento.
            </div>
          )}
        </div>
      </section>

      {/* SEASONS IN PROGRESS */}
      <section style={{ width: '100%' }}>
        <h2 className="gold-text" style={{ borderBottom: '1px solid #331111', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
          Temporadas Iniciadas
        </h2>
        <div className="poster-grid">
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
                            loading="lazy"
                            quality={50}
                          />
                        </div>
                      ) : (
                        <div style={{ backgroundColor: '#2a1111', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ color: '#ff007f', opacity: 0.5, fontSize: '3rem' }}>🎬</span>
                        </div>
                      )}
                      
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0, height: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', overflow: 'hidden'
                      }}>
                        <div style={{ height: '100%', width: `${progressPercent}%`, backgroundColor: '#ff007f', boxShadow: '0 0 10px #ff007f' }} />
                      </div>
                    </article>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.65rem', color: '#ff007f', textTransform: 'uppercase', fontWeight: 'bold' }}>
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
            <div style={{ color: 'var(--color-text-muted)' }}>
              Nenhuma temporada em andamento.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
