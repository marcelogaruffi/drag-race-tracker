import React from 'react';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 0;

export default async function TimelinePage() {
  const supabase = await createClient();
  const user = await getCustomUser();

  // Se não estiver logado, manda uma string vazia como uuid para não quebrar a RPC
  const userId = user ? user.id : '00000000-0000-0000-0000-000000000000';

  const { data: timeline, error } = await supabase.rpc('get_season_timeline', { 
    p_user_id: userId 
  });

  // Agrupar temporadas por ano de lançamento
  const timelineByYear = new Map<number, any[]>();
  
  if (timeline && !error) {
    timeline.forEach((season: any) => {
      const year = new Date(season.premiere_date).getFullYear();
      if (!timelineByYear.has(year)) {
        timelineByYear.set(year, []);
      }
      timelineByYear.get(year)!.push(season);
    });
  }

  // Ordenar os anos do mais antigo para o mais novo
  const sortedYears = Array.from(timelineByYear.keys()).sort((a, b) => a - b);

  return (
    <main className="container flex flex-col items-center gap-8" style={{ minHeight: '100vh', padding: '3rem 2rem' }}>
      <header className="flex flex-col items-center gap-4" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="neon-text" style={{ fontSize: '3rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Linha do Tempo Oficial
        </h1>
        <p className="gold-text" style={{ fontSize: '1.2rem', maxWidth: '600px' }}>
          O guia definitivo de exibição cronológica de todo o Multiverso Drag Race. Siga essa ordem para evitar spoilers inter-franquias.
        </p>
        <Link href="/" className="hover:text-white transition-colors" style={{ color: 'var(--color-neon-pink)', marginTop: '1rem', textDecoration: 'underline' }}>
          ← Voltar para a Home
        </Link>
      </header>

      {error ? (
        <div style={{ color: 'red', textAlign: 'center' }}>
          Erro ao carregar a linha do tempo. Certifique-se de executar o script TIMELINE_RPC.sql no Supabase.
          <br /><br />
          <code>{JSON.stringify(error)}</code>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', width: '100%', maxWidth: '800px', paddingLeft: '1rem', borderLeft: '2px solid var(--color-neon-pink)' }}>
          {sortedYears.map((year) => (
            <div key={year} style={{ position: 'relative' }}>
              {/* Bolinha do Ano */}
              <div style={{
                position: 'absolute',
                left: '-1.7rem',
                top: '-0.2rem',
                width: '1.2rem',
                height: '1.2rem',
                backgroundColor: 'var(--color-bg)',
                border: '2px solid var(--color-neon-pink)',
                borderRadius: '50%'
              }}></div>
              
              <h2 className="neon-text" style={{ fontSize: '2rem', marginBottom: '1.5rem', marginTop: '-0.5rem' }}>{year}</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {timelineByYear.get(year)!.map((season, index) => {
                  const isCompleted = season.total_episodes > 0 && season.watched_episodes === season.total_episodes;
                  const isStarted = season.watched_episodes > 0 && !isCompleted;
                  
                  return (
                    <Link href={`/season/${season.season_id}`} key={`${season.season_id}-${index}`} style={{ textDecoration: 'none' }}>
                      <article style={{
                        display: 'flex',
                        gap: '1rem',
                        backgroundColor: '#111',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: isCompleted ? '1px solid #00ff88' : isStarted ? '1px solid var(--color-gold)' : '1px solid #333',
                        transition: 'transform 0.2s, borderColor 0.2s',
                        alignItems: 'center'
                      }} className="hover:scale-105">
                        
                        {season.cover_image ? (
                          <div style={{ position: 'relative', width: '60px', height: '90px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden' }}>
                            <Image 
                              src={season.cover_image}
                              alt={season.season_name}
                              fill
                              style={{ objectFit: 'cover' }}
                              sizes="60px"
                            />
                          </div>
                        ) : (
                          <div style={{ width: '60px', height: '90px', flexShrink: 0, backgroundColor: '#222', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            🎬
                          </div>
                        )}

                        <div style={{ flex: 1 }}>
                          <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: '0 0 0.3rem 0' }}>{season.franchise_name}</h3>
                          <h4 className="gold-text" style={{ fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>{season.season_name}</h4>
                          <span style={{ fontSize: '0.8rem', color: '#888' }}>Estreia: {new Date(season.premiere_date).toLocaleDateString('pt-BR')}</span>
                        </div>

                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                          {isCompleted ? (
                            <span style={{ color: '#00ff88', fontSize: '1.5rem' }}>✓</span>
                          ) : (
                            <span style={{ color: isStarted ? 'var(--color-gold)' : '#555', fontSize: '0.85rem' }}>
                              {season.watched_episodes} / {season.total_episodes} eps
                            </span>
                          )}
                        </div>

                      </article>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
