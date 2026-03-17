const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function getJSON<T>(path: string, retries = 3): Promise<T> {
  if (!STRAPI_URL) throw new Error('Missing VITE_STRAPI_URL in .env');

  const url = `${STRAPI_URL}${path}`;
  let lastError: unknown;

  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json'
        }
      });

      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`Strapi error ${res.status} ${res.statusText} — ${url} — ${body}`);
      }

      return (await res.json()) as T;
    } catch (error) {
      lastError = error;

      if (attempt < retries) {
        await sleep(attempt * 1200);
        continue;
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Failed to fetch Strapi data');
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

export function strapiMediaUrl(url?: string | null) {
  if (!url) return null;

  // URL già completo
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // normalizza eventuali slash doppi
  const base = STRAPI_URL?.replace(/\/$/, '') ?? '';
  const path = url.startsWith('/') ? url : `/${url}`;

  return `${base}${path}`;
}