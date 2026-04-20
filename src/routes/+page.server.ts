import type { PageServerLoad } from './$types';
import { getCmsContent } from '$lib/server/cms';

export const prerender = false;

export const load: PageServerLoad = async ({ setHeaders }) => {
  const payload = await getCmsContent();

  if (!payload.ok) {
    setHeaders({
      'cache-control': 'no-store'
    });

    throw new Error('Unable to render home page: no CMS content available from Strapi.');
  }

  setHeaders({
    'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=600'
  });

  return payload;
};
