import type { PageServerLoad } from './$types';
import { fetchAbout, fetchProjects, fetchTestimonials } from '$lib/services/strapi';

export const load: PageServerLoad = async ({ setHeaders }) => {
  // Cache the rendered landing page briefly at the edge to reduce cold-start
  // impact and avoid hitting Strapi on every single visit.
  setHeaders({
    'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=600'
  });

  const [aboutRes, projectsRes, testimonialsRes] = await Promise.allSettled([
    fetchAbout(),
    fetchProjects(50),
    fetchTestimonials(50)
  ]);

  return {
    about: aboutRes.status === 'fulfilled' ? aboutRes.value.data : null,
    projects: projectsRes.status === 'fulfilled' ? projectsRes.value.data : [],
    testimonials: testimonialsRes.status === 'fulfilled' ? testimonialsRes.value.data : [],
    loadError:
      aboutRes.status === 'rejected' &&
      projectsRes.status === 'rejected' &&
      testimonialsRes.status === 'rejected'
      ? 'Errore fetch'
      : null
  };
};
