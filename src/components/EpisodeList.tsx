"use client";

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import { markEpisodeWatched, unmarkEpisodeWatched, markSeasonWatched, unmarkSeasonWatched, rateSeason } from '@/app/actions/progress';
import ImageModal from './ImageModal';

type Episode = {
  id: string;
  season_id: string;
  title: string;
  episode_number: number;
  duration: number;
  air_date: string;
  thumb_image: string;
};

export default function EpisodeList({ episodes, seasonId, initialWatched, episodeResults, initialRating = 0 }: { episodes: Episode[], seasonId: string, initialWatched: string[], episodeResults?: any[], initialRating?: number }) {
  const [watched, setWatched] = useState<Set<string>>(new Set(initialWatched));
  const [rating, setRating] = useState<number>(initialRating);
  const [isPending, startTransition] = useTransition();
  const [selectedImage, setSelectedImage] = useState<{ url: string; name: string } | null>(null);

  const toggleEpisode = (id: string) => {
    const newWatched = new Set(watched);
    if (newWatched.has(id)) {
      newWatched.delete(id);
      startTransition(() => {
        unmarkEpisodeWatched(id, seasonId);
      });
    } else {
      newWatched.add(id);
      startTransition(() => {
        markEpisodeWatched(id, seasonId);
      });
    }
    setWatched(newWatched);
  };

  const handleMarkAllWatched = () => {
    const allIds = episodes.map(ep => ep.id);
    setWatched(new Set(allIds));
    startTransition(() => {
      markSeasonWatched(seasonId, allIds);
    });
  };

  const handleUnmarkAllWatched = () => {
    const allIds = episodes.map(ep => ep.id);
    setWatched(new Set());
    startTransition(() => {
      unmarkSeasonWatched(seasonId, allIds);
    });
  };

  const handleRate = (star: number) => {
    setRating(star);
    startTransition(() => {
      rateSeason(seasonId, star);
    });
  };

  const isAllWatched = watched.size === episodes.length && episodes.length > 0;
  const isNoneWatched = watched.size === 0;
  const progressPercent = episodes.length > 0 ? (watched.size / episodes.length) * 100 : 0;

  // Encontra o índice do primeiro episódio não assistido
  let firstUnwatchedIndex = -1;
  for (let i = 0; i < episodes.length; i++) {
    if (!watched.has(episodes[i].id)) {
      firstUnwatchedIndex = i;
      break;
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '800px' }}>
      
      {/* Barra de Progresso Visual */}
      {episodes.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Progresso da Temporada</span>
            <span style={{ color: isAllWatched ? '#00ff88' : 'var(--color-neon-pink)', fontWeight: 'bold', fontSize: '0.9rem' }}>{Math.round(progressPercent)}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: '#222', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${progressPercent}%`, 
              height: '100%', 
              backgroundColor: isAllWatched ? '#00ff88' : 'var(--color-neon-pink)',
              transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.5s'
            }}></div>
          </div>
        </div>
      )}

      {/* Botões em massa */}
      {episodes.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '-0.5rem' }}>
          <button 
            onClick={handleUnmarkAllWatched}
            disabled={isNoneWatched || isPending}
            style={{
              backgroundColor: isNoneWatched ? '#1a1a1a' : '#555',
              color: '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: isNoneWatched ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: '0.8rem',
              transition: 'all 0.2s ease',
              opacity: isNoneWatched ? 0.5 : 1
            }}
          >
            Desmarcar Toda a Temporada
          </button>

          <button 
            onClick={handleMarkAllWatched}
            disabled={isAllWatched || isPending}
            style={{
              backgroundColor: isAllWatched ? '#2a1111' : '#ff007f',
              color: '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: isAllWatched ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: '0.8rem',
              transition: 'all 0.2s ease',
              opacity: isAllWatched ? 0.5 : 1
            }}
          >
            {isAllWatched ? '✓ Temporada Completa' : 'Marcar Toda a Temporada como Vista'}
          </button>
        </div>
      )}

      {episodes && episodes.length > 0 ? (
        episodes.map((ep, index) => {
          const isWatched = watched.has(ep.id);
          // É spoiler se for posterior ao primeiro episódio não assistido
          const isSpoiler = firstUnwatchedIndex !== -1 && index > firstUnwatchedIndex;
          const resultsForEpisode = episodeResults?.filter(r => r.episode_id === ep.id) || [];

          return (
            <article key={ep.id} 
              className="flex flex-row flex-wrap md:flex-nowrap w-full rounded-lg overflow-hidden transition-all duration-300"
              style={{
                backgroundColor: isWatched ? '#0a0404' : (isSpoiler ? '#110505' : '#1a0b0b'),
                border: `1px solid ${isWatched ? '#4a1122' : (isSpoiler ? '#331111' : '#ff007f')}`,
                minHeight: '120px',
                opacity: isWatched ? 0.7 : (isSpoiler ? 0.5 : 1)
              }}>
              {/* Thumbnail */}
              <div className="relative bg-[#2a1111] w-[140px] min-w-[140px] md:w-[213px] md:min-w-[213px] flex-shrink-0 aspect-[16/9] md:aspect-auto self-start md:self-stretch">
                {ep.thumb_image ? (
                  <Image 
                    src={ep.thumb_image} 
                    alt={isSpoiler ? "Imagem Oculta por Spoiler" : (ep.title || `Episode ${ep.episode_number}`)} 
                    fill
                    sizes="(max-width: 768px) 140px, 213px"
                    style={{ 
                      objectFit: 'cover',
                      filter: isSpoiler ? 'blur(15px) grayscale(100%)' : 'none',
                      transition: 'filter 0.5s ease'
                    }}
                    loading="lazy"
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <span style={{ fontSize: '2rem', opacity: 0.5 }}>{isSpoiler ? '🔒' : '🎬'}</span>
                  </div>
                )}
                {/* Overlay verde se estiver visto */}
                {isWatched && (
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(255, 0, 127, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '3rem', textShadow: '0 0 10px #000' }}>✔️</span>
                  </div>
                )}
                {/* Overlay cadeado se for spoiler */}
                {isSpoiler && !isWatched && (
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '2rem', textShadow: '0 0 10px #000' }}>🔒</span>
                  </div>
                )}
              </div>

              {/* Detalhes do Episódio */}
              <div className="p-3 md:p-4 flex flex-col justify-center flex-grow" style={{ minWidth: '150px' }}>
                <h3 className="text-[1rem] md:text-[1.2rem] font-bold" style={{ 
                  color: isWatched ? '#aaa' : (isSpoiler ? '#666' : '#fff'), 
                  margin: '0 0 0.5rem 0', 
                  textDecoration: isWatched ? 'line-through' : 'none' 
                }}>
                  <span className="gold-text" style={{ marginRight: '0.5rem', opacity: isWatched || isSpoiler ? 0.5 : 1 }}>
                    {ep.episode_number}.
                  </span> 
                  {isSpoiler ? <span style={{ fontStyle: 'italic' }}>Conteúdo Bloqueado (Spoiler)</span> : ep.title}
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', color: '#666', fontSize: '0.8rem' }}>
                  {ep.duration && <span>⏱️ {ep.duration} min</span>}
                  {ep.air_date && <span>📅 {ep.air_date}</span>}
                </div>
              </div>

              {/* Spoiler Revelado - Resultados do Episódio */}
              {isWatched && resultsForEpisode.length > 0 && (
                <div className="w-full md:w-auto px-4 py-3 md:px-6 md:py-0 flex items-center justify-center gap-4 md:gap-6 border-t md:border-t-0 md:border-l border-dashed bg-[#050102] overflow-x-auto" style={{ borderColor: '#4a1122' }}>
                  {resultsForEpisode.map((res: any, idx: number) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', position: 'relative' }}>
                      {res.queens?.image_url ? (
                        <div 
                          className="zoom-hover"
                          onClick={() => setSelectedImage({ url: res.queens.image_url, name: res.queens.name })}
                          style={{ 
                            width: '45px', 
                            height: '45px', 
                            borderRadius: '50%', 
                            overflow: 'hidden', 
                            position: 'relative', 
                            border: `2px solid ${res.status === 'eliminated' ? '#ff4444' : res.status === 'winner' ? '#00ff88' : 'var(--color-gold)'}`
                          }}
                        >
                          <Image src={res.queens.image_url} alt={res.queens.name} fill style={{ objectFit: 'cover' }} sizes="45px" />
                        </div>
                      ) : (
                        <div style={{ width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#222', fontSize: '1.5rem' }}>
                          👑
                        </div>
                      )}
                      <span className="text-[0.75rem] text-white font-bold max-w-[60px] truncate text-center" title={res.queens?.name}>{res.queens?.name}</span>
                      <span className="text-[0.55rem] md:text-[0.65rem] tracking-tighter md:tracking-[1px] -mt-1 uppercase text-center font-bold" style={{ 
                        color: res.status === 'eliminated' ? '#ff4444' : res.status === 'winner' ? '#00ff88' : 'var(--color-gold)'
                      }}>
                        {res.status === 'eliminated' ? 'Eliminada' : 
                         res.status === 'winner' ? 'Vencedora' : 
                         res.status === 'runner_up' ? 'Finalista' : 'Miss Simpatia'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Checkbox */}
              <div 
                className="w-full md:w-auto px-4 py-3 md:px-6 md:py-0 flex items-center justify-center border-t md:border-t-0 md:border-l cursor-pointer hover:bg-[#ff007f11] transition-colors" 
                style={{ borderColor: isWatched ? '#4a1122' : 'rgba(255, 0, 127, 0.2)' }}
                onClick={() => toggleEpisode(ep.id)}
              >
                <div className="md:hidden text-[#ff007f] font-bold uppercase text-[0.8rem] tracking-[1px] flex-grow text-center">
                  {isWatched ? 'Desmarcar' : 'Marcar como visto'}
                </div>
                <input 
                  type="checkbox" 
                  checked={isWatched}
                  onChange={() => toggleEpisode(ep.id)}
                  style={{ width: '24px', height: '24px', cursor: 'pointer', accentColor: '#ff007f' }}
                  title="Marcar como visto"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </article>
          );
        })
      ) : (
        <div style={{ textAlign: 'center', color: '#ff007f' }}>
          Nenhum episódio cadastrado.
        </div>
      )}
      
      <ImageModal 
        isOpen={!!selectedImage} 
        onClose={() => setSelectedImage(null)} 
        imageUrl={selectedImage?.url || ''} 
        altText={selectedImage?.name || ''} 
      />
    </div>
  );
}
