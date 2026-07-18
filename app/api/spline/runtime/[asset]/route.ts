const SPLINE_RUNTIME_VERSION = '1.12.98';
const DRACO_VERSION = '1.5.2';
const UPSTREAM_TIMEOUT_MS = 15_000;

const RUNTIME_ASSETS = {
  'boolean.wasm': `https://unpkg.com/@splinetool/boolean-wasm@${SPLINE_RUNTIME_VERSION}/build/boolean.wasm`,
  'process.wasm': `https://unpkg.com/@splinetool/modelling-wasm@${SPLINE_RUNTIME_VERSION}/build/process.wasm`,
  'navmesh.wasm': `https://unpkg.com/@splinetool/navmesh-wasm@${SPLINE_RUNTIME_VERSION}/build/navmesh.wasm`,
  'ui.wasm': `https://unpkg.com/@splinetool/ui-wasm@${SPLINE_RUNTIME_VERSION}/build/ui.wasm`,
  'draco_decoder.js': `https://www.gstatic.com/draco/versioned/decoders/${DRACO_VERSION}/draco_decoder.js`,
  'draco_decoder.wasm': `https://www.gstatic.com/draco/versioned/decoders/${DRACO_VERSION}/draco_decoder.wasm`,
  'draco_wasm_wrapper.js': `https://www.gstatic.com/draco/versioned/decoders/${DRACO_VERSION}/draco_wasm_wrapper.js`,
} as const;

type RuntimeAsset = keyof typeof RUNTIME_ASSETS;

export const runtime = 'nodejs';

function isRuntimeAsset(value: string): value is RuntimeAsset {
  return Object.prototype.hasOwnProperty.call(RUNTIME_ASSETS, value);
}

function getContentType(asset: RuntimeAsset) {
  return asset.endsWith('.wasm') ? 'application/wasm' : 'text/javascript; charset=utf-8';
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ asset: string }> }
) {
  const { asset } = await context.params;

  if (!isRuntimeAsset(asset)) {
    return Response.json({ message: 'Spline runtime asset was not found.' }, { status: 404 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const upstream = await fetch(RUNTIME_ASSETS[asset], {
      cache: 'no-store',
      headers: { Accept: getContentType(asset) },
      signal: controller.signal,
    });

    if (!upstream.ok || !upstream.body) {
      return Response.json(
        { message: 'Spline runtime asset is temporarily unavailable.' },
        { status: 502 }
      );
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': getContentType(asset),
        'Cache-Control': 'public, max-age=2592000, s-maxage=2592000, immutable',
      },
    });
  } catch {
    return Response.json(
      { message: 'Spline runtime asset is temporarily unavailable.' },
      { status: 503 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
