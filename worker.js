/**
 * Cloudflare Worker for CalculatorBowl
 * Serves static SPA assets with clean routing
 */
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};
