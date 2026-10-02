import Image from 'next/image';

interface Props {
  src: string;
  alt: string;
  onOpen: () => void;
  priority?: boolean;
}

export default function QuizImageThumb({ src, alt, onOpen, priority = false }: Props) {
  return (
    <button
      className="hidden md:flex"
      onClick={onOpen}
      aria-label={`Zoom preview of ${alt}`}
      style={{
        flex: '0 0 300px',
        background: 'var(--color-surface-container-low)',
        borderRadius: 10,
        border: '1px solid var(--color-outline)',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 220,
        overflow: 'hidden',
        cursor: 'zoom-in',
        padding: 0,
        position: 'relative',
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={300}
        height={220}
        priority={priority}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <div
        className="image-zoom-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s',
        }}
      >
        <span
          className="material-symbols-outlined image-zoom-icon"
          style={{
            fontSize: 32,
            color: 'var(--color-on-primary)',
            opacity: 0,
            transition: 'opacity 0.2s',
            filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))',
          }}
        >
          zoom_in
        </span>
      </div>
    </button>
  );
}
