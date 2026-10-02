import React from 'react';

import styles from './HomeHero.module.scss';

/**
 * Hero section shown on the home page.
 *
 * @returns {React.JSX.Element} The rendered hero section.
 */
const HomeHero = (): React.JSX.Element => (
  <section className={styles.hero}>
    <h1 className={styles.title}>QuranGuessr</h1>
    <p className={styles.subtitle}>Test your knowledge of the Holy Quran</p>
  </section>
);

export default HomeHero;
