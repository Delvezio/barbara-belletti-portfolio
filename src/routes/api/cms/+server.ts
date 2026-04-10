import { json } from '@sveltejs/kit';
import { fetchAbout, fetchProjects, fetchTestimonials } from '$lib/services/strapi';

export async function GET() {
  const [aboutRes, projectsRes, testimonialsRes] = await Promise.allSettled([
    fetchAbout(),
    fetchProjects(50),
    fetchTestimonials(50)
  ]);

  return json(
    {
      about: aboutRes.status === 'fulfilled' ? aboutRes.value.data : null,
      projects: projectsRes.status === 'fulfilled' ? projectsRes.value.data : [],
      testimonials: testimonialsRes.status === 'fulfilled' ? testimonialsRes.value.data : [],
      ok:
        aboutRes.status === 'fulfilled' ||
        projectsRes.status === 'fulfilled' ||
        testimonialsRes.status === 'fulfilled'
    },
    {
      headers: {
        'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300'
      }
    }
  );
}
