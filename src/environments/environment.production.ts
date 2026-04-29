/**
 * Production (e.g. Netlify): same-origin `/api` and `/socket.io` — proxied to EC2 in `server.ts`
 * (`netlifyCommonEngineHandler`) so the browser stays on HTTPS. Optional: set `NG_API_ORIGIN` on Netlify.
 * EC2 `FRONTEND_ORIGINS` must include your Netlify site URL (e.g. https://….netlify.app).
 */
export const environment = {
  production: true,
  apiBaseUrl: '',
};
