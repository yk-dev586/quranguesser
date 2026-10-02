/* eslint-disable @typescript-eslint/naming-convention */
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'QuranGuessr — Test Your Knowledge of the Holy Quran',
    short_name: 'QuranGuessr',
    description:
      'Interactive Quran quizzes on verse location, missing words, and sequence — for every level.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#6750a4',
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
