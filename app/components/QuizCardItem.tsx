'use client';

import { useState } from 'react';

import Link from 'next/link';

import ImageLightbox from './ImageLightbox';
import QuizImageThumb from './QuizImageThumb';

interface QuizMode {
  index: string;
  badge: string;
  badgeColors: { bg: string; text: string };
  title: string;
  desc: string;
  image: string;
  href: string;
}

interface Props {
  quiz: QuizMode;
  innerRef: (el: HTMLDivElement | null) => void;
  priority?: boolean;
}

export default function QuizCardItem({ quiz, innerRef, priority = false }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <div
      ref={innerRef}
      className="max-w-5xl mx-auto"
      style={{
        background: 'var(--color-surface-container-lowest)',
        border: '1px solid var(--color-outline)',
        borderRadius: 14,
        padding: '36px 40px',
        display: 'flex',
        gap: 40,
        alignItems: 'stretch',
        minHeight: 360,
        transformOrigin: 'top center',
        transition: 'transform 0.12s ease-out, opacity 0.12s ease-out',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        marginBottom: 16,
      }}
    >
      {/* ── Left: content ── */}
      <div
        style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}
      >
        <p
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: 'var(--color-outline-variant)',
            lineHeight: 1,
            letterSpacing: '-0.04em',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {quiz.index}
        </p>

        <div>
          <span
            style={{
              display: 'inline-block',
              background: quiz.badgeColors.bg,
              color: quiz.badgeColors.text,
              borderRadius: 20,
              padding: '4px 12px',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.02em',
              marginBottom: 10,
            }}
          >
            {quiz.badge}
          </span>
          <h3
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: 'var(--color-on-surface)',
              lineHeight: 1.25,
              margin: 0,
            }}
          >
            {quiz.title}
          </h3>
        </div>

        <p
          style={{
            fontSize: 16,
            color: 'var(--color-on-surface-variant)',
            lineHeight: 1.65,
            flex: 1,
            margin: 0,
          }}
        >
          {quiz.desc}
        </p>

        <Link
          href={quiz.href}
          className="inline-block self-start bg-primary text-on-primary hover:bg-on-primary-container active:scale-95 transition-all"
          style={{
            borderRadius: 8,
            padding: '12px 24px',
            fontSize: 15,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Play Now
        </Link>
      </div>

      {/* ── Right: image (click to zoom) ── */}
      <QuizImageThumb
        src={quiz.image}
        alt={quiz.title}
        onOpen={() => setLightboxOpen(true)}
        priority={priority}
      />

      {/* ── Lightbox modal ── */}
      {lightboxOpen && (
        <ImageLightbox
          src={quiz.image}
          alt={`${quiz.title} preview`}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
