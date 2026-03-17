import type { PageServerLoad } from './$types';
import { fetchAbout, fetchProjects, fetchTestimonials } from '$lib/services/strapi';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function retry<T>(fn: () => Promise<T>, attempts = 4): Promise<T | null> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch {
      if (i === attempts - 1) return null;
      await sleep(1500 * (i + 1));
    }
  }
  return null;
}

export const load: PageServerLoad = async () => {
  const aboutRes = await retry(() => fetchAbout());
  const projectsRes = await retry(() => fetchProjects(50));
  const testimonialsRes = await retry(() => fetchTestimonials(50));

  return {
    about: aboutRes?.data ?? null,
    projects: projectsRes?.data ?? [],
    testimonials: testimonialsRes?.data ?? [],
    loadError: !aboutRes && !projectsRes && !testimonialsRes
      ? 'Errore fetch'
      : null
  };
};