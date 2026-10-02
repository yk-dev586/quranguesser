/* eslint-disable @typescript-eslint/naming-convention */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://quranguessr.com';

/**
 * JSON-LD WebApplication structured data for the home page.
 * Helps search engines display rich results.
 */
export default function JsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'QuranGuessr',
    url: SITE_URL,
    description:
      'Interactive Quran quizzes on verse location, missing words, and sequence — for every level.',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    inLanguage: ['en', 'ar', 'id'],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
