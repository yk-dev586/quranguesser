'use client';

import { useEffect } from 'react';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

/**
 * Strips stale query parameters from the URL after OAuth redirects.
 * Rendered as a client boundary so the rest of the page stays server-rendered.
 */
export default function StripSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.toString().length > 0) {
      router.replace(pathname, { scroll: false });
    }
  }, [pathname, searchParams, router]);

  return null;
}
