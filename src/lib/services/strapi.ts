const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

export function strapiMediaUrl(path?: string | null) {
  if (!path) return null;

  // se Strapi ritorna già un URL assoluto (es. CDN), non toccarlo
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  const base = import.meta.env.VITE_STRAPI_URL;
  if (!base) return path;

  return `${base}${path}`;
}

async function getJSON<T>(path: string): Promise<T> {
  if (!STRAPI_URL) throw new Error('Missing VITE_STRAPI_URL in .env');

  const url = `${STRAPI_URL}${path}`;
  const res = await fetch(url);

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Strapi error ${res.status} ${res.statusText} — ${url} — ${body}`);
  }

  return (await res.json()) as T;
}

export type StrapiSingle<T> = { data: T; meta: unknown };
export type StrapiCollection<T> = { data: T[]; meta: unknown };

export type AboutDTO = {
  introTitle: string;
  shortIntro: string;
  ctaLabel: string | null;
  bioTitle: string;
  fullBio: string;
  // media opzionali per ora (li gestiamo dopo con populate)
  photo?: StrapiMedia | null;
};

export function fetchAbout() {
  return getJSON<StrapiSingle<AboutDTO>>('/api/about?populate[photo]=true');
}

export type StrapiMedia = {
  id: number;
  url: string;
  mime: string;
  alternativeText: string | null;
  width?: number | null;
  height?: number | null;
};

export type ProjectDTO = {
  title: string;
  service: string | null; // nel tuo JSON è "service", non "serviceType"
  description: string | null;

  // nel tuo JSON sono "cover" e "gallery"
  cover?: StrapiMedia | null;
  gallery?: StrapiMedia[];
};

export type StrapiEntity<T> = {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
  // campi reali
} & T;

export function fetchProjects(pageSize = 50) {
  const qs = new URLSearchParams();
  qs.set('pagination[pageSize]', String(pageSize));
  qs.set('sort[0]', 'order:asc');
  qs.set('populate[cover]', 'true');
  qs.set('populate[gallery]', 'true');

  return getJSON<StrapiCollection<StrapiEntity<ProjectDTO>>>(`/api/projects?${qs.toString()}`);
}

export type TestimonialDTO = {
  id: number;
  text: string;
  author: string;
  service: string;
};

export function fetchTestimonials(pageSize = 50) {
  const qs = new URLSearchParams();
  qs.set('pagination[pageSize]', String(pageSize));
  return getJSON<StrapiCollection<TestimonialDTO>>(`/api/testimonials?${qs.toString()}`);
}
