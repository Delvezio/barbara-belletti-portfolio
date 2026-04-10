import {
  fetchAbout,
  fetchProjects,
  fetchTestimonials,
  type AboutDTO,
  type ProjectDTO,
  type StrapiEntity,
  type TestimonialDTO
} from '$lib/services/strapi';

export type CmsPayload = {
  about: AboutDTO | null;
  projects: Array<StrapiEntity<ProjectDTO>>;
  testimonials: TestimonialDTO[];
  ok: boolean;
  source: 'live' | 'fallback';
};

let lastSuccessfulPayload: CmsPayload | null = null;

export async function getCmsContent(): Promise<CmsPayload> {
  const [aboutRes, projectsRes, testimonialsRes] = await Promise.allSettled([
    fetchAbout(),
    fetchProjects(50),
    fetchTestimonials(50)
  ]);

  const livePayload: CmsPayload = {
    about: aboutRes.status === 'fulfilled' ? aboutRes.value.data : null,
    projects: projectsRes.status === 'fulfilled' ? projectsRes.value.data : [],
    testimonials: testimonialsRes.status === 'fulfilled' ? testimonialsRes.value.data : [],
    ok:
      aboutRes.status === 'fulfilled' ||
      projectsRes.status === 'fulfilled' ||
      testimonialsRes.status === 'fulfilled',
    source: 'live'
  };

  if (livePayload.ok) {
    const mergedPayload: CmsPayload = {
      about: livePayload.about ?? lastSuccessfulPayload?.about ?? null,
      projects: livePayload.projects.length ? livePayload.projects : (lastSuccessfulPayload?.projects ?? []),
      testimonials: livePayload.testimonials.length
        ? livePayload.testimonials
        : (lastSuccessfulPayload?.testimonials ?? []),
      ok: true,
      source: 'live'
    };

    lastSuccessfulPayload = mergedPayload;
    return mergedPayload;
  }

  if (lastSuccessfulPayload) {
    return {
      ...lastSuccessfulPayload,
      source: 'fallback'
    };
  }

  return livePayload;
}
