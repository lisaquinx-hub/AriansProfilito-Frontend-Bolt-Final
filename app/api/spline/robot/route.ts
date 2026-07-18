const DEFAULT_ROBOT_SCENE_URL =
  'https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode';

const UPSTREAM_TIMEOUT_MS = 15_000;

export const runtime = 'nodejs';

function getSceneUrl() {
  const value =
    process.env.SPLINE_ROBOT_SCENE_URL ||
    process.env.NEXT_PUBLIC_SPLINE_ROBOT_SCENE ||
    DEFAULT_ROBOT_SCENE_URL;
  const url = new URL(value);

  if (url.protocol !== 'https:') {
    throw new Error('Spline scene URL must use HTTPS.');
  }

  return url;
}

export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const upstream = await fetch(getSceneUrl(), {
      headers: {
        Accept: 'application/octet-stream, application/json',
      },
      next: { revalidate: 86_400 },
      signal: controller.signal,
    });

    if (!upstream.ok || !upstream.body) {
      return Response.json(
        { message: 'Spline scene is temporarily unavailable.' },
        { status: 502 }
      );
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': upstream.headers.get('content-type') || 'application/octet-stream',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch {
    return Response.json(
      { message: 'Spline scene is temporarily unavailable.' },
      { status: 503 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
