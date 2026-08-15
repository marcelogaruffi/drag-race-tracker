import React from 'react';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { getCustomUser } from '@/app/actions/auth';

export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();
  const { data: franchises } = await supabase.from('franchises').select('*').order('sort_order');
  
  const user = await getCustomUser();
  let userWatchedSet = new Set<string>();
  let episodesPerFranchise: Record<string, string[]> = {};
  
  if (user) {
    const { data: up } = await supabase.from('user_progress').select('episode_id').eq('user_id', user.id);
    if (up) userWatchedSet = new Set(up.map(x => x.episode_id));
  }
  
  const { data: allEps } = await supabase.from('episodes').select('id, season_id, seasons(franchise_id)');
  if (allEps) {
    allEps.forEach((ep: any) => {
      const fId = ep.seasons?.franchise_id;
      if (fId) {
        if (!episodesPerFranchise[fId]) episodesPerFranchise[fId] = [];
        episodesPerFranchise[fId].push(ep.id);
      }
    });
  }

  return (
    <main className="page-wrapper container flex flex-col items-center gap-8 px-4 py-8 md:px-16 md:py-12">
      <header className="flex flex-col items-center gap-2" style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h1 className="neon-text title-main">Drag Race Tracker</h1>
        <p className="gold-text text-sm md:text-base" style={{ letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Escolha a sua franquia (Sem Spoilers)
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/watching" style={{
            padding: '0.8rem 1.5rem',
            backgroundColor: '#00d2ff',
            color: '#111',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 0 10px rgba(0, 210, 255, 0.5)',
            transition: 'transform 0.2s, boxShadow 0.2s'
          }} className="hover:scale-105 hover:shadow-lg">
            O que estou assistindo
          </Link>
          <Link href="/timeline" style={{
            padding: '0.8rem 1.5rem',
            backgroundColor: '#ff007f',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 0 10px rgba(255, 0, 127, 0.5)',
            transition: 'transform 0.2s, boxShadow 0.2s'
          }} className="hover:scale-105 hover:shadow-lg">
            Ver Linha do Tempo
          </Link>
        </div>
      </header>

      <section className="poster-grid">
        {franchises && franchises.length > 0 ? (
          franchises.map((franchise, idx) => {
            const totalEps = episodesPerFranchise[franchise.id]?.length || 0;
            const watchedEps = episodesPerFranchise[franchise.id]?.filter(id => userWatchedSet.has(id)).length || 0;
            const isCompleted = totalEps > 0 && watchedEps === totalEps;
            
            return (
              <Link href={`/franchise/${franchise.id}`} key={franchise.id} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '100%' }}>
                  <article className="poster-card" style={{ position: 'relative' }}>
                    {franchise.cover_image ? (
                      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <Image 
                          src={franchise.cover_image} 
                          alt={franchise.name} 
                          fill
                          sizes="(max-width: 768px) 25vw, 150px"
                          style={{ objectFit: 'cover' }}
                          className="poster-img"
                          priority={idx < 24}
                          loading={idx < 24 ? undefined : 'lazy'}
                          quality={50}
                        />
                      </div>
                    ) : (
                      <div className="poster-placeholder">
                        <span style={{ fontSize: '3rem' }}>👑</span>
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
                    {!isCompleted && watchedEps > 0 && (
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
                  </article>
                  <h3 className="poster-title-below">{franchise.name}</h3>
                </div>
              </Link>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--color-text-muted)' }}>
            Nenhuma franquia encontrada.
          </div>
        )}
      </section>
    </main>
  );
}
