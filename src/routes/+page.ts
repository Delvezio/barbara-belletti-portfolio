import type { Load } from '@sveltejs/kit';
import type { PageData } from './$types';
import { fetchAbout, fetchProjects, fetchTestimonials } from '$lib/services/strapi';

export const load: Load = async (): Promise<PageData> => {
  try {
    const [aboutRes, projectsRes, testimonialsRes] = await Promise.all([
      fetchAbout(),
      fetchProjects(50),
      fetchTestimonials(50)
    ]);

    return {
      about: aboutRes.data,
      projects: projectsRes.data,
      testimonials: testimonialsRes.data,
      loadError: null
    };
  } catch (e) {
    return {
      about: null,
      projects: [],
      testimonials: [],
      loadError: e instanceof Error ? e.message : 'Errore fetch'
    };
  }
};