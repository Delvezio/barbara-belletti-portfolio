import type { PageServerLoad } from './$types';
import { getCmsContent } from '$lib/server/cms';

export const load: PageServerLoad = async ({ setHeaders }) => {
  const payload = await getCmsContent();

  setHeaders({
    'cache-control': payload.ok
      ? 'public, max-age=0, s-maxage=300, stale-while-revalidate=600'
      : 'no-store'
  });

  return payload;
};
