import React from 'react';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { getCustomUser } from '@/app/actions/auth';

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
  let lockedSeasonsMap = new Map<string, { required_season_name: string }>();
  if (user && seasons && seasons.length > 0) {
    const seasonIds = seasons.map(s => s.id);
    const { data: locks, error } = await supabase.rpc('get_locked_seasons', { 
      p_user_id: user.id, 
      p_season_ids: seasonIds 
    });
    
    if (locks && !error) {
      locks.forEach((l: any) => {
        // Guarda a primeira razão de bloqueio encontrada para a temporada
        if (!lockedSeasonsMap.has(l.season_id)) {
          lockedSeasonsMap.set(l.season_id, {
            required_season_name: l.required_season_name
          });
        }
      });
    }
  }

  return (
    <main className="container flex flex-col items-center gap-8" style={{ minHeight: '100vh', padding: '3rem 2rem' }}>
      <header className="flex flex-col items-center gap-2" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="neon-text" style={{ fontSize: '3rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
          {franchise.name}
        </h1>
        <p className="gold-text" style={{ fontSize: '1rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
          Selecione a Temporada
        </p>
        <Link href="/" style={{ color: 'var(--color-neon-pink)', marginTop: '1rem', textDecoration: 'underline' }}>
          ← Voltar para as Franquias
        </Link>
      </header>

      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', 
        gap: '1.5rem', 
        width: '100%' 
      }}>
        {seasons && seasons.length > 0 ? (
          seasons.map((season, idx) => {
            const lock = lockedSeasonsMap.get(season.id);
            const isLocked = !!lock;

            return (
              <Link href={isLocked ? '#' : `/season/${season.id}`} key={season.id} style={{ textDecoration: 'none', display: 'block', cursor: isLocked ? 'not-allowed' : 'pointer' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '100%', opacity: isLocked ? 0.6 : 1, transition: 'all 0.3s ease' }}>
                  <article className="poster-card" style={{ borderColor: isLocked ? '#331111' : 'var(--color-neon-pink)', backgroundColor: isLocked ? '#0a0000' : 'transparent' }}>
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
                        <strong>{lock.required_season_name}</strong>
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
