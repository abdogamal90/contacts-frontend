import { CommonEngine } from '@angular/ssr/node';
import { createRequestHandler } from '@angular/ssr';
import { render } from '@netlify/angular-runtime/common-engine';

const commonEngine = new CommonEngine();

/**
 * Upstream Node API (EC2). Optional: set `NG_API_ORIGIN` in Netlify → Site configuration → Environment variables
 * (e.g. http://3.84.133.199:8000) so you can change IP without redeploying from source.
 */
const API_ORIGIN =
  (typeof process !== 'undefined' && process.env['NG_API_ORIGIN']) || 'http://3.84.133.199:8000';

export async function netlifyCommonEngineHandler(
  request: Request,
  _context: unknown,
): Promise<Response> {
  const url = new URL(request.url);
  const { pathname } = url;

  // Angular SSR edge matches `/*` before static redirects — proxy API here to avoid 500 on /api/*
  if (pathname.startsWith('/api') || pathname.startsWith('/socket.io')) {
    const base = API_ORIGIN.replace(/\/$/, '');
    const upstream = `${base}${pathname}${url.search}`;
    return fetch(new Request(upstream, request));
  }

  return render(commonEngine);
}

/** Used by `ng serve` (SSR) and the Angular CLI. */
export const reqHandler = createRequestHandler((request: Request) =>
  netlifyCommonEngineHandler(request, {}),
);
