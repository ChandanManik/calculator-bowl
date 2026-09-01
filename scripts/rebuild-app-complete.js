/**
 * Complete Rebuilder for js/app.js with Modern Hierarchical Router
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const appJsPath = path.join(rootDir, 'js/app.js');

const appJsContent = `/**
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
  const hierarchicalCalcMatch = path.match(/^\\/calculators\\/([a-z0-9-]+)\\/([a-z0-9-]+)\\/([a-z0-9-]+)\\/?$/);
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
  const subcatMatch = path.match(/^\\/calculators\\/([a-z0-9-]+)\\/([a-z0-9-]+)\\/?$/);
  if (subcatMatch) {
    const [, catKey, subcatKey] = subcatMatch;
    const cluster = TOPICAL_CLUSTERS[catKey];
    if (cluster) {
      renderSubcategoryView(mainView, cluster, subcatKey);
      return;
    }
  }

  // Route 5: Category Hub View (/calculators/:category/)
  const catMatch = path.match(/^\\/calculators\\/([a-z0-9-]+)\\/?$/);
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
  const legacyCalcMatch = path.match(/^\\/calc\\/([a-z0-9-]+)\\/?$/);
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
      return \`<span class="breadcrumb-item current">\${item.name}</span>\`;
    }
    return \`
      <span class="breadcrumb-item">
        <a href="\${item.link}">\${item.name}</a>
        <span class="breadcrumb-separator">›</span>
      </span>
    \`;
  }).join("");
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
  const currentUrl = cleanBase.replace(/\\/+$/, "") + (currentPath === "/" ? "/" : currentPath);
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
          "item": b.link ? (cleanBase.replace(/\\/+$/, '') + b.link) : currentUrl
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
    const itemsHtml = cluster.calculators.map(c => \`
      <li class="directory-item">
        <a href="\${c.url || ('/calculators/' + c.category + '/' + c.subcategory + '/' + c.slug + '/')}">
          <span style="display: flex; align-items: center; gap: 0.45rem;">
            <span>\${c.icon}</span>
            <span>\${c.name}</span>
          </span>
          <span class="directory-item-badge">\${c.badge}</span>
        </a>
      </li>
    \`).join("");

    return \`
      <div class="directory-category-card">
        <div class="directory-cat-header">
          <h2 class="directory-cat-title">
            <span>\${cluster.icon}</span>
            <a href="\${clusterUrl}">\${cluster.title}</a>
          </h2>
          <span class="cluster-card-badge">\${cluster.badge}</span>
        </div>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1rem;">\${cluster.description}</p>
        
        <ul class="directory-items-grid">
          \${itemsHtml}
        </ul>

        <a href="\${clusterUrl}" class="directory-view-all">
          <span>More \${cluster.shortTitle} Calculators »</span>
        </a>
      </div>
    \`;
  }).join("");

  const allCalcs = getAllCalculators();
  const popularCalcs = allCalcs.slice(0, 6);
  const popularListHtml = popularCalcs.map(p => \`
    <li class="popular-tool-item">
      <a href="\${p.url}">
        <span style="font-size: 1.2rem;">\${p.icon}</span>
        <div style="flex: 1;">
          <div style="font-size: 0.88rem; font-weight: 700;">\${p.shortName}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">\${p.subcatTitle || p.clusterTitle}</div>
        </div>
        <span style="color: var(--text-muted); font-size: 0.8rem;">→</span>
      </a>
    </li>
  \`).join("");

  container.innerHTML = \`
    <section class="home-hero-calc-section">
      <div id="homeBasicCalcRoot" style="width: 100%; display: flex; justify-content: center;">
        \${getBasicCalculatorMarkup("homeBasic")}
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

        \${categoryCardsHtml}
      </main>

      <aside class="cluster-sidebar">
        <div class="sidebar-widget">
          <h3 class="widget-title">🔥 Most Popular Tools</h3>
          <ul class="popular-tools-list">
            \${popularListHtml}
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
  \`;

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
  const cardsHtml = cluster.calculators.map(c => \`
    <div class="cluster-card" style="padding: 1.5rem;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
        <span style="font-size: 1.75rem;">\${c.icon}</span>
        <span class="cluster-card-badge">\${c.subcatTitle || c.badge}</span>
      </div>
      <h3 class="cluster-card-title" style="font-size: 1.15rem; margin-bottom: 0.4rem;">\${c.name}</h3>
      <p class="cluster-card-desc" style="margin-bottom: 1.25rem;">\${c.description}</p>
      <a href="\${c.url}" class="btn btn-primary btn-sm" style="margin-top: auto; width: 100%;">
        <span>Open Calculator →</span>
      </a>
    </div>
  \`).join("");

  const pillarContent = (typeof CATEGORY_PILLAR_CONTENT !== "undefined" && CATEGORY_PILLAR_CONTENT[cluster.id])
    ? CATEGORY_PILLAR_CONTENT[cluster.id]
    : null;

  const currentFaqs = (pillarContent && pillarContent.faqs) ? pillarContent.faqs : cluster.faqs;

  const faqsHtml = currentFaqs.map((faq, idx) => \`
    <div class="faq-item">
      <button type="button" class="faq-question" onclick="toggleFaq(this)">
        <span>\${faq.q}</span>
        <span>▼</span>
      </button>
      <div class="faq-answer" style="\${idx === 0 ? '' : 'display: none;'}">
        <p>\${faq.a}</p>
      </div>
    </div>
  \`).join("");

  container.innerHTML = \`
    <div style="margin-bottom: 2rem;">
      <span class="brand-badge" style="font-size: 0.8rem; margin-bottom: 0.5rem; display: inline-block;">Category Directory</span>
      <h1 class="hero-title" style="font-size: 2.25rem; text-align: left; margin-bottom: 0.5rem;">
        \${cluster.icon} \${cluster.title}
      </h1>
      <p class="hero-subtitle" style="text-align: left; margin: 0 0 1.5rem; max-width: 800px;">
        \${cluster.description}
      </p>
    </div>

    <div class="clusters-grid">
      \${cardsHtml}
    </div>

    <section class="calc-seo-content" style="margin-top: 2.5rem;">
      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
        <span class="brand-badge">📚 Category Pillar Guide</span>
      </div>

      <h2 class="seo-content-title" style="font-size: 1.65rem; margin-bottom: 1rem;">
        \${pillarContent ? pillarContent.articleTitle : \`Comprehensive Guide to \${cluster.title}\`}
      </h2>

      \${pillarContent && pillarContent.diagramHtml ? pillarContent.diagramHtml : ''}

      <div class="seo-content-text" style="font-size: 0.96rem; line-height: 1.75; color: var(--text-secondary);">
        \${pillarContent ? pillarContent.articleHtml : \`
          <p>
            Explore our full suite of precision calculators for \${cluster.shortTitle}.
          </p>
        \`}
      </div>

      <h3 style="font-family: var(--font-heading); font-size: 1.3rem; margin-top: 2rem; margin-bottom: 0.85rem; color: var(--text-primary);">
        Frequently Asked Questions (\${cluster.shortTitle})
      </h3>
      <div class="faq-accordion">
        \${faqsHtml}
      </div>
    </section>
  \`;
}

/* ==========================================================================
   View 2B: Subcategory Hub View
   ========================================================================== */
function renderSubcategoryView(container, cluster, subcategoryKey) {
  const matchingCalcs = cluster.calculators.filter(c => c.subcategory === subcategoryKey);
  const subcatTitle = matchingCalcs[0]?.subcatTitle || (subcategoryKey.charAt(0).toUpperCase() + subcategoryKey.slice(1));

  const cardsHtml = matchingCalcs.map(c => \`
    <div class="cluster-card" style="padding: 1.5rem;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
        <span style="font-size: 1.75rem;">\${c.icon}</span>
        <span class="cluster-card-badge">\${c.badge}</span>
      </div>
      <h3 class="cluster-card-title" style="font-size: 1.15rem; margin-bottom: 0.4rem;">\${c.name}</h3>
      <p class="cluster-card-desc" style="margin-bottom: 1.25rem;">\${c.description}</p>
      <a href="\${c.url}" class="btn btn-primary btn-sm" style="margin-top: auto; width: 100%;">
        <span>Open Calculator →</span>
      </a>
    </div>
  \`).join("");

  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: cluster.title, link: cluster.url || ('/calculators/' + cluster.id + '/') },
    { name: subcatTitle, link: '/calculators/' + cluster.id + '/' + subcategoryKey + '/', current: true }
  ];

  updateSEO(
    \`\${subcatTitle} - \${cluster.title} | CalculatorBowl\`,
    \`Precision online calculators for \${subcatTitle.toLowerCase()} under \${cluster.title.toLowerCase()}. Calculate with instant formulas and step-by-step solutions.\`,
    {
      pageType: "cluster",
      canonicalPath: '/calculators/' + cluster.id + '/' + subcategoryKey + '/',
      cluster: cluster,
      breadcrumbs: breadcrumbs
    }
  );
  updateBreadcrumbs(breadcrumbs);
  updateActiveNav(cluster.canonicalId || cluster.id);

  container.innerHTML = \`
    <div style="margin-bottom: 2rem;">
      <span class="brand-badge" style="font-size: 0.8rem; margin-bottom: 0.5rem; display: inline-block;">Subcategory Hub</span>
      <h1 class="hero-title" style="font-size: 2.25rem; text-align: left; margin-bottom: 0.5rem;">
        \${cluster.icon} \${subcatTitle}
      </h1>
      <p class="hero-subtitle" style="text-align: left; margin: 0 0 1.5rem; max-width: 800px;">
        Explore all \${subcatTitle.toLowerCase()} tools and solvers under the \${cluster.title} category.
      </p>
    </div>

    <div class="clusters-grid">
      \${cardsHtml}
    </div>
  \`;
}

/* ==========================================================================
   View 3: Specific Calculator View (Calculator + Category Sidebar + Steps)
   ========================================================================== */
function renderCalculatorView(container, calc, cluster) {
  const relatedCalcs = getRelatedCalculators(cluster.id, calc.id);

  const relatedHtml = relatedCalcs.slice(0, 5).map(r => \`
    <li>
      <a href="\${r.url}" class="related-calc-link">
        <span>\${r.icon} \${r.shortName}</span>
        <span style="color: var(--text-muted);">→</span>
      </a>
    </li>
  \`).join("");

  const richContent = (typeof CALCULATOR_RICH_CONTENT !== "undefined" && CALCULATOR_RICH_CONTENT[calc.id]) 
    ? CALCULATOR_RICH_CONTENT[calc.id] 
    : null;

  const currentFaqs = (richContent && richContent.faqs) ? richContent.faqs : cluster.faqs;

  const faqsHtml = currentFaqs.map(faq => \`
    <div class="faq-item">
      <button type="button" class="faq-question" onclick="toggleFaq(this)">
        <span>\${faq.q}</span>
        <span>▼</span>
      </button>
      <div class="faq-answer">
        <p>\${faq.a}</p>
      </div>
    </div>
  \`).join("");

  container.innerHTML = \`
    <div class="calculator-layout">
      <div class="calculator-card-main">
        <div class="calc-header">
          <a href="\${cluster.url || ('/calculators/' + cluster.id + '/')}" class="calc-cluster-tag">
            <span>\${cluster.icon} \${cluster.title} › \${calc.subcatTitle || calc.subcategory}</span>
          </a>
          <h1 class="calc-title">\${calc.name}</h1>
          <p class="calc-summary">\${calc.description}</p>
        </div>

        <div id="dynamicCalculatorBody" class="calc-body">
          <!-- Populated by calculator script -->
        </div>
      </div>

      <aside class="cluster-sidebar">
        <div class="sidebar-widget">
          <h3 class="widget-title">📁 Calculator Category</h3>
          <a href="\${cluster.url || ('/calculators/' + cluster.id + '/')}" class="pillar-hub-badge">
            <span>\${cluster.icon} All \${cluster.shortTitle} Calculators</span>
            <span>View All →</span>
          </a>
          
          <h4 style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.6rem; letter-spacing: 0.05em;">
            Related in \${calc.subcatTitle || cluster.shortTitle}:
          </h4>
          <ul class="related-calcs-list">
            \${relatedHtml}
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
        \${richContent ? richContent.articleTitle : \`Complete Guide to \${calc.name}\`}
      </h2>

      \${richContent && richContent.diagramHtml ? richContent.diagramHtml : ''}

      <div class="seo-content-text" style="font-size: 0.96rem; line-height: 1.75; color: var(--text-secondary);">
        \${richContent ? richContent.articleHtml : \`
          <p>
            This calculator provides precision calculations using verified mathematical formulas and algorithmic principles. All equations are computed directly in your browser with zero latency.
          </p>
        \`}
      </div>

      \${calc.contextualGuide ? \`
        <div class="contextual-guide-card">
          <h3 class="contextual-guide-title">
            <span>🔗</span> \${calc.contextualGuide.title}
          </h3>
          <div class="contextual-guide-body">
            \${calc.contextualGuide.html}
          </div>
          \${calc.contextualGuide.suggestedLinks ? \`
            <div class="contextual-links-grid">
              \${calc.contextualGuide.suggestedLinks.map(link => {
                const targetCalc = getCalculatorById(link.id);
                const targetUrl = targetCalc ? targetCalc.url : ('/calculators/' + link.id + '/');
                return \`
                  <a href="\${targetUrl}" class="contextual-link-btn">
                    <span>\${link.icon}</span>
                    <span>\${link.label}</span>
                  </a>
                \`;
              }).join("")}
            </div>
          \` : ''}
        </div>
      \` : ''}

      <h3 style="font-family: var(--font-heading); font-size: 1.3rem; margin-top: 2rem; margin-bottom: 0.85rem; color: var(--text-primary);">
        Frequently Asked Questions (\${calc.shortName})
      </h3>
      <div class="faq-accordion">
        \${faqsHtml}
      </div>
    </section>
  \`;

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
      dropdown.innerHTML = \`
        <div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.88rem;">
          No calculators found matching "<b>\${e.target.value}</b>".
        </div>
      \`;
      dropdown.style.display = "block";
      return;
    }

    dropdown.innerHTML = matches.slice(0, 6).map(m => \`
      <div class="search-result-item" onclick="navigateTo('\${m.url}'); document.querySelectorAll('.search-results-dropdown, .mobile-search-results').forEach(d => d.style.display='none');">
        <div class="search-result-info">
          <div class="search-result-name">\${m.icon} \${m.name}</div>
          <div class="search-result-cluster">\${m.subcatTitle || m.clusterTitle} • \${m.badge}</div>
        </div>
        <span style="color: var(--accent-primary); font-size: 0.85rem;">Open →</span>
      </div>
    \`).join("");

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
   Dedicated View 4: Help Center & User Guide
   ========================================================================== */
function renderHelpView(container) {
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Help Center", link: "/help", current: true }
  ];
  updateSEO(
    "Help Center & How-To Guides | CalculatorBowl",
    "Complete documentation, calculation formulas, precision guarantees, keyboard shortcuts, and FAQs for using CalculatorBowl.",
    {
      pageType: "article",
      canonicalPath: "/help",
      breadcrumbs: breadcrumbs
    }
  );
  updateBreadcrumbs(breadcrumbs);

  container.innerHTML = \`
    <div class="calc-seo-content" style="max-width: 900px; margin: 0 auto;">
      <h1 class="hero-title" style="font-size: 2.25rem; margin-bottom: 0.75rem;">📚 Help Center &amp; User Manual</h1>
      <p class="hero-subtitle" style="margin-bottom: 2rem;">
        Welcome to the official CalculatorBowl Knowledgebase. Here you will find detailed guides on mathematical methods, keyboard shortcuts, numerical precision standards, and frequently asked questions.
      </p>

      <h2 style="font-family: var(--font-heading); font-size: 1.4rem; color: var(--text-primary); margin-top: 2rem;">⚡ Universal Keyboard Shortcuts</h2>
      <p style="color: var(--text-secondary); line-height: 1.6;">
        Every calculator is built with full hardware keyboard support for high-speed input:
      </p>
      <ul style="color: var(--text-secondary); line-height: 1.8; margin-left: 1.25rem;">
        <li><kbd style="padding: 2px 6px; background: var(--bg-subtle); border: 1px solid var(--border-color); border-radius: 4px;">Ctrl + K</kbd> or <kbd style="padding: 2px 6px; background: var(--bg-subtle); border: 1px solid var(--border-color); border-radius: 4px;">Cmd + K</kbd> — Open Instant Spotlight Search across all 37 calculators</li>
        <li><kbd style="padding: 2px 6px; background: var(--bg-subtle); border: 1px solid var(--border-color); border-radius: 4px;">Enter</kbd> — Calculate and trigger formula evaluation</li>
        <li><kbd style="padding: 2px 6px; background: var(--bg-subtle); border: 1px solid var(--border-color); border-radius: 4px;">Esc</kbd> — Clear input fields or dismiss search dropdowns</li>
      </ul>

      <h2 style="font-family: var(--font-heading); font-size: 1.4rem; color: var(--text-primary); margin-top: 2rem;">🔒 Privacy &amp; Client-Side Security</h2>
      <p style="color: var(--text-secondary); line-height: 1.6;">
        All calculations in CalculatorBowl are performed 100% locally inside your web browser. No personal financial values, loan balances, salary figures, or calculation parameters are transmitted to or stored on our servers.
      </p>

      <div style="margin-top: 2.5rem; text-align: center;">
        <a href="/calculators/" class="btn btn-primary">
          <span>Explore All 37 Calculators »</span>
        </a>
      </div>
    </div>
  \`;
}

function renderSuggestionsView(container) {
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Suggestions", link: "/suggestions", current: true }
  ];
  updateSEO(
    "Suggest a Calculator | CalculatorBowl",
    "Request new mathematical, financial, engineering, or conversion tools to be built by the CalculatorBowl team.",
    { pageType: "article", canonicalPath: "/suggestions", breadcrumbs: breadcrumbs }
  );
  updateBreadcrumbs(breadcrumbs);

  container.innerHTML = \`
    <div class="calc-seo-content" style="max-width: 750px; margin: 0 auto;">
      <h1 class="hero-title" style="font-size: 2.15rem; margin-bottom: 0.75rem;">💡 Suggest a New Calculator</h1>
      <p class="hero-subtitle" style="margin-bottom: 2rem;">
        Is there a specific formula, financial model, or conversion solver you'd like to see added to CalculatorBowl? Tell us below!
      </p>

      <form class="calc-body" style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl); padding: 2rem;" onsubmit="handleFeedbackSubmit(event)">
        <div class="form-group" style="margin-bottom: 1.25rem;">
          <label class="form-label">Calculator Name / Topic</label>
          <input type="text" class="form-control" placeholder="e.g., Solar ROI Calculator, Concrete Volume" required>
        </div>
        <div class="form-group" style="margin-bottom: 1.25rem;">
          <label class="form-label">Category</label>
          <select class="form-select">
            <option value="financial">Financial &amp; Loans</option>
            <option value="math">Math &amp; Fractions</option>
            <option value="conversions">Unit Conversions</option>
            <option value="datetime">Date &amp; Time</option>
            <option value="network">Tech &amp; Network</option>
          </select>
        </div>
        <div class="form-group" style="margin-bottom: 1.5rem;">
          <label class="form-label">Description &amp; Suggested Formulas</label>
          <textarea class="form-control" rows="4" placeholder="Describe the inputs, expected outputs, and mathematical formulas..."></textarea>
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%;">
          <span>Submit Calculator Proposal</span>
        </button>
      </form>
    </div>
  \`;
}

function renderContactView(container) {
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Contact", link: "/contact", current: true }
  ];
  updateSEO(
    "Contact & Support | CalculatorBowl",
    "Get in touch with the CalculatorBowl editorial, algorithmic, and engineering teams.",
    { pageType: "article", canonicalPath: "/contact", breadcrumbs: breadcrumbs }
  );
  updateBreadcrumbs(breadcrumbs);

  container.innerHTML = \`
    <div class="calc-seo-content" style="max-width: 750px; margin: 0 auto;">
      <h1 class="hero-title" style="font-size: 2.15rem; margin-bottom: 0.75rem;">📬 Contact CalculatorBowl</h1>
      <p class="hero-subtitle" style="margin-bottom: 2rem;">
        Have a question regarding our algorithms, advertising inquiries, bug reports, or partnership opportunities? Reach out to us.
      </p>

      <form class="calc-body" style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl); padding: 2rem;" onsubmit="handleFeedbackSubmit(event)">
        <div class="form-group" style="margin-bottom: 1.25rem;">
          <label class="form-label">Your Name</label>
          <input type="text" class="form-control" placeholder="John Doe" required>
        </div>
        <div class="form-group" style="margin-bottom: 1.25rem;">
          <label class="form-label">Email Address</label>
          <input type="email" class="form-control" placeholder="name@example.com" required>
        </div>
        <div class="form-group" style="margin-bottom: 1.5rem;">
          <label class="form-label">Message</label>
          <textarea class="form-control" rows="5" placeholder="How can we assist you today?" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%;">
          <span>Send Message</span>
        </button>
      </form>
    </div>
  \`;
}

function renderTermsView(container) {
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Terms of Service", link: "/terms", current: true }
  ];
  updateSEO(
    "Terms of Service | CalculatorBowl",
    "Terms and conditions for using the CalculatorBowl website and calculation tools.",
    { pageType: "article", canonicalPath: "/terms", breadcrumbs: breadcrumbs }
  );
  updateBreadcrumbs(breadcrumbs);

  container.innerHTML = \`
    <div class="calc-seo-content" style="max-width: 850px; margin: 0 auto;">
      <h1 class="hero-title" style="font-size: 2.15rem; margin-bottom: 0.75rem;">📜 Terms of Service</h1>
      <p class="hero-subtitle" style="margin-bottom: 2rem;">
        Last Updated: September 1, 2026. By accessing CalculatorBowl, you agree to the following terms.
      </p>

      <h3 style="font-family: var(--font-heading); font-size: 1.2rem;">1. Disclaimer of Warranty</h3>
      <p style="color: var(--text-secondary); line-height: 1.6;">
        All calculation tools, formulas, and estimates are provided for informational and educational purposes only. While we rigorously test all algorithms against standard mathematical benchmarks, CalculatorBowl makes no warranties regarding the accuracy or suitability for official financial, taxation, or engineering purposes.
      </p>

      <h3 style="font-family: var(--font-heading); font-size: 1.2rem;">2. Intellectual Property</h3>
      <p style="color: var(--text-secondary); line-height: 1.6;">
        The design, code, interactive engines, and educational articles on CalculatorBowl are protected under copyright law. Unauthorized scraping, reproduction, or redistribution is strictly prohibited.
      </p>
    </div>
  \`;
}

function renderPrivacyView(container) {
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Privacy Policy", link: "/privacy", current: true }
  ];
  updateSEO(
    "Privacy Policy | CalculatorBowl",
    "Privacy policy regarding user data handling and client-side processing on CalculatorBowl.",
    { pageType: "article", canonicalPath: "/privacy", breadcrumbs: breadcrumbs }
  );
  updateBreadcrumbs(breadcrumbs);

  container.innerHTML = \`
    <div class="calc-seo-content" style="max-width: 850px; margin: 0 auto;">
      <h1 class="hero-title" style="font-size: 2.15rem; margin-bottom: 0.75rem;">🔒 Privacy Policy</h1>
      <p class="hero-subtitle" style="margin-bottom: 2rem;">
        Your privacy is our priority. Learn how CalculatorBowl protects your calculation data.
      </p>

      <h3 style="font-family: var(--font-heading); font-size: 1.2rem;">1. 100% Client-Side Processing</h3>
      <p style="color: var(--text-secondary); line-height: 1.6;">
        All calculations are computed locally inside your browser engine. We never collect or transmit the numbers, financial assets, or parameters you input into any calculator.
      </p>

      <h3 style="font-family: var(--font-heading); font-size: 1.2rem;">2. Local Storage Usage</h3>
      <p style="color: var(--text-secondary); line-height: 1.6;">
        CalculatorBowl uses browser LocalStorage strictly for saving your UI theme preferences (Light/Dark mode) and handheld calculator history tape.
      </p>
    </div>
  \`;
}

/* ==========================================================================
   Dedicated View 5: Master Alphabetical Calculators List (A-Z Directory)
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
      return \`<button type="button" class="az-letter-btn active" onclick="scrollToLetter('\${letter}')">\${letter}</button>\`;
    }
    return \`<span class="az-letter-btn disabled">\${letter}</span>\`;
  }).join("");

  const letterSectionsHtml = alphabet.map(letter => {
    const items = grouped[letter] || [];
    if (items.length === 0) return "";

    const itemsHtml = items.map(c => \`
      <li class="az-calc-item" data-name="\${c.name.toLowerCase()}" data-desc="\${c.description.toLowerCase()}">
        <a href="\${c.url}">
          <span class="az-item-icon">\${c.icon}</span>
          <div class="az-item-info">
            <span class="az-item-title">\${c.name}</span>
            <span class="az-item-desc">\${c.description}</span>
          </div>
          <span class="az-item-badge">\${c.subcatTitle || c.clusterTitle}</span>
        </a>
      </li>
    \`).join("");

    return \`
      <section class="az-letter-group" id="letter-\${letter}">
        <div class="az-letter-header">
          <span class="az-letter-badge">\${letter}</span>
          <span class="az-count-badge">\${items.length} Calculators</span>
        </div>
        <ul class="az-items-list">
          \${itemsHtml}
        </ul>
      </section>
    \`;
  }).join("");

  container.innerHTML = \`
    <div class="calc-seo-content" style="max-width: 1050px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 2rem;">
        <span class="brand-badge" style="margin-bottom: 0.5rem; display: inline-block;">📚 Master Directory</span>
        <h1 class="hero-title" style="font-size: 2.35rem; margin-bottom: 0.5rem;">
          All <span class="gradient-text">Calculators</span> (A-Z)
        </h1>
        <p class="hero-subtitle" style="max-width: 680px; margin: 0 auto;">
          Browse our complete catalog of precision calculation tools. Filter by name or jump directly to any letter.
        </p>

        <div style="max-width: 500px; margin: 1.5rem auto 0; position: relative;">
          <input 
            type="text" 
            id="azFilterInput" 
            placeholder="🔍 Type to filter calculators instantly..." 
            oninput="window.filterAzCatalog(this.value)"
            class="form-control" 
            style="padding-left: 2.5rem; font-size: 0.95rem; border-radius: var(--radius-lg); background: var(--bg-surface);"
          />
          <span style="position: absolute; left: 0.9rem; top: 50%; transform: translateY(-50%); opacity: 0.6; pointer-events: none;">🔍</span>
        </div>
      </div>

      <nav class="az-index-bar" aria-label="Alphabetical Jump Navigation" style="display: flex; flex-wrap: wrap; gap: 0.35rem; justify-content: center; margin-bottom: 2rem;">
        \${azBarHtml}
      </nav>

      <div id="azListContainer">
        \${letterSectionsHtml}
      </div>
      
      <div id="azNoResults" style="display: none; padding: 3rem 1.5rem; text-align: center; background: var(--bg-subtle); border-radius: var(--radius-lg); border: 1.5px dashed var(--border-color); margin-top: 1rem;">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
        <h3 style="margin: 0 0 0.5rem; color: var(--text-primary);">No calculators found</h3>
        <p style="margin: 0; color: var(--text-secondary); font-size: 0.95rem;">Try searching for a different keyword or press <kbd style="padding: 2px 6px; background: var(--bg-surface); border-radius: 4px; border: 1px solid var(--border-color); font-family: var(--font-mono);">Ctrl + K</kbd> for the universal spotlight.</p>
      </div>
    </div>
  \`;
}

window.filterAzCatalog = function(query) {
  const cleanQuery = (query || "").trim().toLowerCase();
  const groups = document.querySelectorAll(".az-letter-group");
  let totalVisible = 0;

  groups.forEach(group => {
    const items = group.querySelectorAll(".az-calc-item");
    let groupVisibleCount = 0;

    items.forEach(item => {
      const name = item.getAttribute("data-name") || "";
      const desc = item.getAttribute("data-desc") || "";
      if (!cleanQuery || name.includes(cleanQuery) || desc.includes(cleanQuery)) {
        item.style.display = "";
        groupVisibleCount++;
      } else {
        item.style.display = "none";
      }
    });

    if (groupVisibleCount > 0) {
      group.style.display = "";
      totalVisible += groupVisibleCount;
    } else {
      group.style.display = "none";
    }
  });

  const noResults = document.getElementById("azNoResults");
  if (noResults) {
    noResults.style.display = totalVisible === 0 ? "block" : "none";
  }
};

window.scrollToLetter = function(letter) {
  const el = document.getElementById(\`letter-\${letter}\`);
  if (el) {
    const yOffset = -90;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
};

window.handleFeedbackSubmit = function(event) {
  event.preventDefault();
  const form = event.target;
  form.innerHTML = \`
    <div style="padding: 2rem 1.5rem; background: rgba(16, 185, 129, 0.08); border: 1.5px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-xl); text-align: center; color: #059669;">
      <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🎉</div>
      <h3 style="color: #059669; margin: 0 0 0.5rem; font-family: var(--font-heading);">Message Successfully Received!</h3>
      <p style="margin: 0; font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6;">
        Thank you for contributing to CalculatorBowl. Our engineering team reviews all user proposals, algorithm suggestions, and feedback regularly.
      </p>
    </div>
  \`;
};
`;

fs.writeFileSync(appJsPath, appJsContent, 'utf8');
console.log('✅ js/app.js successfully rewritten with complete hierarchical router!');
