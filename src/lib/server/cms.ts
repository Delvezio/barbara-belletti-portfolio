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

function hasAboutContent(value: AboutDTO | null): value is AboutDTO {
  return Boolean(value?.introTitle && value?.shortIntro && value?.bioTitle && value?.fullBio);
}

function hasProjectsContent(value: Array<StrapiEntity<ProjectDTO>>): boolean {
  return value.some((project) => Boolean(project.title && project.cover?.url));
}

function hasTestimonialsContent(value: TestimonialDTO[]): boolean {
  return value.some((testimonial) => Boolean(testimonial.text && testimonial.author));
}

function summarizePayload(payload: CmsPayload) {
  return {
    about: hasAboutContent(payload.about),
    projects: payload.projects.length,
    testimonials: payload.testimonials.length,
    source: payload.source
  };
}

export async function getCmsContent(): Promise<CmsPayload> {
  const [aboutRes, projectsRes, testimonialsRes] = await Promise.allSettled([
    fetchAbout(),
    fetchProjects(50),
    fetchTestimonials(50)
  ]);

  const liveAbout = aboutRes.status === 'fulfilled' && hasAboutContent(aboutRes.value.data)
    ? aboutRes.value.data
    : null;
  const liveProjects = projectsRes.status === 'fulfilled' && hasProjectsContent(projectsRes.value.data)
    ? projectsRes.value.data
    : [];
  const liveTestimonials =
    testimonialsRes.status === 'fulfilled' && hasTestimonialsContent(testimonialsRes.value.data)
      ? testimonialsRes.value.data
      : [];

  const livePayload: CmsPayload = {
    about: liveAbout,
    projects: liveProjects,
    testimonials: liveTestimonials,
    ok: Boolean(liveAbout || liveProjects.length || liveTestimonials.length),
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

    if (
      !liveAbout ||
      !liveProjects.length ||
      !liveTestimonials.length
    ) {
      console.warn('[cms] Partial live payload, merged with cached data', {
        live: summarizePayload(livePayload),
        cached: lastSuccessfulPayload ? summarizePayload(lastSuccessfulPayload) : null,
        aboutError: aboutRes.status === 'rejected' ? String(aboutRes.reason) : null,
        projectsError: projectsRes.status === 'rejected' ? String(projectsRes.reason) : null,
        testimonialsError:
          testimonialsRes.status === 'rejected' ? String(testimonialsRes.reason) : null
      });
    }

    lastSuccessfulPayload = mergedPayload;
    return mergedPayload;
  }

  if (lastSuccessfulPayload) {
    console.warn('[cms] Using fallback CMS payload', {
      cached: summarizePayload(lastSuccessfulPayload),
      aboutError: aboutRes.status === 'rejected' ? String(aboutRes.reason) : null,
      projectsError: projectsRes.status === 'rejected' ? String(projectsRes.reason) : null,
      testimonialsError: testimonialsRes.status === 'rejected' ? String(testimonialsRes.reason) : null
    });

    return {
      ...lastSuccessfulPayload,
      source: 'fallback'
    };
  }

  console.error('[cms] No live CMS payload and no fallback available', {
    aboutError: aboutRes.status === 'rejected' ? String(aboutRes.reason) : null,
    projectsError: projectsRes.status === 'rejected' ? String(projectsRes.reason) : null,
    testimonialsError: testimonialsRes.status === 'rejected' ? String(testimonialsRes.reason) : null
  });

  return livePayload;
}
