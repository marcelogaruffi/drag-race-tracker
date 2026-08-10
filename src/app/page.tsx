import React from 'react';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();
  const { data: franchises } = await supabase.from('franchises').select('*').order('sort_order');

  return (
    <main className="container flex flex-col items-center gap-8 px-4 py-8 md:px-16 md:py-12" style={{ minHeight: '100vh' }}>
      <header className="flex flex-col items-center gap-2" style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h1 className="neon-text text-4xl md:text-6xl" style={{ letterSpacing: '2px', textTransform: 'uppercase' }}>Drag Race Tracker</h1>
        <p className="gold-text text-sm md:text-base" style={{ letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Escolha a sua franquia (Sem Spoilers)
        </p>
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
          Ver Linha do Tempo Oficial
        </Link>
      </header>

      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
        gap: '1.5rem', 
        width: '100%' 
      }}>
        {franchises && franchises.length > 0 ? (
          franchises.map((franchise, idx) => (
            <Link href={`/franchise/${franchise.id}`} key={franchise.id} style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '100%' }}>
                <article className="poster-card">
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
                </article>
                <h3 className="poster-title-below">{franchise.name}</h3>
              </div>
            </Link>
          ))
        ) : (
          <div style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--color-text-muted)' }}>
            Nenhuma franquia encontrada.
          </div>
        )}
      </section>
    </main>
  );
}
