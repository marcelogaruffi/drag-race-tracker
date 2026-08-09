"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText: string;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function ImageModal({ isOpen, onClose, imageUrl, altText, onNext, onPrev }: ImageModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'zoom-out'
      }}
      onClick={onClose}
    >
      {onPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          style={{ position: 'absolute', left: '1rem', zIndex: 10000, background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid var(--color-neon-pink)', borderRadius: '50%', width: '50px', height: '50px', fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          ‹
        </button>
      )}

      <div 
        style={{
          position: 'relative',
          width: '90vw',
          height: '90vh',
          maxWidth: '600px',
          maxHeight: '800px',
          backgroundColor: '#000',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '2px solid var(--color-neon-pink)',
          boxShadow: '0 0 30px rgba(255, 0, 127, 0.3)',
          cursor: 'default',
          display: 'flex'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image 
          src={imageUrl} 
          alt={altText} 
          fill 
          style={{ objectFit: 'contain' }} 
          sizes="(max-width: 768px) 90vw, 600px"
          priority
        />
        
        {/* Invisible hit areas for left/right clicking the image */}
        {onPrev && <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '50%', cursor: 'w-resize' }} onClick={onPrev} />}
        {onNext && <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '50%', cursor: 'e-resize' }} onClick={onNext} />}
        
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(0, 0, 0, 0.6)',
            color: '#fff',
            border: '1px solid var(--color-neon-pink)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontSize: '1.2rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10001
          }}
        >
          ✕
        </button>
        
        <div style={{ position: 'absolute', bottom: '1rem', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none' }}>
           <span style={{ background: 'rgba(0,0,0,0.7)', padding: '0.5rem 1rem', borderRadius: '20px', color: '#fff', fontWeight: 'bold' }}>
             {altText}
           </span>
        </div>
      </div>

      {onNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          style={{ position: 'absolute', right: '1rem', zIndex: 10000, background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid var(--color-neon-pink)', borderRadius: '50%', width: '50px', height: '50px', fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          ›
        </button>
      )}
    </div>
  );
}
