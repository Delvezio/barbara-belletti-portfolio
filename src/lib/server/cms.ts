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
};

export async function getCmsContent(): Promise<CmsPayload> {
  const [aboutRes, projectsRes, testimonialsRes] = await Promise.allSettled([
    fetchAbout(),
    fetchProjects(50),
    fetchTestimonials(50)
  ]);

  return {
    about: aboutRes.status === 'fulfilled' ? aboutRes.value.data : null,
    projects: projectsRes.status === 'fulfilled' ? projectsRes.value.data : [],
    testimonials: testimonialsRes.status === 'fulfilled' ? testimonialsRes.value.data : [],
    ok:
      aboutRes.status === 'fulfilled' ||
      projectsRes.status === 'fulfilled' ||
      testimonialsRes.status === 'fulfilled'
  };
}
