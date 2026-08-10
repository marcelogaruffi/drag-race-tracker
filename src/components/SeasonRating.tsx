"use client";

import React, { useState, useTransition } from 'react';
import { rateSeason } from '@/app/actions/progress';

export default function SeasonRating({ seasonId, initialRating = 0 }: { seasonId: string, initialRating?: number }) {
  const [rating, setRating] = useState<number>(initialRating);
  const [isPending, startTransition] = useTransition();

  const handleRate = (star: number) => {
    setRating(star);
    startTransition(() => {
      rateSeason(seasonId, star);
    });
  };

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', 
      backgroundColor: '#111', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--color-gold)',
      marginTop: '0.5rem'
    }}>
      <span style={{ color: 'var(--color-gold)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1px', fontWeight: 'bold' }}>
        Avalie esta Temporada
      </span>
      <div style={{ display: 'flex', gap: '0.2rem' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            disabled={isPending}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '1.2rem', padding: 0,
              color: star <= rating ? 'var(--color-gold)' : '#333',
              transition: 'color 0.2s, transform 0.2s',
              transform: star <= rating ? 'scale(1.1)' : 'scale(1)'
            }}
            className="hover:scale-125"
            title={`Dar ${star} estrela${star > 1 ? 's' : ''}`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}
