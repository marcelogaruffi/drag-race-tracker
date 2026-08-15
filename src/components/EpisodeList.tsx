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

export default function EpisodeList({ 
  episodes, seasonId, initialWatched, episodeResults, initialRating = 0,
  parentWatchedNumbers, parentSeasonId, parentTotalEpisodes
}: { 
  episodes: Episode[], seasonId: string, initialWatched: string[], episodeResults?: any[], initialRating?: number,
  parentWatchedNumbers?: number[], parentSeasonId?: string, parentTotalEpisodes?: number
}) {
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
      
      {/* Container do Topo (Progresso e Avaliação) */}
      <div className="rating-section">
        
        {/* Barra de Progresso Visual */}
        {episodes.length > 0 && (
          <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
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

        {/* Sistema de Avaliação (Só visível se completo) */}
        {isAllWatched && (
          <div style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', 
            backgroundColor: '#1a1a1a', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-gold)'
          }}>
            <h3 style={{ color: 'var(--color-gold)', margin: 0, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>Avalie a Temporada</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  disabled={isPending}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '1.8rem', padding: 0,
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
        )}
      </div>

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
          const isUntucked = !!parentSeasonId;
          
          let isUnlocked = true;
          let lockMessage = '';
          
          if (isUntucked) {
            if (seasonId === 'us-untucked-s1') {
               isUnlocked = (parentWatchedNumbers && parentTotalEpisodes) ? parentWatchedNumbers.length === parentTotalEpisodes : false;
               lockMessage = 'Termine a Season 1 principal para liberar';
            } else {
               isUnlocked = parentWatchedNumbers?.includes(ep.episode_number) || false;
               lockMessage = `Assista o episódio ${ep.episode_number} principal para liberar`;
            }
          }

          // É spoiler se for posterior ao primeiro episódio não assistido
          let isSpoiler = firstUnwatchedIndex !== -1 && index > firstUnwatchedIndex;
          
          // No Untucked, se estiver destrancado, os resultados aparecem imediatamente
          if (isUntucked && isUnlocked) {
            isSpoiler = false;
          }

          const resultsForEpisode = episodeResults?.filter(res => res.episode_id === ep.id) || [];


          return (
            <article key={ep.id} className="ep-card" style={{
              backgroundColor: isWatched ? '#0a0404' : (isSpoiler ? '#110505' : '#1a0b0b'),
              border: `1px solid ${isWatched ? '#4a1122' : (isSpoiler ? '#331111' : '#ff007f')}`,
              borderRadius: '8px',
              overflow: 'hidden',
              minHeight: '120px',
              transition: 'all 0.3s ease',
              opacity: (isUntucked && !isUnlocked) ? 0.4 : (isWatched ? 0.7 : (isSpoiler ? 0.5 : 1)),
              position: 'relative'
            }}>
              {isUntucked && !isUnlocked && (
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}>
                  <span style={{ fontSize: '2rem' }}>🔒</span>
                  <span style={{ color: '#ff007f', fontWeight: 'bold', fontSize: '0.8rem', background: '#000', padding: '2px 6px', borderRadius: '4px' }}>
                    {lockMessage}
                  </span>
                </div>
              )}
              {/* Thumbnail (Oculta se houver spoiler) */}
              <div className="ep-thumb" style={{ position: 'relative', backgroundColor: '#2a1111' }}>
                {ep.thumb_image ? (
                  <Image 
                    src={ep.thumb_image} 
                    alt={isSpoiler ? "Imagem Oculta por Spoiler" : (ep.title || `Episode ${ep.episode_number}`)} 
                    fill
                    sizes="213px"
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
              <div className="ep-details" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center',
                flexGrow: 1
              }}>
                <h3 className="ep-title" style={{ 
                  color: isWatched ? '#aaa' : (isSpoiler ? '#666' : '#fff'), 
                  margin: '0 0 0.5rem 0', 
                  textDecoration: isWatched ? 'line-through' : 'none' 
                }}>
                  <span className="gold-text" style={{ marginRight: '0.5rem', opacity: isWatched || isSpoiler ? 0.5 : 1 }}>
                    {ep.episode_number}.
                  </span> 
                  {isSpoiler ? <span style={{ fontStyle: 'italic' }}>Conteúdo Bloqueado (Spoiler)</span> : ep.title}
                </h3>
                <div style={{ display: 'flex', gap: '1rem', color: '#666', fontSize: '0.9rem' }}>
                  {ep.duration && <span>⏱️ {ep.duration} min</span>}
                  {ep.air_date && <span>📅 {ep.air_date}</span>}
                </div>
              </div>

              {/* Spoiler Revelado - Resultados do Episódio */}
              {((isWatched || (isUntucked && isUnlocked)) && resultsForEpisode.length > 0) && (
                <div className="ep-results-wrapper">
                  {resultsForEpisode.map((res: any, idx: number) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', position: 'relative' }}>
                      {res.queens?.image_url ? (
                        <div 
                          className="zoom-hover cast-avatar-small"
                          onClick={() => setSelectedImage({ url: res.queens.image_url, name: res.queens.name })}
                          style={{ 
                            borderRadius: '50%', 
                            overflow: 'hidden', 
                            position: 'relative', 
                            border: `2px solid ${res.status === 'eliminated' ? '#ff4444' : res.status === 'winner' ? '#00ff88' : res.status === 'lalaparuza_winner' ? '#ff8c00' : res.status === 'fame_games_winner' ? '#ff00ff' : res.status === 'miss_congeniality' ? '#00d2ff' : res.status === 'disqualified' ? '#7A7525' : res.status === 'medevac' ? '#ffaa00' : 'var(--color-gold)'}`
                          }}
                        >
                          <Image src={res.queens.image_url} alt={res.queens.name} fill style={{ objectFit: 'cover' }} sizes="45px" />
                        </div>
                      ) : (
                        <div className="cast-avatar-small" style={{ borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#222', fontSize: '1.5rem' }}>
                          👑
                        </div>
                      )}
                      <span style={{ fontSize: '0.75rem', color: '#fff', fontWeight: 'bold' }}>{res.queens?.name}</span>
                      <span style={{ 
                        color: res.status === 'eliminated' ? '#ff4444' : res.status === 'winner' ? '#00ff88' : res.status === 'lalaparuza_winner' ? '#ff8c00' : res.status === 'fame_games_winner' ? '#ff00ff' : res.status === 'miss_congeniality' ? '#00d2ff' : res.status === 'disqualified' ? '#7A7525' : res.status === 'medevac' ? '#ffaa00' : 'var(--color-gold)', 
                        fontSize: '0.65rem', 
                        fontWeight: 'bold', 
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginTop: '-4px',
                        textAlign: 'center'
                      }}>
                        {res.status === 'eliminated' ? 'Eliminada' : 
                         res.status === 'winner' ? 'Vencedora' : 
                         res.status === 'lalaparuza_winner' ? 'Vencedora do Lalaparuza' :
                         res.status === 'fame_games_winner' ? 'Vencedora do Fame Games' :
                         res.status === 'disqualified' ? 'Desqualificada' :
                         res.status === 'medevac' ? 'Retirada (Saúde)' :
                         res.status === 'quit' ? 'Desistente' :
                         res.status === 'runner_up' ? 'Finalista' : 'Miss Simpatia'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Checkbox */}
              <div className="ep-checkbox" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 1.5rem',
                borderLeft: `1px solid ${isWatched ? '#4a1122' : 'rgba(255, 0, 127, 0.2)'}`
              }}>
                <input 
                  type="checkbox" 
                  checked={isWatched}
                  onChange={() => toggleEpisode(ep.id)}
                  disabled={isUntucked && !isUnlocked}
                  style={{ width: '24px', height: '24px', cursor: (isUntucked && !isUnlocked) ? 'not-allowed' : 'pointer', accentColor: '#ff007f' }}
                  title={isUntucked && !isUnlocked ? "Bloqueado" : "Marcar como visto"}
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
