import type { PageServerLoad } from './$types';
import { getCmsContent } from '$lib/server/cms';

export const prerender = true;

export const load: PageServerLoad = async () => {
  const payload = await getCmsContent();

  if (!payload.ok) {
    throw new Error('Unable to prerender home page: no CMS content available from Strapi.');
  }

  return payload;
};
