import React from 'react';

import LoginPanel from './LoginPanel';
/**
 * Airbnb-style discovery grid — property-card aesthetic, all light surfaces,
 * Rausch (#ff385c) accent.
 */
const BentoGrid = (): React.JSX.Element => (
  <>
    {/* ── Login / sign-in panel ── */}
    <section
      style={{ backgroundColor: 'var(--color-surface-container-low)', padding: '64px 24px' }}
    >
      <div className="max-w-5xl mx-auto">
        <LoginPanel />
      </div>
    </section>
  </>
);

export default BentoGrid;
