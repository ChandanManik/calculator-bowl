/**
 * Edge canonical injection.
 *
 * index.html ships a static <link rel="canonical"> pointing at the homepage;
 * the SPA rewrites it client-side (js/app.js), but crawlers reading raw HTML
 * saw the homepage canonical and flagged real pages in GSC as
 * "Alternate page with proper canonical tag" (first detected 2026-09-15).
 *
 * Every calculator route is served by the SPA not-found fallback, so those
 * requests run through this Worker. For HTML responses whose path exists in
 * /sitemap.xml the canonical is rewritten to the exact sitemap form before the
 * response leaves the edge. Paths outside the sitemap keep the homepage
 * canonical (harmless consolidation of soft-404 URLs).
 *
 * Requires assets.binding = "ASSETS" in wrangler config (verified live:
 * without it env is empty and every fallback request fails).
 *
 * Fails open: any error falls back to re-serving the asset unmodified, so a
 * Worker fault can never take pages down.
 *
 * Response rule: the asset body is read exactly ONCE (text()), and every
 * code path returns a NEW Response built from that string — returning the
 * consumed `res` itself would break the body.
 */

const ORIGIN = "https://calculatorbowl.com";
const CANONICAL_RE = /(<link rel="canonical" id="canonicalUrl" href=")[^"]*(")/;

let routeSetPromise = null;

/** sitemap.xml is the source of truth for canonical paths (loaded once per isolate). */
function loadRoutes(env, requestUrl) {
  if (!routeSetPromise) {
    routeSetPromise = (async () => {
      const set = new Set();
      try {
        const res = await env.ASSETS.fetch(new URL("/sitemap.xml", requestUrl).toString());
        if (res.ok) {
          const xml = await res.text();
          for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
            try { set.add(new URL(m[1]).pathname); } catch (e) { /* skip malformed loc */ }
          }
        }
      } catch (e) {
        // fail-open: static canonicals stay in place
      }
      set.add("/");
      return set;
    })().catch(() => new Set(["/"]));
  }
  return routeSetPromise;
}

/** Map a request path onto its sitemap form (handles trailing-slash drift). */
function sitemapForm(pathname, routes) {
  if (routes.has(pathname)) return pathname;
  if (pathname.length > 1 && pathname.endsWith("/")) {
    const bare = pathname.replace(/\/+$/, "");
    if (routes.has(bare)) return bare;
    return null;
  }
  if (routes.has(pathname + "/")) return pathname + "/";
  return null;
}

function rebuilt(body, orig, headersIn) {
  const headers = new Headers(headersIn);
  headers.delete("content-length");
  headers.delete("etag");
  return new Response(body, { status: orig.status, statusText: orig.statusText, headers: headers });
}

export default {
  async fetch(request, env) {
    if (request.method !== "GET") return env.ASSETS.fetch(request);

    let res = null;
    try {
      res = await env.ASSETS.fetch(request);
      const contentType = res.headers.get("content-type") || "";
      if (res.status !== 200 || contentType.indexOf("text/html") === -1) return res;

      const url = new URL(request.url);
      const routes = await loadRoutes(env, request.url);
      const canonicalPath = sitemapForm(url.pathname, routes);
      if (!canonicalPath) return res; // unknown path: keep static homepage canonical

      const html = await res.text(); // body read exactly once
      if (!CANONICAL_RE.test(html)) return rebuilt(html, res, res.headers);

      const next = html.replace(CANONICAL_RE, "$1" + ORIGIN + canonicalPath + "$2");
      return rebuilt(next, res, res.headers);
    } catch (e) {
      // Fail-open: never let a Worker fault take a page down.
      if (res) {
        try { return rebuilt(await res.text(), res, res.headers); } catch (e2) { /* body gone */ }
      }
      try {
        return await env.ASSETS.fetch(request);
      } catch (e3) {
        return new Response("Service temporarily unavailable", { status: 503 });
      }
    }
  },
};
