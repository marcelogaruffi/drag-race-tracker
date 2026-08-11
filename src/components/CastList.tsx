"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import ImageModal from './ImageModal';

export default function CastList({ castData }: { castData: any[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!castData || castData.length === 0) return null;

  const currentQueen = selectedIndex !== null ? castData[selectedIndex] : null;

  return (
    <>
      <section style={{ width: '100%', marginBottom: '2rem', padding: '1rem', backgroundColor: '#111', borderRadius: '12px', border: '1px solid #331122' }}>
        <h2 className="neon-text" style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '1rem' }}>👑 Conheça o Elenco 👑</h2>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', paddingTop: '1rem', paddingBottom: '1rem', width: '100%' }}>
          {castData.map((cq: any, idx: number) => (
            <div key={cq.queen_id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flexShrink: 0, width: '80px', scrollSnapAlign: 'start' }}>
              {(cq.image_url || cq.queens?.image_url) ? (
                 <div 
                   style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-neon-pink)', position: 'relative', flexShrink: 0 }} 
                   className="zoom-hover"
                   onClick={() => setSelectedIndex(idx)}
                 >
                   <Image src={cq.image_url || cq.queens.image_url} alt={cq.queens.name} fill style={{ objectFit: 'cover', objectPosition: 'center 25%' }} sizes="64px" />
                 </div>
              ) : (
                 <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid var(--color-neon-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#222', fontSize: '1.5rem', flexShrink: 0 }} className="zoom-hover">
                   👑
                 </div>
              )}
              <span style={{ fontSize: '0.7rem', textAlign: 'center', color: '#fff', fontWeight: 'bold', lineHeight: '1.1', whiteSpace: 'normal', wordBreak: 'break-word' }}>{cq.queens?.name}</span>
            </div>
          ))}
        </div>
      </section>

      {currentQueen && (
        <ImageModal 
          isOpen={selectedIndex !== null} 
          onClose={() => setSelectedIndex(null)} 
          imageUrl={currentQueen.image_url || currentQueen.queens?.image_url || ''} 
          altText={currentQueen.queens?.name || ''} 
          onNext={() => setSelectedIndex(((selectedIndex ?? 0) + 1) % castData.length)}
          onPrev={() => setSelectedIndex(((selectedIndex ?? 0) - 1 + castData.length) % castData.length)}
          preloadNextUrl={castData[((selectedIndex ?? 0) + 1) % castData.length]?.image_url || castData[((selectedIndex ?? 0) + 1) % castData.length]?.queens?.image_url || ''}
          preloadPrevUrl={castData[((selectedIndex ?? 0) - 1 + castData.length) % castData.length]?.image_url || castData[((selectedIndex ?? 0) - 1 + castData.length) % castData.length]?.queens?.image_url || ''}
        />
      )}
    </>
  );
}
