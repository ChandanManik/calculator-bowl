/**
 * Cloudflare Pages / Workers Entry Point
 * Bulletproof Single Page Application (SPA) routing with static asset serving
 */
export default {
  async fetch(request, env) {
    try {
      let response = await env.ASSETS.fetch(request);

      if (response.status === 404) {
        const url = new URL(request.url);
        const pathname = url.pathname;
        const isStaticAsset = /\.(js|css|png|jpg|jpeg|gif|svg|ico|json|txt|xml|woff|woff2|ttf|map)$/i.test(pathname);

        if (!isStaticAsset) {
          const indexRequest = new Request(new URL('/index.html', request.url), request);
          response = await env.ASSETS.fetch(indexRequest);
        }
      }

      return response;
    } catch (e) {
      const indexRequest = new Request(new URL('/index.html', request.url), request);
      return env.ASSETS.fetch(indexRequest);
    }
  }
};
