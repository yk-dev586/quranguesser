'use client';

import dynamic from 'next/dynamic';

// Lazy-load below-fold sections client-side so they don't block LCP / initial paint.
// `ssr: false` is valid here because this is a Client Component.
const PurposeSection = dynamic(() => import('./PurposeSection'), { ssr: false });
const BentoGrid = dynamic(() => import('./BentoGrid'), { ssr: false });
const AboutSection = dynamic(() => import('./AboutSection'), { ssr: false });

export default function BelowFoldSections() {
  return (
    <>
      <PurposeSection />
      <BentoGrid />
      <AboutSection />
    </>
  );
}
