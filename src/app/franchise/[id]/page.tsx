import React from 'react';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { getCustomUser } from '@/app/actions/auth';
import { cookies } from 'next/headers';

export const revalidate = 0;

export default async function FranchisePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const resolvedParams = await params;
  
  // Busca a franquia
  const { data: franchise } = await supabase
    .from('franchises')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  // Busca as temporadas dessa franquia
  const { data: seasons } = await supabase
    .from('seasons')
    .select('*')
    .eq('franchise_id', resolvedParams.id)
    .order('release_year');

  if (!franchise) {
    return <div className="container" style={{ padding: '4rem', color: '#fff' }}>Franquia não encontrada.</div>;
  }

  // Lógica Cross-Season Anti-Spoilers (Robô)
  const user = await getCustomUser();
  let lockedSeasonsMap = new Map<string, { required_season_name: string, required_franchise_name: string }>();
  let userWatchedSet = new Set<string>();
  let episodesPerSeason: Record<string, string[]> = {};

  if (user && seasons && seasons.length > 0) {
    const seasonIds = seasons.map(s => s.id);
    
    // Fetch progress and episodes for completed checks
    const { data: up } = await supabase.from('user_progress').select('episode_id').eq('user_id', user.id);
    if (up) userWatchedSet = new Set(up.map(x => x.episode_id));
    
    const { data: allEps } = await supabase.from('episodes').select('id, season_id').in('season_id', seasonIds);
    if (allEps) {
      allEps.forEach((ep: any) => {
        if (!episodesPerSeason[ep.season_id]) episodesPerSeason[ep.season_id] = [];
        episodesPerSeason[ep.season_id].push(ep.id);
      });
    }

    const { data: locks, error } = await supabase.rpc('get_locked_seasons', { 
      p_user_id: user.id, 
      p_season_ids: seasonIds 
    });
    
      const cookieStore = await cookies();
      const unlockedCookie = cookieStore.get("unlocked_seasons");
      let unlockedSeasons: string[] = [];
      if (unlockedCookie?.value) {
        try {
          unlockedSeasons = JSON.parse(unlockedCookie.value);
        } catch(e) {}
      }

    if (locks && !error) {
      locks.forEach((l: any) => {
        if (!unlockedSeasons.includes(l.season_id)) {
          if (!lockedSeasonsMap.has(l.season_id)) {
            lockedSeasonsMap.set(l.season_id, {
              required_season_name: l.required_season_name,
              required_franchise_name: l.required_franchise_name
            });
          }
        }
      });
    }
  }

  return (
    <main className="page-wrapper container flex flex-col items-center gap-8 px-4 py-8 md:px-16 md:py-12">
      <header className="flex flex-col items-center gap-2" style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h1 className="neon-text title-sub" style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>
          {franchise.name}
        </h1>
        <p className="gold-text text-sm md:text-base" style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>
          Selecione a Temporada
        </p>
        <Link href="/" style={{ color: 'var(--color-neon-pink)', marginTop: '1rem', textDecoration: 'underline' }}>
          ← Voltar para as Franquias
        </Link>
      </header>

      <section className="poster-grid">
        {seasons && seasons.length > 0 ? (
          seasons.map((season, idx) => {
            const lock = lockedSeasonsMap.get(season.id);
            const isLocked = !!lock;
            
            const totalEps = episodesPerSeason[season.id]?.length || 0;
            const watchedEps = episodesPerSeason[season.id]?.filter(id => userWatchedSet.has(id)).length || 0;
            const isCompleted = totalEps > 0 && watchedEps === totalEps;

            return (
              <Link href={`/season/${season.id}`} key={season.id} style={{ textDecoration: 'none', display: 'block', cursor: isLocked ? 'help' : 'pointer' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '100%', opacity: isLocked ? 0.6 : 1, transition: 'all 0.3s ease' }}>
                  <article className="poster-card" style={{ position: 'relative', borderColor: isLocked ? '#331111' : 'var(--color-neon-pink)', backgroundColor: isLocked ? '#0a0000' : 'transparent' }}>
                    {season.cover_image ? (
                      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <Image 
                          src={season.cover_image} 
                          alt={season.name} 
                          fill
                          sizes="(max-width: 768px) 25vw, 150px"
                          style={{ 
                            objectFit: 'cover',
                            filter: isLocked ? 'blur(10px) grayscale(100%)' : 'none',
                            transition: 'filter 0.5s ease'
                          }}
                          className="poster-img"
                          priority={idx < 20}
                          loading={idx < 20 ? undefined : 'lazy'}
                          quality={50}
                        />
                      </div>
                    ) : (
                      <div style={{ backgroundColor: '#2a1111', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#ff007f', opacity: 0.5, fontSize: '3rem' }}>{isLocked ? '🔒' : '🎬'}</span>
                      </div>
                    )}
                    
                    {isCompleted && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        backgroundColor: '#00ff88',
                        color: '#000',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        boxShadow: '0 0 10px rgba(0,255,136,0.5)',
                        zIndex: 10
                      }} title="Completada!">
                        ✓
                      </div>
                    )}

                    {!isCompleted && watchedEps > 0 && !isLocked && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        backgroundColor: 'rgba(0, 210, 255, 0.9)',
                        color: '#000',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        boxShadow: '0 0 8px rgba(0, 210, 255, 0.6)',
                        zIndex: 10
                      }}>
                        Iniciado
                      </div>
                    )}

                    {/* Overlay Cadeado */}
                    {isLocked && (
                      <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                        textAlign: 'center'
                      }}>
                        <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔒</span>
                        <span style={{ color: '#ff007f', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Alerta de Spoiler</span>
                      </div>
                    )}
                  </article>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 className="poster-title-below" style={{ color: isLocked ? '#666' : '#fff' }}>{season.name}</h3>
                    {isLocked ? (
                      <span style={{ fontSize: '0.65rem', color: '#ff007f', marginTop: '0.2rem', lineHeight: '1.2' }}>
                        Para não tomar spoilers, assista antes:<br/>
                        <strong>{lock.required_franchise_name} - {lock.required_season_name}</strong>
                      </span>
                    ) : (
                      <span className="gold-text" style={{ fontSize: '0.75rem', marginTop: '0.1rem' }}>{season.release_year}</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--color-text-muted)' }}>
            As temporadas desta franquia ainda não foram cadastradas no banco de dados.
          </div>
        )}
      </section>
    </main>
  );
}
