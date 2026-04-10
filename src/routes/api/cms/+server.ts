import { json } from '@sveltejs/kit';
import { getCmsContent } from '$lib/server/cms';

export async function GET() {
  const payload = await getCmsContent();

  return json(
    payload,
    {
      headers: {
        'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300'
      }
    }
  );
}
