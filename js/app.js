/**
 * ============================================================================
 * CalculatorBowl Application Core Engine & Hierarchical Router
 * Architecture: /calculators/[category]/[subcategory]/[calculator-name]/
 * ============================================================================
 */

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

function initApp() {
  if (typeof initI18n === "function") {
    initI18n();
  }
  initTheme();
  initRouter();
  initSearch();
  initMobileMenu();
}

/* ==========================================================================
   Theme Management (Light / Dark Mode)
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem("calculatorbowl-theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  const toggleBtn = document.getElementById("themeToggleBtn");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("calculatorbowl-theme", next);
      updateThemeIcon(next);
    });
  }
}

function updateThemeIcon(theme) {
  const toggleBtn = document.getElementById("themeToggleBtn");
  if (!toggleBtn) return;
  toggleBtn.innerHTML = theme === "dark" ? "☀️" : "🌙";
  toggleBtn.title = theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
}

/* ==========================================================================
   Topical SPA Router (HTML5 History API with Hierarchical Routing & 301s)
   ========================================================================== */
function initRouter() {
  window.addEventListener("popstate", handleRoute);

  // Global anchor click interceptor for seamless client-side SPA transitions
  document.addEventListener("click", (e) => {
    const anchor = e.target.closest("a");
    if (!anchor) return;

    const href = anchor.getAttribute("href");
    if (!href) return;

    // Ignore external links, mailto, tel, hash anchors, javascript:
    if (
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("javascript:") ||
      anchor.getAttribute("target") === "_blank" ||
      anchor.getAttribute("rel")?.includes("external")
    ) {
      return;
    }

    // Handle internal routing
    if (href.startsWith("/")) {
      e.preventDefault();
      navigateTo(href);
    }
  });

  handleRoute();
}

function navigateTo(path) {
  if (window.location.pathname !== path) {
    window.history.pushState(null, "", path);
  }
  handleRoute();
}

function getCurrentRoutePath() {
  const hash = window.location.hash;
  if (hash && hash.startsWith("#/")) {
    const cleanFromHash = hash.slice(1);
    window.history.replaceState(null, "", cleanFromHash);
    return cleanFromHash;
  }
  return window.location.pathname || "/";
}

function handleRoute() {
  const rawPath = getCurrentRoutePath();
  const path = rawPath.toLowerCase();
  const mainView = document.getElementById("mainContent");
  if (!mainView) return;

  window.scrollTo({ top: 0, behavior: 'instant' });

  // Route 1: Home View
  if (path === "/" || path === "" || path === "/index.html") {
    renderHomeView(mainView);
    updateSEO(
      "Free Online Calculators & Step-by-Step Solvers | CalculatorBowl", 
      "Explore hundreds of free online calculators for finance, math, fractions, loans, and unit conversions with step-by-step mathematical solutions.",
      {
        pageType: "website",
        canonicalPath: "/",
        breadcrumbs: [{ name: "Home", link: "/" }]
      }
    );
    updateBreadcrumbs([]);
    updateActiveNav("");
    return;
  }

  // Route 2: Master Directory of All Calculators
  if (path === "/calculators" || path === "/calculators/" || path === "/calculators-list" || path === "/calculators-list/") {
    renderCalculatorsListView(mainView);
    updateSEO(
      "All Free Online Calculators A-Z Directory | CalculatorBowl",
      "Comprehensive alphabetical directory of all 37+ precision online calculators across financial, algebraic, fractional, unit, and network categories.",
      {
        pageType: "website",
        canonicalPath: "/calculators/",
        breadcrumbs: [
          { name: "Home", link: "/" },
          { name: "All Calculators", link: "/calculators/", current: true }
        ]
      }
    );
    updateBreadcrumbs([
      { name: "Home", link: "/" },
      { name: "All Calculators", link: "/calculators/", current: true }
    ]);
    updateActiveNav("calculators");
    return;
  }

  // Route 3: Hierarchical Calculator View (/calculators/:category/:subcategory/:calcSlug/)
  const hierarchicalCalcMatch = path.match(/^\/calculators\/([a-z0-9-]+)\/([a-z0-9-]+)\/([a-z0-9-]+)\/?$/);
  if (hierarchicalCalcMatch) {
    const [, catKey, subcatKey, calcSlug] = hierarchicalCalcMatch;
    const calc = getCalculatorByPath(catKey, subcatKey, calcSlug) || getCalculatorById(calcSlug);
    if (calc) {
      const cluster = TOPICAL_CLUSTERS[calc.category] || TOPICAL_CLUSTERS[catKey] || TOPICAL_CLUSTERS.financial;
      
      // Ensure canonical trailing slash URL
      if (rawPath !== calc.url) {
        window.history.replaceState(null, "", calc.url);
      }

      renderCalculatorView(mainView, calc, cluster);

      const richContent = (typeof CALCULATOR_RICH_CONTENT !== "undefined" && CALCULATOR_RICH_CONTENT[calc.id])
        ? CALCULATOR_RICH_CONTENT[calc.id]
        : null;
      const currentFaqs = (richContent && richContent.faqs) ? richContent.faqs : cluster.faqs;

      const breadcrumbs = [
        { name: "Home", link: "/" },
        { name: cluster.title, link: cluster.url || ('/calculators/' + cluster.id + '/') },
        { name: calc.subcatTitle || calc.subcategory, link: calc.subcatUrl || ('/calculators/' + calc.category + '/' + calc.subcategory + '/') },
        { name: calc.shortName, link: calc.url, current: true }
      ];

      updateSEO(calc.seoTitle, calc.seoDescription, {
        pageType: "calculator",
        canonicalPath: calc.url,
        calc: calc,
        cluster: cluster,
        faqs: currentFaqs,
        breadcrumbs: breadcrumbs
      });
      updateBreadcrumbs(breadcrumbs);
      updateActiveNav(cluster.canonicalId || cluster.id);
      return;
    }
  }

  // Route 4: Subcategory Hub View (/calculators/:category/:subcategory/)
  const subcatMatch = path.match(/^\/calculators\/([a-z0-9-]+)\/([a-z0-9-]+)\/?$/);
  if (subcatMatch) {
    const [, catKey, subcatKey] = subcatMatch;
    const cluster = TOPICAL_CLUSTERS[catKey];
    if (cluster) {
      renderSubcategoryView(mainView, cluster, subcatKey);
      return;
    }
  }

  // Route 5: Category Hub View (/calculators/:category/)
  const catMatch = path.match(/^\/calculators\/([a-z0-9-]+)\/?$/);
  if (catMatch && TOPICAL_CLUSTERS[catMatch[1]]) {
    const clusterId = catMatch[1];
    const cluster = TOPICAL_CLUSTERS[clusterId];
    
    // Canonicalize with trailing slash
    const canonicalCatUrl = cluster.url || ('/calculators/' + (cluster.canonicalId || cluster.id) + '/');
    if (rawPath !== canonicalCatUrl) {
      window.history.replaceState(null, "", canonicalCatUrl);
    }

    renderPillarView(mainView, cluster);

    const pillarContent = (typeof CATEGORY_PILLAR_CONTENT !== "undefined" && CATEGORY_PILLAR_CONTENT[cluster.id])
      ? CATEGORY_PILLAR_CONTENT[cluster.id]
      : null;
    const currentFaqs = (pillarContent && pillarContent.faqs) ? pillarContent.faqs : cluster.faqs;

    const breadcrumbs = [
      { name: "Home", link: "/" },
      { name: cluster.title, link: canonicalCatUrl, current: true }
    ];

    updateSEO(cluster.seoTitle, cluster.seoDescription, {
      pageType: "cluster",
      canonicalPath: canonicalCatUrl,
      cluster: cluster,
      faqs: currentFaqs,
      breadcrumbs: breadcrumbs
    });
    updateBreadcrumbs(breadcrumbs);
    updateActiveNav(cluster.canonicalId || cluster.id);
    return;
  }

  // Route 6: 301 Permanent Client-side Redirect for Legacy /calc/[id]
  const legacyCalcMatch = path.match(/^\/calc\/([a-z0-9-]+)\/?$/);
  if (legacyCalcMatch) {
    const legacyId = legacyCalcMatch[1];
    const calc = getCalculatorById(legacyId);
    if (calc && calc.url) {
      window.history.replaceState(null, "", calc.url);
      handleRoute();
      return;
    }
  }

  // Route 7: 301 Permanent Client-side Redirect for Legacy Category Paths
  const legacyCatMap = {
    "/financial": "/calculators/finance/",
    "/financial/": "/calculators/finance/",
    "/math": "/calculators/math/",
    "/math/": "/calculators/math/",
    "/conversions": "/calculators/conversion/",
    "/conversions/": "/calculators/conversion/",
    "/datetime": "/calculators/date-time/",
    "/datetime/": "/calculators/date-time/",
    "/network": "/calculators/tech-network/",
    "/network/": "/calculators/tech-network/"
  };
  if (legacyCatMap[path]) {
    window.history.replaceState(null, "", legacyCatMap[path]);
    handleRoute();
    return;
  }

  // Route 8: Dedicated Institutional & Directory Pages
  if (path === "/help" || path === "/help/") {
    renderHelpView(mainView);
    return;
  }
  if (path === "/suggestions" || path === "/suggestions/") {
    renderSuggestionsView(mainView);
    return;
  }
  if (path === "/contact" || path === "/contact/") {
    renderContactView(mainView);
    return;
  }
  if (path === "/terms" || path === "/terms/") {
    renderTermsView(mainView);
    return;
  }
  if (path === "/privacy" || path === "/privacy/") {
    renderPrivacyView(mainView);
    return;
  }

  // Fallback 404 / Home
  renderHomeView(mainView);

  if (window.i18nManager) {
    window.i18nManager.translateStaticUI();
  }
}

function updateActiveNav(activeId) {
  document.querySelectorAll(".nav-link, .mobile-nav-link").forEach(link => {
    const href = link.getAttribute("href") || "";
    if (activeId && href.includes(activeId)) {
      link.classList.add("active");
    } else if (!activeId && (href === "/" || href === "")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function updateBreadcrumbs(items) {
  const container = document.getElementById("breadcrumbNav");
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = "";
    container.style.display = "none";
    return;
  }

  container.style.display = "flex";
  container.innerHTML = items.map((item, idx) => {
    const isLast = idx === items.length - 1;
    if (isLast) {
      return `<span class="breadcrumb-item current">${item.name}</span>`;
    }
    return `
      <span class="breadcrumb-item">
        <a href="${item.link}">${item.name}</a>
        <span class="breadcrumb-separator">›</span>
      </span>
    `;
  }).join("");
}

/* ==========================================================================
   Google Analytics 4 (GA4) SPA Route Tracking
   Measurement ID: G-SE1P3EY0GJ
   ========================================================================== */
let lastTrackedGA4Path = null;

function trackGA4PageView(pageTitle, pageLocation, pagePath) {
  if (typeof window.gtag === "function") {
    // Prevent duplicate page_view tracking for the identical URL path
    if (lastTrackedGA4Path === pagePath) return;
    lastTrackedGA4Path = pagePath;

    window.gtag("set", {
      page_title: pageTitle,
      page_location: pageLocation,
      page_path: pagePath
    });

    window.gtag("event", "page_view", {
      page_title: pageTitle,
      page_location: pageLocation,
      page_path: pagePath
    });
  }
}

function updateSEO(title, description, options = {}) {
  document.title = title;
  
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute("content", description);
  }

  const canonicalTag = document.getElementById("canonicalUrl");
  const cleanBase = (window.location.origin && window.location.origin !== "null" && window.location.origin.startsWith("http"))
    ? window.location.origin
    : "https://calculatorbowl.com";
  
  let currentPath = options.canonicalPath || getCurrentRoutePath();
  if (currentPath !== "/" && !currentPath.endsWith("/")) {
    currentPath = currentPath + "/";
  }
  const currentUrl = cleanBase.replace(/\/+$/, "") + (currentPath === "/" ? "/" : currentPath);
  if (canonicalTag) {
    canonicalTag.setAttribute("href", currentUrl);
  }

  const ogTitle = document.getElementById("ogTitle");
  if (ogTitle) ogTitle.setAttribute("content", title);

  const ogDesc = document.getElementById("ogDesc");
  if (ogDesc) ogDesc.setAttribute("content", description);

  const ogUrl = document.getElementById("ogUrl");
  if (ogUrl) ogUrl.setAttribute("content", currentUrl);

  const ogType = document.getElementById("ogType");
  if (ogType) ogType.setAttribute("content", options.pageType === "calculator" ? "article" : "website");

  const twTitle = document.getElementById("twitterTitle");
  if (twTitle) twTitle.setAttribute("content", title);

  const twDesc = document.getElementById("twitterDesc");
  if (twDesc) twDesc.setAttribute("content", description);

  const jsonLdScript = document.getElementById("seo-json-ld");
  if (jsonLdScript) {
    const graph = [
      {
        "@type": "WebApplication",
        "@id": "https://calculatorbowl.com/#app",
        "name": "CalculatorBowl",
        "url": "https://calculatorbowl.com/",
        "applicationCategory": "EducationalApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires JavaScript. Requires HTML5.",
        "description": "Comprehensive client-side mathematical and financial calculators with step-by-step breakdowns, amortization schedules, and topical cluster authority.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    ];

    if (options.breadcrumbs && options.breadcrumbs.length > 0) {
      graph.push({
        "@type": "BreadcrumbList",
        "itemListElement": options.breadcrumbs.map((b, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": b.name,
          "item": b.link ? (cleanBase.replace(/\/+$/, '') + b.link) : currentUrl
        }))
      });
    }

    if (options.faqs && options.faqs.length > 0) {
      graph.push({
        "@type": "FAQPage",
        "mainEntity": options.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      });
    }

    if (options.calc) {
      graph.push({
        "@type": "SoftwareApplication",
        "name": options.calc.name,
        "description": options.calc.description,
        "applicationCategory": "EducationalApplication",
        "operatingSystem": "All",
        "url": currentUrl,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      });
    }

    jsonLdScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": graph
    }, null, 2);
  }

  // Google Analytics 4 (GA4) SPA Pageview Tracking
  trackGA4PageView(title, currentUrl, currentPath);
}

/* ==========================================================================
   View 1: Home View (Topical Hubs & Search)
   ========================================================================== */
function renderHomeView(container) {
  const primaryKeys = ['financial', 'math', 'conversions', 'datetime', 'network'];
  const categoryCardsHtml = primaryKeys.map(clusterKey => {
    const cluster = TOPICAL_CLUSTERS[clusterKey];
    if (!cluster) return '';
    const clusterUrl = cluster.url || ('/calculators/' + (cluster.canonicalId || cluster.id) + '/');
    const itemsHtml = cluster.calculators.map(c => `
      <li class="directory-item">
        <a href="${c.url || ('/calculators/' + c.category + '/' + c.subcategory + '/' + c.slug + '/')}">
          <span style="display: flex; align-items: center; gap: 0.45rem;">
            <span>${c.icon}</span>
            <span>${c.name}</span>
          </span>
          <span class="directory-item-badge">${c.badge}</span>
        </a>
      </li>
    `).join("");

    return `
      <div class="directory-category-card">
        <div class="directory-cat-header">
          <h2 class="directory-cat-title">
            <span>${cluster.icon}</span>
            <a href="${clusterUrl}">${cluster.title}</a>
          </h2>
          <span class="cluster-card-badge">${cluster.badge}</span>
        </div>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1rem;">${cluster.description}</p>
        
        <ul class="directory-items-grid">
          ${itemsHtml}
        </ul>

        <a href="${clusterUrl}" class="directory-view-all">
          <span>More ${cluster.shortTitle} Calculators »</span>
        </a>
      </div>
    `;
  }).join("");

  const allCalcs = getAllCalculators();
  const popularCalcs = allCalcs.slice(0, 6);
  const popularListHtml = popularCalcs.map(p => `
    <li class="popular-tool-item">
      <a href="${p.url}">
        <span style="font-size: 1.2rem;">${p.icon}</span>
        <div style="flex: 1;">
          <div style="font-size: 0.88rem; font-weight: 700;">${p.shortName}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">${p.subcatTitle || p.clusterTitle}</div>
        </div>
        <span style="color: var(--text-muted); font-size: 0.8rem;">→</span>
      </a>
    </li>
  `).join("");

  container.innerHTML = `
    <section class="home-hero-calc-section">
      <div id="homeBasicCalcRoot" style="width: 100%; display: flex; justify-content: center;">
        ${getBasicCalculatorMarkup("homeBasic")}
      </div>

      <div class="home-hero-content">
        <div>
          <span class="brand-badge" style="margin-bottom: 0.5rem; display: inline-block;">⚡ Instant Online Calculator</span>
          <h1 class="hero-title" style="font-size: 2.15rem; text-align: left; margin-bottom: 0.4rem;">
            Free Online <span class="gradient-text">Calculators</span>
          </h1>
          <p class="hero-subtitle" style="text-align: left; margin: 0; font-size: 0.95rem;">
            Calculate instantly with the keypad on the left (or use your physical keyboard), or explore our full directory of financial, fractional, and algebraic tools below.
          </p>
        </div>

        <div class="hero-search-wrapper" style="margin: 0; max-width: 100%;">
          <span class="hero-search-icon">🔍</span>
          <input type="text" id="heroSearchInput" class="hero-search-input" placeholder="Search specific calculator (e.g. loan, fractions, mortgage, percent)...">
          <div id="heroSearchResults" class="search-results-dropdown"></div>
        </div>

        <div class="quick-tools-grid">
          <a href="/calculators/finance/loans/loan-calculator/" class="quick-tool-card">
            <span>💳</span> <span>Personal Loan</span>
          </a>
          <a href="/calculators/finance/interest/compound-interest-calculator/" class="quick-tool-card">
            <span>📈</span> <span>Compound Interest</span>
          </a>
          <a href="/calculators/math/fractions/fraction-arithmetic-calculator/" class="quick-tool-card">
            <span>➗</span> <span>Fractions (+,-,×,÷)</span>
          </a>
          <a href="/calculators/math/percentage/percentage-calculator/" class="quick-tool-card">
            <span>📊</span> <span>Percentage (3-in-1)</span>
          </a>
          <a href="/calculators/conversion/measurement/temperature-converter/" class="quick-tool-card">
            <span>🌡️</span> <span>Temperature (°C/°F)</span>
          </a>
          <a href="/calculators/tech-network/speed/internet-speed-test/" class="quick-tool-card">
            <span>⚡</span> <span>Speed &amp; Ping Test</span>
          </a>
        </div>
      </div>
    </section>

    <div class="home-directory-layout">
      <main class="cluster-main">
        <div style="margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between;">
          <h2 style="font-family: var(--font-heading); font-size: 1.45rem; font-weight: 800; color: var(--text-primary); margin: 0;">
            📚 Browse All Calculator Categories
          </h2>
          <a href="/calculators/" style="font-size: 0.88rem; font-weight: 700; color: var(--accent-primary);">
            A-Z Index »
          </a>
        </div>

        ${categoryCardsHtml}
      </main>

      <aside class="cluster-sidebar">
        <div class="sidebar-widget">
          <h3 class="widget-title">🔥 Most Popular Tools</h3>
          <ul class="popular-tools-list">
            ${popularListHtml}
          </ul>
        </div>

        <div class="sidebar-widget">
          <h3 class="widget-title">💡 Why Use CalculatorBowl?</h3>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.65rem; font-size: 0.88rem; color: var(--text-secondary);">
            <li style="display: flex; gap: 0.5rem;">
              <span>⚡</span> <span><b>Instant & Client-Side:</b> Calculations execute directly in your browser with zero lag.</span>
            </li>
            <li style="display: flex; gap: 0.5rem;">
              <span>📐</span> <span><b>Step-by-Step Solutions:</b> Learn the exact formulas and steps used to solve every problem.</span>
            </li>
            <li style="display: flex; gap: 0.5rem;">
              <span>🔒</span> <span><b>100% Free & Private:</b> Your data stays on your device and is never stored on servers.</span>
            </li>
          </ul>
        </div>
      </aside>
    </div>

    <section class="calc-seo-content" style="margin-top: 2.5rem;">
      <h2 class="seo-content-title">Free Online Calculators with Step-by-Step Solutions</h2>
      <p class="seo-content-text">
        <b>CalculatorBowl</b> provides free online calculation tools designed for students, educators, financial planners, and professionals. Every calculator features verified mathematical algorithms and provides detailed, step-by-step explanations, formulas, and visual breakdowns so you can understand the method behind every result.
      </p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-top: 1.5rem;">
        <div style="padding: 1.25rem; background: var(--bg-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">💰</div>
          <h4 style="font-weight: 700; margin-bottom: 0.25rem;">Financial & Loans</h4>
          <p style="font-size: 0.88rem; color: var(--text-secondary);">Calculate loan amortizations, mortgage terms, compound interest growth, and vehicle payments.</p>
        </div>
        <div style="padding: 1.25rem; background: var(--bg-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">➗</div>
          <h4 style="font-weight: 700; margin-bottom: 0.25rem;">Math & Fractions</h4>
          <p style="font-size: 0.88rem; color: var(--text-secondary);">Add, subtract, multiply, and divide proper/mixed fractions with LCD finding and simplification.</p>
        </div>
        <div style="padding: 1.25rem; background: var(--bg-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🔄</div>
          <h4 style="font-weight: 700; margin-bottom: 0.25rem;">Unit Conversions</h4>
          <p style="font-size: 0.88rem; color: var(--text-secondary);">Instantly translate between metric and imperial scales for temperature, length, and distance.</p>
        </div>
      </div>
    </section>
  `;

  const heroInput = document.getElementById("heroSearchInput");
  const heroDropdown = document.getElementById("heroSearchResults");
  if (heroInput && heroDropdown) {
    attachSearchEvents(heroInput, heroDropdown);
  }

  const calcRoot = container.querySelector("#homeBasicCalcRoot");
  if (calcRoot && typeof initBasicCalculatorEngine === "function") {
    initBasicCalculatorEngine(calcRoot, "homeBasic", "homeCalcHistoryTape");
  }
}

/* ==========================================================================
   View 2: Category Hub View
   ========================================================================== */
function renderPillarView(container, cluster) {
  const cardsHtml = cluster.calculators.map(c => `
    <div class="cluster-card" style="padding: 1.5rem;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
        <span style="font-size: 1.75rem;">${c.icon}</span>
        <span class="cluster-card-badge">${c.subcatTitle || c.badge}</span>
      </div>
      <h3 class="cluster-card-title" style="font-size: 1.15rem; margin-bottom: 0.4rem;">${c.name}</h3>
      <p class="cluster-card-desc" style="margin-bottom: 1.25rem;">${c.description}</p>
      <a href="${c.url}" class="btn btn-primary btn-sm" style="margin-top: auto; width: 100%;">
        <span>Open Calculator →</span>
      </a>
    </div>
  `).join("");

  const pillarContent = (typeof CATEGORY_PILLAR_CONTENT !== "undefined" && CATEGORY_PILLAR_CONTENT[cluster.id])
    ? CATEGORY_PILLAR_CONTENT[cluster.id]
    : null;

  const currentFaqs = (pillarContent && pillarContent.faqs) ? pillarContent.faqs : cluster.faqs;

  const faqsHtml = currentFaqs.map((faq, idx) => `
    <div class="faq-item">
      <button type="button" class="faq-question" onclick="toggleFaq(this)">
        <span>${faq.q}</span>
        <span>▼</span>
      </button>
      <div class="faq-answer" style="${idx === 0 ? '' : 'display: none;'}">
        <p>${faq.a}</p>
      </div>
    </div>
  `).join("");

  container.innerHTML = `
    <div style="margin-bottom: 2rem;">
      <span class="brand-badge" style="font-size: 0.8rem; margin-bottom: 0.5rem; display: inline-block;">Category Directory</span>
      <h1 class="hero-title" style="font-size: 2.25rem; text-align: left; margin-bottom: 0.5rem;">
        ${cluster.icon} ${cluster.title}
      </h1>
      <p class="hero-subtitle" style="text-align: left; margin: 0 0 1.5rem; max-width: 800px;">
        ${cluster.description}
      </p>
    </div>

    <div class="clusters-grid">
      ${cardsHtml}
    </div>

    <section class="calc-seo-content" style="margin-top: 2.5rem;">
      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
        <span class="brand-badge">📚 Category Pillar Guide</span>
      </div>

      <h2 class="seo-content-title" style="font-size: 1.65rem; margin-bottom: 1rem;">
        ${pillarContent ? pillarContent.articleTitle : `Comprehensive Guide to ${cluster.title}`}
      </h2>

      ${pillarContent && pillarContent.diagramHtml ? pillarContent.diagramHtml : ''}

      <div class="seo-content-text" style="font-size: 0.96rem; line-height: 1.75; color: var(--text-secondary);">
        ${pillarContent ? pillarContent.articleHtml : `
          <p>
            Explore our full suite of precision calculators for ${cluster.shortTitle}.
          </p>
        `}
      </div>

      <h3 style="font-family: var(--font-heading); font-size: 1.3rem; margin-top: 2rem; margin-bottom: 0.85rem; color: var(--text-primary);">
        Frequently Asked Questions (${cluster.shortTitle})
      </h3>
      <div class="faq-accordion">
        ${faqsHtml}
      </div>
    </section>
  `;
}

/* ==========================================================================
   View 2B: Subcategory Hub View
   ========================================================================== */
function renderSubcategoryView(container, cluster, subcategoryKey) {
  const matchingCalcs = cluster.calculators.filter(c => c.subcategory === subcategoryKey);
  const subcatTitle = matchingCalcs[0]?.subcatTitle || (subcategoryKey.charAt(0).toUpperCase() + subcategoryKey.slice(1));

  const cardsHtml = matchingCalcs.map(c => `
    <div class="cluster-card" style="padding: 1.5rem;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
        <span style="font-size: 1.75rem;">${c.icon}</span>
        <span class="cluster-card-badge">${c.badge}</span>
      </div>
      <h3 class="cluster-card-title" style="font-size: 1.15rem; margin-bottom: 0.4rem;">${c.name}</h3>
      <p class="cluster-card-desc" style="margin-bottom: 1.25rem;">${c.description}</p>
      <a href="${c.url}" class="btn btn-primary btn-sm" style="margin-top: auto; width: 100%;">
        <span>Open Calculator →</span>
      </a>
    </div>
  `).join("");

  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: cluster.title, link: cluster.url || ('/calculators/' + cluster.id + '/') },
    { name: subcatTitle, link: '/calculators/' + cluster.id + '/' + subcategoryKey + '/', current: true }
  ];

  updateSEO(
    `${subcatTitle} - ${cluster.title} | CalculatorBowl`,
    `Precision online calculators for ${subcatTitle.toLowerCase()} under ${cluster.title.toLowerCase()}. Calculate with instant formulas and step-by-step solutions.`,
    {
      pageType: "cluster",
      canonicalPath: '/calculators/' + cluster.id + '/' + subcategoryKey + '/',
      cluster: cluster,
      breadcrumbs: breadcrumbs
    }
  );
  updateBreadcrumbs(breadcrumbs);
  updateActiveNav(cluster.canonicalId || cluster.id);

  container.innerHTML = `
    <div style="margin-bottom: 2rem;">
      <span class="brand-badge" style="font-size: 0.8rem; margin-bottom: 0.5rem; display: inline-block;">Subcategory Hub</span>
      <h1 class="hero-title" style="font-size: 2.25rem; text-align: left; margin-bottom: 0.5rem;">
        ${cluster.icon} ${subcatTitle}
      </h1>
      <p class="hero-subtitle" style="text-align: left; margin: 0 0 1.5rem; max-width: 800px;">
        Explore all ${subcatTitle.toLowerCase()} tools and solvers under the ${cluster.title} category.
      </p>
    </div>

    <div class="clusters-grid">
      ${cardsHtml}
    </div>
  `;
}

/* ==========================================================================
   View 3: Specific Calculator View (Calculator + Category Sidebar + Steps)
   ========================================================================== */
function renderCalculatorView(container, calc, cluster) {
  const relatedCalcs = getRelatedCalculators(cluster.id, calc.id);

  const relatedHtml = relatedCalcs.slice(0, 5).map(r => `
    <li>
      <a href="${r.url}" class="related-calc-link">
        <span>${r.icon} ${r.shortName}</span>
        <span style="color: var(--text-muted);">→</span>
      </a>
    </li>
  `).join("");

  const richContent = (typeof CALCULATOR_RICH_CONTENT !== "undefined" && CALCULATOR_RICH_CONTENT[calc.id]) 
    ? CALCULATOR_RICH_CONTENT[calc.id] 
    : null;

  const currentFaqs = (richContent && richContent.faqs) ? richContent.faqs : cluster.faqs;

  const faqsHtml = currentFaqs.map(faq => `
    <div class="faq-item">
      <button type="button" class="faq-question" onclick="toggleFaq(this)">
        <span>${faq.q}</span>
        <span>▼</span>
      </button>
      <div class="faq-answer">
        <p>${faq.a}</p>
      </div>
    </div>
  `).join("");

  container.innerHTML = `
    <div class="calculator-layout">
      <div class="calculator-card-main">
        <div class="calc-header">
          <a href="${cluster.url || ('/calculators/' + cluster.id + '/')}" class="calc-cluster-tag">
            <span>${cluster.icon} ${cluster.title} › ${calc.subcatTitle || calc.subcategory}</span>
          </a>
          <h1 class="calc-title">${calc.name}</h1>
          <p class="calc-summary">${calc.description}</p>
        </div>

        <div id="dynamicCalculatorBody" class="calc-body">
          <!-- Populated by calculator script -->
        </div>
      </div>

      <aside class="cluster-sidebar">
        <div class="sidebar-widget">
          <h3 class="widget-title">📁 Calculator Category</h3>
          <a href="${cluster.url || ('/calculators/' + cluster.id + '/')}" class="pillar-hub-badge">
            <span>${cluster.icon} All ${cluster.shortTitle} Calculators</span>
            <span>View All →</span>
          </a>
          
          <h4 style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.6rem; letter-spacing: 0.05em;">
            Related in ${calc.subcatTitle || cluster.shortTitle}:
          </h4>
          <ul class="related-calcs-list">
            ${relatedHtml}
          </ul>
        </div>

        <div class="sidebar-widget">
          <h3 class="widget-title">✨ Key Features</h3>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem; color: var(--text-secondary);">
            <li>✔️ Instant client-side computation</li>
            <li>✔️ Step-by-step formula breakdown</li>
            <li>✔️ Mobile & print friendly</li>
            <li>✔️ Free & unlimited usage</li>
          </ul>
        </div>
      </aside>
    </div>

    <section class="calc-seo-content">
      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
        <span class="brand-badge">📚 Authoritative Educational Guide</span>
      </div>

      <h2 class="seo-content-title" style="font-size: 1.65rem; margin-bottom: 1rem;">
        ${richContent ? richContent.articleTitle : `Complete Guide to ${calc.name}`}
      </h2>

      ${richContent && richContent.diagramHtml ? richContent.diagramHtml : ''}

      <div class="seo-content-text" style="font-size: 0.96rem; line-height: 1.75; color: var(--text-secondary);">
        ${richContent ? richContent.articleHtml : `
          <p>
            This calculator provides precision calculations using verified mathematical formulas and algorithmic principles. All equations are computed directly in your browser with zero latency.
          </p>
        `}
      </div>

      ${calc.contextualGuide ? `
        <div class="contextual-guide-card">
          <h3 class="contextual-guide-title">
            <span>🔗</span> ${calc.contextualGuide.title}
          </h3>
          <div class="contextual-guide-body">
            ${calc.contextualGuide.html}
          </div>
          ${calc.contextualGuide.suggestedLinks ? `
            <div class="contextual-links-grid">
              ${calc.contextualGuide.suggestedLinks.map(link => {
                const targetCalc = getCalculatorById(link.id);
                const targetUrl = targetCalc ? targetCalc.url : ('/calculators/' + link.id + '/');
                return `
                  <a href="${targetUrl}" class="contextual-link-btn">
                    <span>${link.icon}</span>
                    <span>${link.label}</span>
                  </a>
                `;
              }).join("")}
            </div>
          ` : ''}
        </div>
      ` : ''}

      <h3 style="font-family: var(--font-heading); font-size: 1.3rem; margin-top: 2rem; margin-bottom: 0.85rem; color: var(--text-primary);">
        Frequently Asked Questions (${calc.shortName})
      </h3>
      <div class="faq-accordion">
        ${faqsHtml}
      </div>
    </section>
  `;

  const calcBody = document.getElementById("dynamicCalculatorBody");
  if (calcBody && typeof window[calc.renderFunction] === "function") {
    window[calc.renderFunction](calcBody, calc);
  }
}

/* ==========================================================================
   Global & Header Search System
   ========================================================================== */
function initSearch() {
  const headerInput = document.getElementById("headerSearchInput");
  const headerDropdown = document.getElementById("headerSearchResults");
  if (headerInput && headerDropdown) {
    attachSearchEvents(headerInput, headerDropdown);
  }

  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      const input = document.getElementById("heroSearchInput") || document.getElementById("headerSearchInput") || document.getElementById("mobileSearchInput");
      if (input) {
        input.focus();
        input.select();
      }
    }
  });
}

function attachSearchEvents(input, dropdown) {
  input.addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (!query) {
      dropdown.style.display = "none";
      return;
    }

    const all = getAllCalculators();
    const matches = all.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.description.toLowerCase().includes(query) ||
      c.shortName.toLowerCase().includes(query) ||
      c.category.toLowerCase().includes(query) ||
      (c.subcategory && c.subcategory.toLowerCase().includes(query))
    );

    if (matches.length === 0) {
      dropdown.innerHTML = `
        <div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.88rem;">
          No calculators found matching "<b>${e.target.value}</b>".
        </div>
      `;
      dropdown.style.display = "block";
      return;
    }

    dropdown.innerHTML = matches.slice(0, 6).map(m => `
      <div class="search-result-item" onclick="navigateTo('${m.url}'); document.querySelectorAll('.search-results-dropdown, .mobile-search-results').forEach(d => d.style.display='none');">
        <div class="search-result-info">
          <div class="search-result-name">${m.icon} ${m.name}</div>
          <div class="search-result-cluster">${m.subcatTitle || m.clusterTitle} • ${m.badge}</div>
        </div>
        <span style="color: var(--accent-primary); font-size: 0.85rem;">Open →</span>
      </div>
    `).join("");

    dropdown.style.display = "block";
  });

  document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
}

function initMobileMenu() {
  const menuBtn = document.getElementById("mobileMenuBtn");
  const drawer = document.getElementById("mobileNavDrawer");
  if (!menuBtn || !drawer) return;

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = drawer.classList.toggle("is-open");
    menuBtn.classList.toggle("is-active", isOpen);
    menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    drawer.setAttribute("aria-hidden", isOpen ? "false" : "true");
    document.body.classList.toggle("drawer-open", isOpen);
  });

  drawer.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      drawer.classList.remove("is-open");
      menuBtn.classList.remove("is-active");
      menuBtn.setAttribute("aria-expanded", "false");
      drawer.setAttribute("aria-hidden", "true");
      document.body.classList.remove("drawer-open");
    }
  });

  document.addEventListener("click", (e) => {
    if (drawer.classList.contains("is-open") && !drawer.contains(e.target) && !menuBtn.contains(e.target)) {
      drawer.classList.remove("is-open");
      menuBtn.classList.remove("is-active");
      menuBtn.setAttribute("aria-expanded", "false");
      drawer.setAttribute("aria-hidden", "true");
      document.body.classList.remove("drawer-open");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("is-open")) {
      drawer.classList.remove("is-open");
      menuBtn.classList.remove("is-active");
      menuBtn.setAttribute("aria-expanded", "false");
      drawer.setAttribute("aria-hidden", "true");
      document.body.classList.remove("drawer-open");
    }
  });

  const mobileInput = document.getElementById("mobileSearchInput");
  const mobileDropdown = document.getElementById("mobileSearchResults");
  if (mobileInput && mobileDropdown) {
    attachSearchEvents(mobileInput, mobileDropdown);
  }
}

window.toggleFaq = function(button) {
  const answer = button.nextElementSibling;
  if (!answer) return;
  const isHidden = window.getComputedStyle(answer).display === "none";
  answer.style.display = isHidden ? "block" : "none";
  const icon = button.querySelector("span:last-child");
  if (icon) {
    icon.textContent = isHidden ? "▲" : "▼";
  }
};

/* ==========================================================================
   Dedicated View 4: Help Center & User Guide (Expanded 500-700 Words)
   ========================================================================== */
function renderHelpView(container) {
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Help Center", link: "/help", current: true }
  ];
  updateSEO(
    "Help Center & User Guide | CalculatorBowl",
    "Comprehensive guide to calculation algorithms, keyboard navigation shortcuts, numerical precision standards, offline capabilities, and FAQs on CalculatorBowl.",
    {
      pageType: "article",
      canonicalPath: "/help",
      breadcrumbs: breadcrumbs
    }
  );
  updateBreadcrumbs(breadcrumbs);

  container.innerHTML = `
    <div class="institutional-card" style="max-width: 960px; margin: 0 auto 3rem;">
      <div style="text-align: center; margin-bottom: 2.25rem;">
        <span class="brand-badge" style="margin-bottom: 0.5rem; display: inline-block;">📚 Knowledgebase &amp; Documentation</span>
        <h1 class="hero-title" style="font-size: 2.35rem; margin-bottom: 0.75rem;">
          Help Center &amp; <span class="gradient-text">User Manual</span>
        </h1>
        <p class="hero-subtitle" style="max-width: 720px; margin: 0 auto;">
          Welcome to the official CalculatorBowl technical manual. Master our client-side calculation engines, universal keyboard shortcuts, precision standards, and step-by-step mathematical workflows.
        </p>
      </div>

      <section class="institutional-section">
        <h2 class="institutional-heading">🚀 1. The CalculatorBowl Architecture &amp; Philosophy</h2>
        <p class="institutional-text">
          CalculatorBowl is engineered to deliver instantaneous, educational, and completely private computational tools for students, educators, financial analysts, engineers, and everyday users. Unlike traditional web calculation services that transmit user inputs to remote web servers for backend processing, CalculatorBowl executes 100% of mathematical routines, financial amortization algorithms, and unit conversions locally inside your browser's JavaScript V8 runtime engine.
        </p>
        <p class="institutional-text">
          This decentralized, client-side architecture guarantees three fundamental benefits: zero server latency for real-time calculations, complete data confidentiality without any personal input logging, and offline execution capabilities powered by modern Progressive Web App (PWA) service workers.
        </p>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">⚡ 2. Universal Keyboard Shortcuts &amp; High-Speed Input</h2>
        <p class="institutional-text">
          Power users and desktop professionals can navigate, calculate, and reset any tool on CalculatorBowl using built-in hardware keyboard shortcuts designed for high-efficiency workflows:
        </p>
        <div class="shortcut-grid">
          <div class="shortcut-item">
            <kbd>Ctrl + K</kbd> / <kbd>Cmd + K</kbd>
            <span>Open Universal Instant Spotlight Search</span>
          </div>
          <div class="shortcut-item">
            <kbd>Enter</kbd>
            <span>Trigger calculation &amp; refresh steps</span>
          </div>
          <div class="shortcut-item">
            <kbd>Tab</kbd> / <kbd>Shift + Tab</kbd>
            <span>Cycle through numeric input fields</span>
          </div>
          <div class="shortcut-item">
            <kbd>Esc</kbd>
            <span>Dismiss search modal or clear active focus</span>
          </div>
          <div class="shortcut-item">
            <kbd>C</kbd> / <kbd>Backspace</kbd>
            <span>Clear current register on handheld calculator</span>
          </div>
          <div class="shortcut-item">
            <kbd>Alt + T</kbd>
            <span>Toggle between Light Mode &amp; Dark Mode</span>
          </div>
        </div>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">📐 3. Understanding Step-by-Step Educational Proofs</h2>
        <p class="institutional-text">
          A defining principle of CalculatorBowl is transparent mathematical education. Rather than presenting isolated numeric answers, our engines provide structured step-by-step solutions that explain the underlying principles and intermediate algebraic steps:
        </p>
        <ul class="institutional-list">
          <li><strong>Fraction Operations &amp; Simplifications:</strong> Displays greatest common divisor (GCD) factorization, prime factorization trees, reciprocal multiplication for division, and improper-to-mixed number conversions.</li>
          <li><strong>Financial Amortization &amp; Compounding:</strong> Reveals exact compound growth breakdowns, periodic interest rate divisors, and dynamic year-by-year principal vs. interest payoff schedules.</li>
          <li><strong>Algebra, Statistics &amp; Geometry:</strong> Outlines formula substitution, discriminant evaluation in quadratic solvers, mean/variance deviations, and unit conversion cancellation factors.</li>
        </ul>
        <div class="institutional-highlight-box">
          💡 <strong>Pro Tip:</strong> Click the "Copy Summary" or "Export Schedule" button beneath any calculation result card to quickly copy formatted step-by-step solutions into homework, spreadsheets, or financial reports.
        </div>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">🎯 4. Numerical Precision &amp; Rounding Standards</h2>
        <p class="institutional-text">
          Standard floating-point computing in computer hardware can occasionally introduce binary rounding artifacts (such as <code>0.1 + 0.2 = 0.30000000000000004</code>). CalculatorBowl incorporates custom mathematical sanitization and arbitrary-precision algorithms to guarantee:
        </p>
        <ul class="institutional-list">
          <li><strong>Financial Calculations:</strong> Strictly adhere to commercial Half-Up Rounding rules (rounding half away from zero) locked to 2 decimal places to comply with standard GAAP accounting and banking practices.</li>
          <li><strong>Scientific &amp; Fractional Computations:</strong> Support up to 10 significant digits with exact fractional ratios preserved throughout intermediate steps before decimal conversion.</li>
          <li><strong>Unit Conversions:</strong> Calibrated against standard physical constants defined by the National Institute of Standards and Technology (NIST) and the International System of Units (SI).</li>
        </ul>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">📜 5. Calculator Tape History &amp; Session Storage</h2>
        <p class="institutional-text">
          Every equation entered into the standard handheld calculator is preserved in a local History Tape. This tape allows you to review past equations, verify input sequences, and recall previous totals. All history data resides exclusively in your browser's private storage (<code>localStorage</code>) and can be permanently purged at any time with the "Clear History" button.
        </p>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">❓ 6. Frequently Asked Help Questions</h2>
        <div class="faq-accordion">
          <div class="faq-item">
            <button type="button" class="faq-question" onclick="toggleFaq(this)">
              <span>Are all calculators on CalculatorBowl completely free to use?</span>
              <span>▼</span>
            </button>
            <div class="faq-answer" style="display: none;">
              Yes. Every calculator, conversion tool, amortization schedule, and step-by-step guide is 100% free with no subscription fees, credit card requirements, or forced account registrations.
            </div>
          </div>
          <div class="faq-item">
            <button type="button" class="faq-question" onclick="toggleFaq(this)">
              <span>Why does my loan amortization differ slightly from my mortgage lender?</span>
              <span>▼</span>
            </button>
            <div class="faq-answer" style="display: none;">
              Lenders may calculate interest compounding based on a 360-day commercial calendar vs. a 365-day exact calendar, or round per-diem interest differently. Additionally, escrow fees, private mortgage insurance (PMI), and property taxes may affect monthly billing amounts.
            </div>
          </div>
          <div class="faq-item">
            <button type="button" class="faq-question" onclick="toggleFaq(this)">
              <span>How do I report a mathematical error or formula discrepancy?</span>
              <span>▼</span>
            </button>
            <div class="faq-answer" style="display: none;">
              We maintain rigorous quality standards. If you spot an algorithmic issue, please reach out through our <a href="/contact" class="in-text-link">Contact Portal</a> or submit a detailed calculation case on our <a href="/suggestions" class="in-text-link">Suggestions Page</a>.
            </div>
          </div>
        </div>
      </section>

      <div style="margin-top: 2.5rem; text-align: center; display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
        <a href="/calculators/" class="btn btn-primary">
          <span>Explore All 37 Calculators »</span>
        </a>
        <a href="/contact" class="btn btn-secondary">
          <span>Contact Support Team</span>
        </a>
      </div>
    </div>
  `;
}

/* ==========================================================================
   Dedicated View: Requests & Suggestions (Expanded 500-700 Words)
   ========================================================================== */
function renderSuggestionsView(container) {
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Suggestions", link: "/suggestions", current: true }
  ];
  updateSEO(
    "Suggest a Calculator & Propose Features | CalculatorBowl",
    "Propose new mathematical formulas, financial tools, conversion solvers, or platform enhancements directly to the CalculatorBowl engineering and editorial team.",
    { pageType: "article", canonicalPath: "/suggestions", breadcrumbs: breadcrumbs }
  );
  updateBreadcrumbs(breadcrumbs);

  container.innerHTML = `
    <div class="institutional-card" style="max-width: 900px; margin: 0 auto 3rem;">
      <div style="text-align: center; margin-bottom: 2.25rem;">
        <span class="brand-badge" style="margin-bottom: 0.5rem; display: inline-block;">💡 Community Innovation</span>
        <h1 class="hero-title" style="font-size: 2.35rem; margin-bottom: 0.75rem;">
          Suggest a <span class="gradient-text">New Calculator</span>
        </h1>
        <p class="hero-subtitle" style="max-width: 700px; margin: 0 auto;">
          Help shape the future of CalculatorBowl. Our catalog expands based on requests from students, teachers, engineers, real estate investors, and finance professionals worldwide.
        </p>
      </div>

      <section class="institutional-section">
        <h2 class="institutional-heading">🌟 1. Community-Driven Engineering Roadmap</h2>
        <p class="institutional-text">
          CalculatorBowl is built around practical, real-world utility. While our current index features 37+ specialized calculation engines across Financial, Mathematical, Unit Conversion, Chronological, and Network categories, we are constantly expanding our topical clusters. Every proposal submitted through this portal is reviewed directly by our editorial board and algorithmic engineers.
        </p>
        <p class="institutional-text">
          Whether you need a specialized financial metric (such as a Cap Rate or 1031 Exchange model), an engineering formula (such as beam deflection or Ohms Law calculations), or a classroom physics solver, we welcome your suggestions. We prioritize tools with broad educational appeal and clear computational models.
        </p>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">📝 2. Submission Guidelines: What Makes an Ideal Proposal?</h2>
        <p class="institutional-text">
          To help our engineering team design and validate your requested calculator efficiently, please provide as much relevant technical context as possible:
        </p>
        <ul class="institutional-list">
          <li><strong>Calculator Name &amp; Core Goal:</strong> Give the tool a clear, descriptive title (e.g., <em>"Solar ROI &amp; Battery Payback Calculator"</em> or <em>"Concrete Volume &amp; Bag Estimator"</em>).</li>
          <li><strong>Required User Inputs:</strong> List all necessary input parameters, standard units (metric or imperial), and typical input ranges.</li>
          <li><strong>Mathematical Equations &amp; Formulas:</strong> Provide the underlying algebraic, geometric, or financial formulas, citing reputable standards such as NIST, IEEE, or IRS guidelines where applicable.</li>
          <li><strong>Expected Output Displays:</strong> Specify the primary result value, secondary metrics, interactive charts, or step-by-step breakdown tables you would like to see.</li>
          <li><strong>Sample Test Verification Case:</strong> Include a sample numerical test case with verified inputs and expected outputs to facilitate our automated test suite development.</li>
        </ul>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">🎓 3. Curriculum &amp; Academic Syllabus Integration</h2>
        <p class="institutional-text">
          Educators, textbook authors, and STEM instructors frequently request specialized solvers aligned with standardized curricula (such as AP Calculus, AP Statistics, IB Mathematics, or CFA financial modules). When submitting academic proposals, please indicate the targeted grade level, curriculum standards, and step-by-step pedagogical techniques that best aid student comprehension.
        </p>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">🔬 4. Our 4-Stage Quality Assurance Lifecycle</h2>
        <p class="institutional-text">
          Every community-suggested tool undergoes a rigorous 4-step deployment cycle before publication:
        </p>
        <div class="shortcut-grid">
          <div class="shortcut-item">
            <span style="font-size: 1.2rem;">1️⃣</span>
            <div><strong>Mathematical Formulation:</strong> Formula verification against textbook and academic sources.</div>
          </div>
          <div class="shortcut-item">
            <span style="font-size: 1.2rem;">2️⃣</span>
            <div><strong>Algorithmic Coding:</strong> Client-side JavaScript implementation with floating-point sanitization.</div>
          </div>
          <div class="shortcut-item">
            <span style="font-size: 1.2rem;">3️⃣</span>
            <div><strong>Automated Unit Testing:</strong> Validating zero-division guards, negative inputs, and edge cases.</div>
          </div>
          <div class="shortcut-item">
            <span style="font-size: 1.2rem;">4️⃣</span>
            <div><strong>UX &amp; Step Breakdown:</strong> Crafting responsive input cards and step-by-step educational explanations.</div>
          </div>
        </div>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">📨 5. Submit Your Calculator Proposal</h2>
        <form class="calc-body" style="background: var(--bg-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl); padding: 2rem; margin-top: 1rem;" onsubmit="handleFeedbackSubmit(event)">
          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label">Calculator Name / Topic <span style="color: var(--accent-primary);">*</span></label>
            <input type="text" class="form-control" placeholder="e.g., Solar Panel ROI Calculator, Concrete Footing Volume" required>
          </div>
          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label">Target Category <span style="color: var(--accent-primary);">*</span></label>
            <select class="form-select">
              <option value="financial">Financial &amp; Investment Modeling</option>
              <option value="math">Mathematics, Fractions &amp; Algebra</option>
              <option value="conversions">Scientific &amp; Unit Conversions</option>
              <option value="datetime">Date, Time &amp; Calendar Calculations</option>
              <option value="network">Technology &amp; Network Utilities</option>
              <option value="engineering">Engineering &amp; Construction</option>
            </select>
          </div>
          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label">Input Parameters &amp; Desired Outputs <span style="color: var(--accent-primary);">*</span></label>
            <textarea class="form-control" rows="3" placeholder="List the input fields needed and what intermediate or final results should be displayed..." required></textarea>
          </div>
          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label">Mathematical Formulas &amp; Reference Sources</label>
            <textarea class="form-control" rows="3" placeholder="Provide mathematical equations, reference links, or standard publications..."></textarea>
          </div>
          <div class="form-group" style="margin-bottom: 1.5rem;">
            <label class="form-label">Your Email (Optional, to receive notification when launched)</label>
            <input type="email" class="form-control" placeholder="name@example.com">
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">
            <span>🚀 Submit Calculator Proposal</span>
          </button>
        </form>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">❓ 6. Frequently Asked Proposal Questions</h2>
        <div class="faq-accordion">
          <div class="faq-item">
            <button type="button" class="faq-question" onclick="toggleFaq(this)">
              <span>How long does it take for a suggested calculator to go live?</span>
              <span>▼</span>
            </button>
            <div class="faq-answer" style="display: none;">
              Popular calculator proposals with well-defined mathematical specifications are typically coded, peer-reviewed, tested, and published within 2 to 4 weeks.
            </div>
          </div>
          <div class="faq-item">
            <button type="button" class="faq-question" onclick="toggleFaq(this)">
              <span>Can I submit formulas in foreign currencies or international metric standards?</span>
              <span>▼</span>
            </button>
            <div class="faq-answer" style="display: none;">
              Absolutely! CalculatorBowl supports global audiences with multi-currency formatting (USD, EUR, GBP, JPY, CAD, AUD, INR) and dual Metric/Imperial measurement units.
            </div>
          </div>
          <div class="faq-item">
            <button type="button" class="faq-question" onclick="toggleFaq(this)">
              <span>Do you offer attribution for community-contributed algorithms?</span>
              <span>▼</span>
            </button>
            <div class="faq-answer" style="display: none;">
              Yes, if you wish to be credited as a community contributor or academic reviewer, please note your name and institutional affiliation in the proposal form.
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

/* ==========================================================================
   Dedicated View: Contact Us & Editorial Office (Expanded 500-700 Words)
   ========================================================================== */
function renderContactView(container) {
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Contact", link: "/contact", current: true }
  ];
  updateSEO(
    "Contact Us & Editorial Office | CalculatorBowl",
    "Get in touch with the CalculatorBowl algorithmic team, editorial board, and developer support for inquiries, bug reports, or academic partnerships.",
    { pageType: "article", canonicalPath: "/contact", breadcrumbs: breadcrumbs }
  );
  updateBreadcrumbs(breadcrumbs);

  container.innerHTML = `
    <div class="institutional-card" style="max-width: 900px; margin: 0 auto 3rem;">
      <div style="text-align: center; margin-bottom: 2.25rem;">
        <span class="brand-badge" style="margin-bottom: 0.5rem; display: inline-block;">📬 Direct Inquiries</span>
        <h1 class="hero-title" style="font-size: 2.35rem; margin-bottom: 0.75rem;">
          Contact <span class="gradient-text">CalculatorBowl</span>
        </h1>
        <p class="hero-subtitle" style="max-width: 700px; margin: 0 auto;">
          Have questions about our calculation models, academic licensing, advertising inquiries, bug reports, or partnership opportunities? Our editorial and algorithmic engineering teams are here to assist you.
        </p>
      </div>

      <section class="institutional-section">
        <h2 class="institutional-heading">🤝 1. Open Communication with Our Algorithmic Team</h2>
        <p class="institutional-text">
          At CalculatorBowl, algorithmic precision and responsive user support are our top priorities. We believe computational tools should be completely transparent, reliable, and accessible to everyone. Our dedicated team of software engineers, mathematical reviewers, and educational content editors monitors inbound communications daily.
        </p>
        <p class="institutional-text">
          We welcome inquiries from educators, students, researchers, developers, and industry professionals. Whether you are submitting a mathematical bug report, inquiring about textbook citations, or discussing API integration possibilities, we are committed to providing prompt, accurate, and authoritative responses.
        </p>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">🏢 2. Direct Department Directory &amp; Inquiry Types</h2>
        <p class="institutional-text">
          To ensure your inquiry is routed to the appropriate specialist, please review our departmental coverage:
        </p>
        <div class="shortcut-grid">
          <div class="shortcut-item">
            <span style="font-size: 1.25rem;">🧮</span>
            <div><strong>Algorithmic Integrity &amp; Bug Reports:</strong> Precision discrepancies, formula corrections, edge case anomalies, or floating-point rounding issues.</div>
          </div>
          <div class="shortcut-item">
            <span style="font-size: 1.25rem;">🎓</span>
            <div><strong>Academic &amp; Classroom Inquiries:</strong> Educational citations, high school and university coursework licensing, curriculum alignment, and student toolkits.</div>
          </div>
          <div class="shortcut-item">
            <span style="font-size: 1.25rem;">💼</span>
            <div><strong>Partnerships &amp; Media:</strong> Press inquiries, computational tool syndication, commercial integrations, and advertising sponsorships.</div>
          </div>
          <div class="shortcut-item">
            <span style="font-size: 1.25rem;">💡</span>
            <div><strong>General Support &amp; Accessibility:</strong> User interface feedback, keyboard shortcut inquiries, dark mode styling, and screen reader accessibility.</div>
          </div>
        </div>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">🎓 3. Academic Partnerships &amp; Classroom Licensing</h2>
        <p class="institutional-text">
          We actively collaborate with high schools, colleges, STEM departments, and online educators. If you are an instructor seeking permission to embed our calculators in virtual learning environments (such as Canvas, Blackboard, or Google Classroom) or wish to cite our mathematical step-by-step algorithms in academic textbooks or curriculum syllabi, our educational licensing team provides complimentary permissions and integration assistance.
        </p>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">🌐 4. API Syndication &amp; Developer Integrations</h2>
        <p class="institutional-text">
          Software engineers and financial technology platforms interested in syndicating CalculatorBowl's client-side calculation models or embedding custom calculation widgets can contact our developer relations division. We provide structured algorithmic documentation, mathematical unit test fixtures, and client-side web component specifications.
        </p>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">⏱️ 5. Service Level Commitments &amp; Response Times</h2>
        <p class="institutional-text">
          We process all direct inquiries during standard business hours (Monday through Friday, 9:00 AM – 6:00 PM EST). Our standard turnaround targets ensure timely support for all users:
        </p>
        <ul class="institutional-list">
          <li><strong>Algorithmic Bug Reports &amp; Calculation Inaccuracies:</strong> Evaluated, verified against reference datasets, and addressed within 24 to 48 business hours by our mathematical team.</li>
          <li><strong>Academic Inquiries &amp; Educational Tool Requests:</strong> Responded to within 2 business days with licensing guidance.</li>
          <li><strong>Feature Proposals &amp; Partnership Discussions:</strong> Reviewed during our weekly sprint planning cycles.</li>
        </ul>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">✉️ 6. Send Us a Direct Message</h2>
        <p class="institutional-text">
          Please fill out the direct inquiry form below with your contact details and a clear description of your topic. Our engineering and editorial triage team will route your message immediately.
        </p>
        <form class="calc-body" style="background: var(--bg-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl); padding: 2rem; margin-top: 1rem;" onsubmit="handleFeedbackSubmit(event)">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
            <div class="form-group">
              <label class="form-label">Your Name <span style="color: var(--accent-primary);">*</span></label>
              <input type="text" class="form-control" placeholder="Jane Doe" required>
            </div>
            <div class="form-group">
              <label class="form-label">Email Address <span style="color: var(--accent-primary);">*</span></label>
              <input type="email" class="form-control" placeholder="jane@example.com" required>
            </div>
          </div>
          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label">Inquiry Department <span style="color: var(--accent-primary);">*</span></label>
            <select class="form-select">
              <option value="algorithm">Algorithmic Review &amp; Bug Report</option>
              <option value="academic">Academic &amp; Classroom Education</option>
              <option value="partnership">Commercial Partnerships &amp; Media</option>
              <option value="general">General Support &amp; Accessibility</option>
            </select>
          </div>
          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label">Subject <span style="color: var(--accent-primary);">*</span></label>
            <input type="text" class="form-control" placeholder="Brief summary of your inquiry..." required>
          </div>
          <div class="form-group" style="margin-bottom: 1.5rem;">
            <label class="form-label">Detailed Message <span style="color: var(--accent-primary);">*</span></label>
            <textarea class="form-control" rows="5" placeholder="Please describe your question, bug report with input numbers, or partnership proposal in detail..." required></textarea>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">
            <span>📨 Send Official Message</span>
          </button>
        </form>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">🛡️ 7. Security &amp; Responsible Disclosure</h2>
        <p class="institutional-text">
          If you are a cybersecurity researcher and have identified a potential vulnerability in our client-side asset delivery, CDN configurations, or HTTP security header policies, please submit a responsible disclosure report via this contact form. We appreciate coordinated vulnerability disclosure and will investigate immediately.
        </p>
        <p class="institutional-text">
          We do not maintain remote user databases or backend calculation storage, ensuring user data privacy by design across our computational infrastructure.
        </p>
      </section>
    </div>
  `;
}

/* ==========================================================================
   Dedicated View: Terms of Service (Expanded 500-700 Words)
   ========================================================================== */
function renderTermsView(container) {
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Terms of Service", link: "/terms", current: true }
  ];
  updateSEO(
    "Terms of Service & Legal Disclaimer | CalculatorBowl",
    "Official terms and conditions, educational disclaimers, algorithmic warranties, and acceptable use policies for using CalculatorBowl.",
    { pageType: "article", canonicalPath: "/terms", breadcrumbs: breadcrumbs }
  );
  updateBreadcrumbs(breadcrumbs);

  container.innerHTML = `
    <div class="institutional-card" style="max-width: 920px; margin: 0 auto 3rem;">
      <div style="text-align: center; margin-bottom: 2.25rem;">
        <span class="brand-badge" style="margin-bottom: 0.5rem; display: inline-block;">📜 Legal Agreement</span>
        <h1 class="hero-title" style="font-size: 2.35rem; margin-bottom: 0.75rem;">
          Terms of <span class="gradient-text">Service</span>
        </h1>
        <p class="hero-subtitle" style="max-width: 720px; margin: 0 auto;">
          Effective Date: September 1, 2026. Please read these terms carefully before accessing or using CalculatorBowl.
        </p>
      </div>

      <section class="institutional-section">
        <p class="institutional-text">
          Welcome to CalculatorBowl ("we", "us", or "our"). By accessing, browsing, or utilizing any of the calculation tools, conversion engines, financial amortization schedules, educational articles, or software interfaces available at <code>https://calculatorbowl.com</code>, you acknowledge that you have read, understood, and agree to be bound by the following Terms of Service. If you do not agree to these terms in their entirety, you must immediately discontinue use of the website.
        </p>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">⚖️ 1. Educational &amp; Informational Purpose Disclaimer</h2>
        <p class="institutional-text">
          All calculators, formulas, estimations, algorithms, amortization tables, and explanatory texts on CalculatorBowl are provided strictly for educational, informational, and personal illustrative purposes.
        </p>
        <ul class="institutional-list">
          <li><strong>No Financial, Tax, or Investment Advice:</strong> CalculatorBowl is not a certified financial planner, licensed mortgage broker, tax advisor, or CPA. Calculation outputs do not constitute formal lending agreements, underwriting determinations, tax filing recommendations, or investment advice.</li>
          <li><strong>No Legal, Engineering, or Health Advice:</strong> Mathematical approximations and unit conversion values should never substitute for certified structural engineering assessments, licensed legal counsel, or professional medical consultations.</li>
          <li><strong>Independent Verification Required:</strong> Users are solely responsible for independently verifying all calculation figures with certified professionals before executing financial contracts, real estate investments, tax filings, or engineering designs.</li>
        </ul>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">⚙️ 2. Algorithmic Precision &amp; "As-Is" Warranty Limitation</h2>
        <p class="institutional-text">
          CalculatorBowl provides all tools, mathematical solvers, scripts, and documentation on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis without warranties of any kind, whether express, implied, statutory, or otherwise.
        </p>
        <p class="institutional-text">
          While our editorial and engineering team rigorously tests algorithms against standard academic and governmental benchmarks (such as NIST and GAAP standards), we make no representations or warranties regarding the absolute accuracy, completeness, timeliness, or reliability of any computational result.
        </p>
        <p class="institutional-text">
          Under no circumstances shall CalculatorBowl, its owners, developers, or affiliates be liable for any direct, indirect, incidental, consequential, special, or punitive damages—including, without limitation, financial losses, tax penalties, investment losses, data errors, or business interruptions—arising out of the use or inability to use our tools.
        </p>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">🔒 3. Intellectual Property &amp; Acceptable Use Policy</h2>
        <p class="institutional-text">
          The proprietary JavaScript calculation engines, interactive UI layout, styling tokens, graphical icons, educational problem breakdowns, and editorial content on CalculatorBowl are protected under international copyright, trademark, and intellectual property laws.
        </p>
        <ul class="institutional-list">
          <li><strong>Permitted Use:</strong> You are granted a non-exclusive, non-transferable, revocable license to utilize our tools for personal calculations, educational classroom learning, and internal professional estimation.</li>
          <li><strong>Prohibited Conduct:</strong> You may not scrape, harvest, data-mine, reverse-engineer, frame within third-party domains, or systematically redistribute our proprietary calculation scripts without prior written consent.</li>
        </ul>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">💡 4. User-Submitted Suggestions &amp; Feedback License</h2>
        <p class="institutional-text">
          Any formulas, feature ideas, algorithm corrections, or calculator requests submitted through our suggestion or contact forms are provided on a non-confidential basis. By submitting feedback, you grant CalculatorBowl a perpetual, irrevocable, royalty-free, worldwide license to implement, adapt, and publish such suggestions within our public toolset.
        </p>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">🔗 5. External References &amp; Third-Party Services</h2>
        <p class="institutional-text">
          Our website may contain hyperlinks to third-party reference websites, academic resources, or public data providers (such as NIST, Open-Meteo, CoinGecko, or GoldAPI). We do not control or endorse the content, uptime, or privacy practices of external third-party sites.
        </p>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">📬 6. Amendments, Severability &amp; Legal Inquiries</h2>
        <p class="institutional-text">
          We reserve the right to modify these Terms of Service at any time. Changes become effective immediately upon posting to this page. If any provision of these Terms is deemed unlawful or unenforceable, that provision shall be severable without affecting the enforceability of the remaining provisions. For formal legal inquiries, please contact our administrative team via our <a href="/contact" class="in-text-link">Contact Portal</a>.
        </p>
      </section>
    </div>
  `;
}

/* ==========================================================================
   Dedicated View: Privacy Policy (Expanded 500-700 Words)
   ========================================================================== */
function renderPrivacyView(container) {
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Privacy Policy", link: "/privacy", current: true }
  ];
  updateSEO(
    "Privacy Policy & Client-Side Data Guarantee | CalculatorBowl",
    "Discover how CalculatorBowl protects your privacy with 100% client-side computing, zero data collection on calculation inputs, and full GDPR/CCPA compliance.",
    { pageType: "article", canonicalPath: "/privacy", breadcrumbs: breadcrumbs }
  );
  updateBreadcrumbs(breadcrumbs);

  container.innerHTML = `
    <div class="institutional-card" style="max-width: 920px; margin: 0 auto 3rem;">
      <div style="text-align: center; margin-bottom: 2.25rem;">
        <span class="brand-badge" style="margin-bottom: 0.5rem; display: inline-block;">🔒 Zero-Tracking Privacy</span>
        <h1 class="hero-title" style="font-size: 2.35rem; margin-bottom: 0.75rem;">
          Privacy <span class="gradient-text">Policy</span>
        </h1>
        <p class="hero-subtitle" style="max-width: 720px; margin: 0 auto;">
          Last Updated: September 1, 2026. Learn how CalculatorBowl guarantees zero-tracking calculation privacy and client-side data sovereignty.
        </p>
      </div>

      <section class="institutional-section">
        <p class="institutional-text">
          At CalculatorBowl, we firmly believe that your mathematical calculations, personal financial models, mortgage loan balances, and daily computations belong entirely to you. We have engineered our architecture from the ground up to uphold the highest standards of digital privacy, adhering strictly to global frameworks including the EU General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and the Children's Online Privacy Protection Act (COPPA).
        </p>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">🛡️ 1. The 100% Client-Side Computation Guarantee</h2>
        <p class="institutional-text">
          Unlike conventional web portals that process mathematical inputs on remote web servers, CalculatorBowl executes all calculation engines, amortization generators, and unit converters locally inside your web browser.
        </p>
        <ul class="institutional-list">
          <li><strong>Zero Numeric Input Transmission:</strong> When you enter a loan amount, interest rate, salary figure, investment balance, or fractional equation, those numbers never leave your device.</li>
          <li><strong>No Backend Calculation Databases:</strong> We do not log, capture, store, or transmit your calculation variables or results to any database or remote cloud endpoint.</li>
          <li><strong>Zero Financial Profiling:</strong> Because calculations happen on your hardware, CalculatorBowl creates no behavioral financial profiles, credit scoring records, or user tracking dossiers.</li>
        </ul>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">💾 2. Local Storage &amp; Client State Usage</h2>
        <p class="institutional-text">
          CalculatorBowl utilizes standard browser local storage mechanisms (<code>localStorage</code> and <code>sessionStorage</code>) exclusively to enhance your personal user experience:
        </p>
        <ul class="institutional-list">
          <li><strong>Theme Preferences:</strong> Storing your display selection between Light Mode and Dark Mode so your preferred aesthetic is preserved across visits.</li>
          <li><strong>Handheld Calculator History Tape:</strong> Storing your recent handheld equations locally on your device for rapid reference. This tape can be completely cleared at any time with a single click.</li>
          <li><strong>Client-Side Only:</strong> Data stored in local storage remains confined to your browser sandbox and is never transmitted over the network.</li>
        </ul>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">📶 3. Service Workers &amp; Offline PWA Capabilities</h2>
        <p class="institutional-text">
          CalculatorBowl includes an integrated Progressive Web App (PWA) Service Worker (<code>sw.js</code>) that caches static site assets (HTML, CSS styles, JavaScript bundles, and typography) locally. This allows you to load and execute calculations completely offline without sending any network requests.
        </p>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">📊 4. Non-Personal Server Logs &amp; Web Analytics</h2>
        <p class="institutional-text">
          When accessing web assets from CalculatorBowl, standard HTTP web servers automatically record non-personally identifiable technical connection telemetry:
        </p>
        <ul class="institutional-list">
          <li>Technical data includes your IP address (anonymized), browser user-agent, operating system, requested page URL, and access timestamp.</li>
          <li>This aggregate telemetry is used solely for network security, defending against automated DDoS attacks, optimizing CDN asset caching, and fixing 404 broken links.</li>
          <li>Server logs are never merged with calculation parameters.</li>
        </ul>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">🍪 5. Cookies &amp; Advertising Transparency</h2>
        <p class="institutional-text">
          CalculatorBowl does not use invasive cross-site tracking cookies. In the event that contextual non-personalized advertisements are displayed to support free hosting infrastructure, advertising partners may use basic non-identifiable cookies to prevent duplicate ad impressions. You can easily manage or block cookies through your browser privacy settings.
        </p>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">👶 6. Children's Privacy (COPPA Compliance)</h2>
        <p class="institutional-text">
          CalculatorBowl is an educational resource suitable for students of all ages. In full compliance with COPPA, we never solicit, collect, or store personal information from children under 13 years of age.
        </p>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">⚖️ 7. Your Data Rights Under GDPR &amp; CCPA</h2>
        <p class="institutional-text">
          Because CalculatorBowl does not collect or store personal user accounts or calculation records, you enjoy complete data sovereignty by default:
        </p>
        <ul class="institutional-list">
          <li><strong>Right to Erasure:</strong> Instantly wipe all locally stored tape history and theme settings by clearing your browser cache.</li>
          <li><strong>Right to Non-Discrimination:</strong> Enjoy unrestricted, identical access to all 37+ calculators without requiring personal data disclosure.</li>
        </ul>
      </section>

      <section class="institutional-section">
        <h2 class="institutional-heading">📬 8. Privacy Inquiries &amp; Contact</h2>
        <p class="institutional-text">
          If you have questions regarding our privacy architecture or client-side calculation safeguards, please reach out via our official <a href="/contact" class="in-text-link">Contact Portal</a>.
        </p>
      </section>
    </div>
  `;
}

/* ==========================================================================
   Dedicated View 5: Master Alphabetical Calculators List (A-Z Directory Optimized)
   ========================================================================== */
function renderCalculatorsListView(container) {
  const allCalcs = getAllCalculators();
  allCalcs.sort((a, b) => a.name.localeCompare(b.name));

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const grouped = {};
  alphabet.forEach(letter => { grouped[letter] = []; });

  allCalcs.forEach(c => {
    const firstChar = c.name.charAt(0).toUpperCase();
    if (grouped[firstChar]) {
      grouped[firstChar].push(c);
    } else {
      if (!grouped["#"]) grouped["#"] = [];
      grouped["#"].push(c);
    }
  });

  const azBarHtml = alphabet.map(letter => {
    const count = grouped[letter] ? grouped[letter].length : 0;
    if (count > 0) {
      return `<button type="button" class="az-letter-link" id="az-btn-${letter}" onclick="scrollToLetter('${letter}')" title="${count} Calculators starting with ${letter}">${letter}</button>`;
    }
    return `<span class="az-letter-link disabled">${letter}</span>`;
  }).join("");

  const letterSectionsHtml = alphabet.map(letter => {
    const items = grouped[letter] || [];
    if (items.length === 0) return "";

    const itemsHtml = items.map(c => `
      <div class="az-calc-item" data-name="${c.name.toLowerCase()}" data-desc="${c.description.toLowerCase()}" data-category="${c.clusterId || c.category || ''}">
        <a href="${c.url}" class="az-card-item">
          <div class="az-card-header">
            <div class="az-card-title-wrap">
              <span class="az-card-icon">${c.icon}</span>
              <span class="az-card-name">${c.name}</span>
            </div>
            <span class="az-card-badge">${c.subcatTitle || c.clusterTitle}</span>
          </div>
          <p class="az-card-desc">${c.description}</p>
        </a>
      </div>
    `).join("");

    return `
      <section class="az-letter-group" id="letter-${letter}">
        <div class="az-letter-heading">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span class="az-letter-char">${letter}</span>
            <span class="az-letter-heading-badge letter-count-badge">${items.length} Calculators</span>
          </div>
          <a href="#azIndexNav" class="in-text-link" style="font-size: 0.82rem; text-decoration: none; font-weight: 500;">↑ Back to Top</a>
        </div>
        <div class="az-calc-list" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 1rem;">
          ${itemsHtml}
        </div>
      </section>
    `;
  }).join("");

  container.innerHTML = `
    <div class="calc-seo-content" style="max-width: 1100px; margin: 0 auto 3rem;">
      <!-- Hero Header & Directory Statistics -->
      <div style="text-align: center; margin-bottom: 2rem;">
        <span class="brand-badge" style="margin-bottom: 0.5rem; display: inline-block;">📚 Complete Catalog &amp; Master Index</span>
        <h1 class="hero-title" style="font-size: 2.45rem; margin-bottom: 0.6rem;">
          All <span class="gradient-text">Calculators &amp; Solvers</span> (A-Z)
        </h1>
        <p class="hero-subtitle" style="max-width: 760px; margin: 0 auto; line-height: 1.6;">
          Browse our complete alphabetical catalog of 37+ specialized calculation tools, mathematical solvers, and unit conversion engines. Filter instantly by keyword or select a topical category.
        </p>

        <!-- Metrics Dashboard -->
        <div class="az-hero-stats">
          <div class="az-stat-card">
            <div class="az-stat-val">37+</div>
            <div class="az-stat-lbl">Specialized Solvers</div>
          </div>
          <div class="az-stat-card">
            <div class="az-stat-val">5</div>
            <div class="az-stat-lbl">Pillar Disciplines</div>
          </div>
          <div class="az-stat-card">
            <div class="az-stat-val">100%</div>
            <div class="az-stat-lbl">Client-Side Speed</div>
          </div>
          <div class="az-stat-card">
            <div class="az-stat-val">NIST</div>
            <div class="az-stat-lbl">Precision Standard</div>
          </div>
        </div>

        <!-- Real-Time Search Wrap -->
        <div class="az-search-wrap">
          <span class="az-search-icon">🔍</span>
          <input 
            type="text" 
            id="azFilterInput" 
            placeholder="Type calculator name, formula, or topic (e.g., mortgage, fraction, speed)..." 
            oninput="window.filterAzCatalog(this.value)"
            class="az-search-input"
            autocomplete="off"
          />
          <button type="button" class="az-clear-search-btn" id="azClearBtn" style="display: none;" onclick="window.clearAzSearch()" title="Clear Search">✕</button>
        </div>

        <!-- Interactive Category Filter Chips -->
        <div class="az-filter-chips" id="azCategoryChips">
          <button type="button" class="az-chip-btn active" data-cat="all" onclick="window.filterAzCategory('all')">🔘 All Calculators (37)</button>
          <button type="button" class="az-chip-btn" data-cat="financial" onclick="window.filterAzCategory('financial')">💰 Financial &amp; Loans (14)</button>
          <button type="button" class="az-chip-btn" data-cat="math" onclick="window.filterAzCategory('math')">📐 Math &amp; Fractions (15)</button>
          <button type="button" class="az-chip-btn" data-cat="conversions" onclick="window.filterAzCategory('conversions')">⚖️ Unit Conversions (3)</button>
          <button type="button" class="az-chip-btn" data-cat="datetime" onclick="window.filterAzCategory('datetime')">⏱️ Date &amp; Time (3)</button>
          <button type="button" class="az-chip-btn" data-cat="network" onclick="window.filterAzCategory('network')">🌐 Tech &amp; Network (2)</button>
        </div>

        <div class="az-filter-status" id="azFilterStatus">
          Showing <strong id="azVisibleCount">37</strong> of 37 calculators across <strong id="azGroupCount">15</strong> active letter sections
        </div>
      </div>

      <!-- Sticky Alphabetical Index Bar -->
      <nav class="az-index-bar" id="azIndexNav" aria-label="Alphabetical Jump Navigation" style="display: flex; flex-wrap: wrap; gap: 0.35rem; justify-content: center; margin-bottom: 2.25rem;">
        ${azBarHtml}
      </nav>

      <!-- A-Z Letter Sections Container -->
      <div id="azListContainer">
        ${letterSectionsHtml}
      </div>
      
      <!-- No Results State -->
      <div id="azNoResults" style="display: none; padding: 3.5rem 1.5rem; text-align: center; background: var(--bg-subtle); border-radius: var(--radius-xl); border: 2px dashed var(--border-color); margin-top: 1.5rem;">
        <div style="font-size: 3rem; margin-bottom: 0.75rem;">🔍</div>
        <h3 style="margin: 0 0 0.5rem; color: var(--text-primary); font-family: var(--font-heading);">No matching calculators found</h3>
        <p style="margin: 0 0 1.25rem; color: var(--text-secondary); font-size: 0.95rem;">
          Try searching for a different formula keyword, or press <kbd style="padding: 2px 6px; background: var(--bg-surface); border-radius: 4px; border: 1px solid var(--border-color); font-family: var(--font-mono);">Ctrl + K</kbd> for the universal spotlight search.
        </p>
        <button type="button" class="btn btn-secondary" onclick="window.clearAzSearch()">
          <span>Reset All Filters</span>
        </button>
      </div>

      <!-- Deep In-Content Educational Directory Guide (500+ Words) -->
      <div class="contextual-guide-card" style="margin-top: 3.5rem; padding: 2.25rem 2rem;">
        <h2 style="font-family: var(--font-heading); font-size: 1.45rem; color: var(--text-primary); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
          📖 Master Guide to the CalculatorBowl Computation Directory
        </h2>
        <p style="color: var(--text-secondary); line-height: 1.75; font-size: 0.94rem; margin-bottom: 1.25rem;">
          Welcome to the comprehensive CalculatorBowl computation directory and educational resource index. This master catalog organizes 37+ specialized calculation tools, algebraic solvers, financial planning engines, unit converters, and network diagnostic utilities into an intuitive alphabetical and topical architecture. Whether you are solving fraction arithmetic homework, calculating mortgage loan amortization schedules, or estimating streaming data bandwidth, every tool is engineered with step-by-step mathematical proofs and zero-latency client-side execution.
        </p>

        <h3 style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--text-primary); margin: 1.5rem 0 0.5rem;">
          🎯 How to Navigate the Catalog Efficiently
        </h3>
        <p style="color: var(--text-secondary); line-height: 1.75; font-size: 0.94rem; margin-bottom: 1rem;">
          Our directory provides three seamless navigation pathways tailored to your specific workflow:
        </p>
        <ul style="color: var(--text-secondary); line-height: 1.75; font-size: 0.94rem; margin-left: 1.35rem; margin-bottom: 1.25rem;">
          <li><strong>Alphabetical Jump Bar (A–Z):</strong> Click any letter in the sticky jump navigation bar above to glide directly to tools starting with that letter. Active letters highlight their available count.</li>
          <li><strong>Category Filter Chips:</strong> Narrow the entire catalog down to a specific discipline—such as <em>Financial &amp; Loans</em> (14 tools), <em>Math &amp; Fractions</em> (15 tools), or <em>Unit Conversions</em> (3 tools)—with a single click.</li>
          <li><strong>Instant Sub-String Search:</strong> Type any keyword into the search bar to filter simultaneously across calculator titles, mathematical formulas, and descriptive tags in real time.</li>
        </ul>

        <h3 style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--text-primary); margin: 1.5rem 0 0.5rem;">
          🧮 Our 5 Core Calculation Disciplines
        </h3>
        <p style="color: var(--text-secondary); line-height: 1.75; font-size: 0.94rem; margin-bottom: 1rem;">
          Every tool in our directory belongs to a carefully structured topical hub designed for depth and authority:
        </p>
        <ul style="color: var(--text-secondary); line-height: 1.75; font-size: 0.94rem; margin-left: 1.35rem; margin-bottom: 1.25rem;">
          <li><strong>1. Financial &amp; Investment Hub:</strong> Covers fixed-rate loan amortization, monthly mortgage escrow calculations, compound interest accumulation models, salary gross-to-net tax breakdowns, sales tax calculations, tip estimators, business depreciation, profit margins, and live-price gold/bitcoin valuation calculators.</li>
          <li><strong>2. Math, Fractions &amp; Algebra Hub:</strong> Solves standard arithmetic, fraction arithmetic (+, −, ×, ÷), mixed numbers simplification, fraction-to-decimal and decimal-to-fraction conversions, quadratic formula solvers, greatest common factor (GCF) and least common multiple (LCM), prime factorization trees, ratio/proportion equations, mean/median/mode statistics, standard deviation variance, scientific notation converters, and power/exponent evaluators.</li>
          <li><strong>3. Unit Conversion Hub:</strong> Delivers high-precision conversions across temperature (Celsius, Fahrenheit, Kelvin), length/distance (metric millimeters to miles), and weight/mass (grams to pounds and ounces) adhering strictly to NIST physical conversion factors.</li>
          <li><strong>4. Date &amp; Time Hub:</strong> Provides exact chronological age calculations down to the day and hour, multi-interval time duration calculators, and live weather forecast temperature conversions.</li>
          <li><strong>5. Tech &amp; Network Hub:</strong> Provides real-time browser internet speed testing and video streaming data consumption bandwidth calculators.</li>
        </ul>

        <h3 style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--text-primary); margin: 1.5rem 0 0.5rem;">
          📐 Mathematical Rigor, Formula Verification &amp; Step-by-Step Proofs
        </h3>
        <p style="color: var(--text-secondary); line-height: 1.75; font-size: 0.94rem; margin-bottom: 1.25rem;">
          Unlike basic calculators that output isolated digits, every tool across our directory generates detailed step-by-step mathematical explanations. For financial calculators, this includes monthly principal vs. interest amortization breakdown schedules and compound interest accumulation charts. For fraction tools, our engines show greatest common factor prime factorization steps and cross-multiplication procedures. This educational focus empowers students, analysts, and professionals to understand the exact mathematical principles behind every result.
        </p>

        <h3 style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--text-primary); margin: 1.5rem 0 0.5rem;">
          🔒 Privacy, Accuracy &amp; Client-Side Computing
        </h3>
        <p style="color: var(--text-secondary); line-height: 1.75; font-size: 0.94rem; margin-bottom: 0;">
          All computations across all 37 tools occur 100% locally inside your web browser. No personal financial values, mortgage balances, or calculation variables are ever transmitted across remote network servers. This guarantees maximum calculation speed, total data privacy, and full offline availability through our Progressive Web App (PWA) architecture.
        </p>
      </div>
    </div>
  `;
}

/* ==========================================================================
   Directory Search & Filter State Management
   ========================================================================== */
window.currentAzCategory = "all";

window.filterAzCategory = function(catKey) {
  window.currentAzCategory = catKey || "all";
  
  // Update active chip UI
  document.querySelectorAll(".az-chip-btn").forEach(btn => {
    if (btn.getAttribute("data-cat") === window.currentAzCategory) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  const searchInput = document.getElementById("azFilterInput");
  const query = searchInput ? searchInput.value : "";
  window.applyAzFilters(query, window.currentAzCategory);
};

window.filterAzCatalog = function(query) {
  const clearBtn = document.getElementById("azClearBtn");
  if (clearBtn) {
    clearBtn.style.display = (query && query.trim().length > 0) ? "inline-flex" : "none";
  }
  window.applyAzFilters(query, window.currentAzCategory);
};

window.clearAzSearch = function() {
  const searchInput = document.getElementById("azFilterInput");
  if (searchInput) {
    searchInput.value = "";
    searchInput.focus();
  }
  const clearBtn = document.getElementById("azClearBtn");
  if (clearBtn) clearBtn.style.display = "none";
  window.currentAzCategory = "all";
  
  document.querySelectorAll(".az-chip-btn").forEach(btn => {
    if (btn.getAttribute("data-cat") === "all") {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  window.applyAzFilters("", "all");
};

window.applyAzFilters = function(query, category) {
  const cleanQuery = (query || "").trim().toLowerCase();
  const selectedCat = category || "all";
  const groups = document.querySelectorAll(".az-letter-group");
  let totalVisible = 0;
  let visibleGroups = 0;

  groups.forEach(group => {
    const items = group.querySelectorAll(".az-calc-item");
    let groupVisibleCount = 0;

    items.forEach(item => {
      const name = item.getAttribute("data-name") || "";
      const desc = item.getAttribute("data-desc") || "";
      const cat = item.getAttribute("data-category") || "";

      const matchesQuery = !cleanQuery || name.includes(cleanQuery) || desc.includes(cleanQuery);
      const matchesCat = (selectedCat === "all") || (cat === selectedCat) || (selectedCat === "financial" && (cat === "financial" || cat === "finance")) || (selectedCat === "network" && (cat === "network" || cat === "tech-network"));

      if (matchesQuery && matchesCat) {
        item.style.display = "";
        groupVisibleCount++;
      } else {
        item.style.display = "none";
      }
    });

    const letterId = group.id.replace("letter-", "");
    const letterBtn = document.getElementById(`az-btn-${letterId}`);

    if (groupVisibleCount > 0) {
      group.style.display = "";
      totalVisible += groupVisibleCount;
      visibleGroups++;
      if (letterBtn) {
        letterBtn.classList.remove("disabled");
        letterBtn.removeAttribute("disabled");
      }
    } else {
      group.style.display = "none";
      if (letterBtn) {
        letterBtn.classList.add("disabled");
      }
    }

    const badge = group.querySelector(".letter-count-badge");
    if (badge) {
      badge.textContent = `${groupVisibleCount} Calculator${groupVisibleCount === 1 ? '' : 's'}`;
    }
  });

  const noResults = document.getElementById("azNoResults");
  if (noResults) {
    noResults.style.display = totalVisible === 0 ? "block" : "none";
  }

  const visibleCountEl = document.getElementById("azVisibleCount");
  if (visibleCountEl) visibleCountEl.textContent = totalVisible;

  const groupCountEl = document.getElementById("azGroupCount");
  if (groupCountEl) groupCountEl.textContent = visibleGroups;
};

window.scrollToLetter = function(letter) {
  const el = document.getElementById(`letter-${letter}`);
  if (el) {
    const yOffset = -90;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
};

window.handleFeedbackSubmit = function(event) {
  event.preventDefault();
  const form = event.target;
  form.innerHTML = `
    <div style="padding: 2.25rem 1.5rem; background: rgba(16, 185, 129, 0.08); border: 1.5px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-xl); text-align: center; color: #059669;">
      <div style="font-size: 2.75rem; margin-bottom: 0.75rem;">🎉</div>
      <h3 style="color: #059669; margin: 0 0 0.5rem; font-family: var(--font-heading); font-size: 1.35rem;">Submission Successfully Received!</h3>
      <p style="margin: 0; font-size: 0.95rem; color: var(--text-secondary); line-height: 1.7; max-width: 540px; margin: 0 auto;">
        Thank you for contributing to CalculatorBowl. Our algorithmic engineering and editorial teams review all community proposals, formula requests, and feedback during our weekly sprint planning cycles.
      </p>
    </div>
  `;
};
