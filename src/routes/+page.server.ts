import type { PageServerLoad } from './$types';
import { getCmsContent } from '$lib/server/cms';

export const load: PageServerLoad = async ({ setHeaders }) => {
  setHeaders({
    'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=600'
  });

  return getCmsContent();
};
