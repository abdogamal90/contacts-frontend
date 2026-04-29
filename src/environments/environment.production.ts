/**
 * Production (e.g. Netlify): use same-origin URLs so the browser stays on HTTPS.
 * Netlify proxies `/api/*` and `/socket.io/*` to EC2 — see `netlify.toml`.
 * EC2 `FRONTEND_ORIGINS` should still list your Netlify site URL (e.g. https://….netlify.app).
 */
export const environment = {
  production: true,
  apiBaseUrl: '',
};
