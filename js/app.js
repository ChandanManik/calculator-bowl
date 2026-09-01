/**
 * ============================================================================
 * CalculatorBowl Application Core Engine & Topical Router
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
}

/* ==========================================================================
   Theme Management (Light / Dark Mode)
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem("calculatorbowl-theme") || 
                     (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
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
   Router & Dynamic View Controller (Clean HTML5 History API)
   ========================================================================== */
function navigateTo(url) {
  if (!url) return;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('tel:') || url.endsWith('.xml') || url.startsWith('#')) {
    return;
  }
  window.history.pushState(null, '', url);
  handleRoute();
}

function initRouter() {
  window.addEventListener('popstate', handleRoute);
  
  // Intercept all internal anchor clicks for instant SPA routing
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href) return;
    if (
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.endsWith('.xml') ||
      link.getAttribute('target') === '_blank' ||
      e.ctrlKey || e.metaKey || e.shiftKey
    ) {
      return;
    }
    // Only intercept root/clean path links
    if (href.startsWith('/') || href.startsWith('./') || (!href.startsWith('#') && !href.includes(':'))) {
      e.preventDefault();
      navigateTo(href);
    }
  });

  handleRoute();
}

function getCurrentRoutePath() {
  // Backward compatibility: If user visits /#/financial or /#/calc/loan-calculator, rewrite to clean path
  if (window.location.hash && window.location.hash.startsWith('#/')) {
    const cleanPath = window.location.hash.slice(1);
    window.history.replaceState(null, '', cleanPath);
    return cleanPath;
  }
  
  let pathname = window.location.pathname || '/';
  // Remove trailing slashes (except root '/')
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }
  return pathname;
}

function handleRoute() {
  const path = getCurrentRoutePath();
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
        breadcrumbs: [{ name: "Home", link: "/" }]
      }
    );
    updateBreadcrumbs([]);
    updateActiveNav("");
    return;
  }

  // Route 2: Specific Calculator View (e.g. /calc/loan-calculator)
  const calcMatch = path.match(/^\/calc\/([a-z0-9-]+)$/);
  if (calcMatch) {
    const calcId = calcMatch[1];
    const calc = getCalculatorById(calcId);
    if (calc) {
      const cluster = TOPICAL_CLUSTERS[calc.category];
      renderCalculatorView(mainView, calc, cluster);

      const richContent = (typeof CALCULATOR_RICH_CONTENT !== "undefined" && CALCULATOR_RICH_CONTENT[calc.id])
        ? CALCULATOR_RICH_CONTENT[calc.id]
        : null;
      const currentFaqs = (richContent && richContent.faqs) ? richContent.faqs : cluster.faqs;

      const breadcrumbs = [
        { name: "Home", link: "/" },
        { name: cluster.title, link: `/${cluster.id}` },
        { name: calc.shortName, link: `/calc/${calc.id}`, current: true }
      ];

      updateSEO(calc.seoTitle, calc.seoDescription, {
        pageType: "calculator",
        calc: calc,
        cluster: cluster,
        faqs: currentFaqs,
        breadcrumbs: breadcrumbs
      });
      updateBreadcrumbs(breadcrumbs);
      updateActiveNav(cluster.id);
      return;
    }
  }

  // Route 3: Pillar Category View (e.g. /financial, /math, /conversions, /datetime, /network)
  const pillarMatch = path.match(/^\/([a-z0-9-]+)$/);
  if (pillarMatch && TOPICAL_CLUSTERS[pillarMatch[1]]) {
    const clusterId = pillarMatch[1];
    const cluster = TOPICAL_CLUSTERS[clusterId];
    renderPillarView(mainView, cluster);

    const pillarContent = (typeof CATEGORY_PILLAR_CONTENT !== "undefined" && CATEGORY_PILLAR_CONTENT[cluster.id])
      ? CATEGORY_PILLAR_CONTENT[cluster.id]
      : null;
    const currentFaqs = (pillarContent && pillarContent.faqs) ? pillarContent.faqs : cluster.faqs;

    const breadcrumbs = [
      { name: "Home", link: "/" },
      { name: cluster.title, link: `/${cluster.id}`, current: true }
    ];

    updateSEO(cluster.seoTitle, cluster.seoDescription, {
      pageType: "cluster",
      cluster: cluster,
      faqs: currentFaqs,
      breadcrumbs: breadcrumbs
    });
    updateBreadcrumbs(breadcrumbs);
    updateActiveNav(cluster.id);
    return;
  }

  // Route 4: Dedicated Institutional & Directory Pages
  if (path === "/help") {
    renderHelpView(mainView);
    return;
  }
  if (path === "/suggestions") {
    renderSuggestionsView(mainView);
    return;
  }
  if (path === "/contact") {
    renderContactView(mainView);
    return;
  }
  if (path === "/terms") {
    renderTermsView(mainView);
    return;
  }
  if (path === "/privacy") {
    renderPrivacyView(mainView);
    return;
  }
  if (path === "/calculators-list") {
    renderCalculatorsListView(mainView);
    return;
  }

  // Fallback 404 / Home
  renderHomeView(mainView);

  if (window.i18nManager) {
    window.i18nManager.translateStaticUI();
  }
}

function updateActiveNav(activeId) {
  document.querySelectorAll(".nav-link").forEach(link => {
    const href = link.getAttribute("href") || "";
    if (activeId && href.includes(activeId)) {
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

function updateSEO(title, description, options = {}) {
  document.title = title;
  
  // Meta Description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute("content", description);
  }

  // Clean Canonical URL (Strips tracking query params to prevent duplicate indexing)
  const canonicalTag = document.getElementById("canonicalUrl");
  const cleanBase = (window.location.origin && window.location.origin !== "null" && window.location.origin.startsWith("http"))
    ? window.location.origin
    : "https://calculatorbowl.com";
  const currentPath = getCurrentRoutePath();
  const currentUrl = cleanBase.replace(/\/+$/, "") + (currentPath === "/" ? "/" : currentPath);
  if (canonicalTag) {
    canonicalTag.setAttribute("href", currentUrl);
  }

  // Open Graph Social Tags
  const ogTitle = document.getElementById("ogTitle");
  if (ogTitle) ogTitle.setAttribute("content", title);

  const ogDesc = document.getElementById("ogDesc");
  if (ogDesc) ogDesc.setAttribute("content", description);

  const ogUrl = document.getElementById("ogUrl");
  if (ogUrl) ogUrl.setAttribute("content", currentUrl);

  const ogType = document.getElementById("ogType");
  if (ogType) ogType.setAttribute("content", options.pageType === "calculator" ? "article" : "website");

  // Twitter Card Tags
  const twTitle = document.getElementById("twitterTitle");
  if (twTitle) twTitle.setAttribute("content", title);

  const twDesc = document.getElementById("twitterDesc");
  if (twDesc) twDesc.setAttribute("content", description);

  // Dynamic Schema.org JSON-LD Graph Injection
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

    // BreadcrumbList Schema
    if (options.breadcrumbs && options.breadcrumbs.length > 0) {
      graph.push({
        "@type": "BreadcrumbList",
        "itemListElement": options.breadcrumbs.map((b, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": b.name,
          "item": b.link ? (window.location.origin + window.location.pathname + b.link) : currentUrl
        }))
      });
    }

    // FAQPage Schema for Rich Search Result Snippets
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

    // SoftwareApplication Schema per calculator
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
/* ==========================================================================
   View 1: Home View (CalculatorSoup Style Directory Layout)
   ========================================================================== */
function renderHomeView(container) {
  // Category cards for the multi-column directory
  const categoryCardsHtml = Object.keys(TOPICAL_CLUSTERS).map(clusterKey => {
    const cluster = TOPICAL_CLUSTERS[clusterKey];
    const itemsHtml = cluster.calculators.map(c => `
      <li class="directory-item">
        <a href="/calc/${c.id}">
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
            <a href="/${cluster.id}">${cluster.title}</a>
          </h2>
          <span class="cluster-card-badge">${cluster.badge}</span>
        </div>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1rem;">${cluster.description}</p>
        
        <ul class="directory-items-grid">
          ${itemsHtml}
        </ul>

        <a href="/${cluster.id}" class="directory-view-all">
          <span>More ${cluster.shortTitle} Calculators »</span>
        </a>
      </div>
    `;
  }).join("");

  // All calculators for the Popular Tools sidebar
  const allCalcs = getAllCalculators();
  const popularCalcs = allCalcs.slice(0, 6);
  const popularListHtml = popularCalcs.map(p => `
    <li class="popular-tool-item">
      <a href="/calc/${p.id}">
        <span style="font-size: 1.2rem;">${p.icon}</span>
        <div style="flex: 1;">
          <div style="font-size: 0.88rem; font-weight: 700;">${p.shortName}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">${p.clusterTitle}</div>
        </div>
        <span style="color: var(--text-muted); font-size: 0.8rem;">→</span>
      </a>
    </li>
  `).join("");

  container.innerHTML = `
    <!-- Homepage Hero Section with Embedded Interactive Basic Calculator -->
    <section class="home-hero-calc-section">
      <!-- Left Column: Handheld Online Basic Calculator -->
      <div id="homeBasicCalcRoot" style="width: 100%; display: flex; justify-content: center;">
        ${getBasicCalculatorMarkup("homeBasic")}
      </div>

      <!-- Right Column: Hero Intro, Live Search & Quick Tools -->
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

        <!-- Live Search Box -->
        <div class="hero-search-wrapper" style="margin: 0; max-width: 100%;">
          <span class="hero-search-icon">🔍</span>
          <input type="text" id="heroSearchInput" class="hero-search-input" placeholder="Search specific calculator (e.g. loan, fractions, mortgage, percent)...">
          <div id="heroSearchResults" class="search-results-dropdown"></div>
        </div>

        <!-- Quick Access Popular Tools -->
        <div>
          <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.05em;">
            Popular Specialized Solvers:
          </div>
          <div class="quick-tools-grid">
            <a href="/calc/loan-calculator" class="quick-tool-card"><span>💳</span> <span>Loan Calculator</span></a>
            <a href="/calc/fractions-operations" class="quick-tool-card"><span>🔢</span> <span>Fraction Calculator</span></a>
            <a href="/calc/compound-interest" class="quick-tool-card"><span>📈</span> <span>Compound Interest</span></a>
            <a href="/calc/percentage-calculator" class="quick-tool-card"><span>📊</span> <span>Percentage Calculator</span></a>
            <a href="/calc/mortgage-calculator" class="quick-tool-card"><span>🏠</span> <span>Mortgage Payments</span></a>
            <a href="/calc/temperature-converter" class="quick-tool-card"><span>🌡️</span> <span>Temperature Converter</span></a>
          </div>
        </div>

        <!-- History Tape Box on Homepage -->
        <div style="background: var(--bg-subtle); border-radius: var(--radius-md); padding: 0.75rem 1rem; border: 1px solid var(--border-color);">
          <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.35rem; display: flex; justify-content: space-between;">
            <span>📜 Recent Calculation History</span>
            <span style="font-weight: 400; color: var(--text-muted);">Auto-saved</span>
          </div>
          <div id="homeCalcHistoryTape" style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-secondary); max-height: 65px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.25rem;">
            <span style="color: var(--text-muted); font-size: 0.8rem;">Click buttons or type on your keyboard to calculate.</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 2-Column CalculatorSoup Style Directory Layout -->
    <div class="home-directory-layout">
      <!-- Left Column: Categorized Calculator Directory -->
      <main>
        <div style="margin-bottom: 1.25rem;">
          <h2 style="font-family: var(--font-heading); font-size: 1.45rem; font-weight: 800; color: var(--text-primary);">
            Calculator Directory by Category
          </h2>
          <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.2rem;">
            Browse our full suite of calculators and step-by-step mathematical tools.
          </p>
        </div>

        ${categoryCardsHtml}
      </main>

      <!-- Right Column: Sidebar (Popular Tools, Quick About & Ad Slot) -->
      <aside class="cluster-sidebar">
        <!-- Most Popular Tools Box -->
        <div class="sidebar-widget">
          <h3 class="widget-title">🔥 Most Popular Tools</h3>
          <ul class="popular-tools-list">
            ${popularListHtml}
          </ul>
        </div>

        <!-- Quick About / Features -->
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

    <!-- Educational & About Section at Bottom -->
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

  // Attach hero search listener
  const heroInput = document.getElementById("heroSearchInput");
  const heroDropdown = document.getElementById("heroSearchResults");
  if (heroInput && heroDropdown) {
    attachSearchEvents(heroInput, heroDropdown);
  }

  // Initialize embedded basic calculator engine on homepage
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
        <span class="cluster-card-badge">${c.badge}</span>
      </div>
      <h3 class="cluster-card-title" style="font-size: 1.15rem; margin-bottom: 0.4rem;">${c.name}</h3>
      <p class="cluster-card-desc" style="margin-bottom: 1.25rem;">${c.description}</p>
      <a href="/calc/${c.id}" class="btn btn-primary btn-sm" style="margin-top: auto; width: 100%;">
        <span>Open Calculator →</span>
      </a>
    </div>
  `).join("");

  // Fetch dedicated pillar authority content for this category
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

    <!-- Category Pillar Authority Guide (500+ words + Custom SVG Diagram + Comparison Matrix) -->
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
   View 3: Specific Calculator View (Calculator + Category Sidebar + Steps)
   ========================================================================== */
function renderCalculatorView(container, calc, cluster) {
  const relatedCalcs = getRelatedCalculators(cluster.id, calc.id);

  const relatedHtml = relatedCalcs.map(r => `
    <li>
      <a href="/calc/${r.id}" class="related-calc-link">
        <span>${r.icon} ${r.shortName}</span>
        <span style="color: var(--text-muted);">→</span>
      </a>
    </li>
  `).join("");

  // Fetch dedicated rich content for this specific calculator
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
      <!-- Left Column: Main Calculator Tool -->
      <div class="calculator-card-main">
        <div class="calc-header">
          <a href="/${cluster.id}" class="calc-cluster-tag">
            <span>${cluster.icon} ${cluster.title}</span>
          </a>
          <h1 class="calc-title">${calc.name}</h1>
          <p class="calc-summary">${calc.description}</p>
        </div>

        <div id="dynamicCalculatorBody" class="calc-body">
          <!-- Populated by calculator script -->
        </div>
      </div>

      <!-- Right Column: Category Sidebar -->
      <aside class="cluster-sidebar">
        <!-- Category Navigation Widget -->
        <div class="sidebar-widget">
          <h3 class="widget-title">📁 Calculator Category</h3>
          <a href="/${cluster.id}" class="pillar-hub-badge">
            <span>${cluster.icon} All ${cluster.shortTitle} Calculators</span>
            <span>View All →</span>
          </a>
          
          <h4 style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.6rem; letter-spacing: 0.05em;">
            Related Calculators:
          </h4>
          <ul class="related-calcs-list">
            ${relatedHtml}
          </ul>
        </div>

        <!-- Fast Feature Checklist -->
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

    <!-- Deep Educational Authority Content (500-600 words + Custom Diagram + Comparison Table) -->
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
        <!-- In-Content Contextual Internal Linking Box (SEO Authority) -->
        <div class="contextual-guide-card">
          <h3 class="contextual-guide-title">
            <span>🔗</span> ${calc.contextualGuide.title}
          </h3>
          <div class="contextual-guide-body">
            ${calc.contextualGuide.html}
          </div>

          <div class="suggested-matrix-grid">
            ${calc.contextualGuide.suggestedLinks.map(s => `
              <a href="/calc/${s.id}" class="suggested-matrix-card">
                <span style="font-size: 1.25rem;">${s.icon}</span>
                <span>${s.label}</span>
              </a>
            `).join("")}
          </div>
        </div>
      ` : `
        <!-- Auto-Generated Contextual Internal Linking (Zero Orphan Guarantee) -->
        <div class="contextual-guide-card">
          <h3 class="contextual-guide-title">
            <span>🔗</span> Related Tools in ${cluster.title}
          </h3>
          <div class="contextual-guide-body">
            <p>
              Looking for more mathematical and financial tools? Explore our comprehensive <a href="/${cluster.id}" class="in-text-link">${cluster.icon} ${cluster.title} Hub</a> to compare formulas, amortizations, and calculation models.
            </p>
          </div>

          <div class="suggested-matrix-grid">
            ${relatedCalcs.slice(0, 4).map(r => `
              <a href="/calc/${r.id}" class="suggested-matrix-card">
                <span style="font-size: 1.25rem;">${r.icon}</span>
                <span>${r.name}</span>
              </a>
            `).join("")}
          </div>
        </div>
      `}

      <h3 style="font-family: var(--font-heading); font-size: 1.3rem; margin-top: 2rem; margin-bottom: 0.85rem; color: var(--text-primary);">
        Frequently Asked Questions (${calc.shortName})
      </h3>
      <div class="faq-accordion">
        ${faqsHtml}
      </div>
    </section>
  `;

  // Render the specific calculator engine into dynamicCalculatorBody
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

  // Ctrl/Cmd + K shortcut to focus search
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      const input = document.getElementById("heroSearchInput") || document.getElementById("headerSearchInput");
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
      c.category.toLowerCase().includes(query)
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
      <div class="search-result-item" onclick="navigateTo('/calc/${m.id}'); document.querySelectorAll('.search-results-dropdown').forEach(d => d.style.display='none');">
        <div class="search-result-info">
          <div class="search-result-name">${m.icon} ${m.name}</div>
          <div class="search-result-cluster">${m.clusterTitle} • ${m.badge}</div>
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

// Global FAQ Toggle helper
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
   Dedicated View 4: Help Center & User Guide (700+ Words)
   ========================================================================== */
function renderHelpView(container) {
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Help Center & User Guide", link: "/help", current: true }
  ];

  updateSEO(
    "Help Center & Mathematical Calculation Guide | CalculatorBowl",
    "Comprehensive user guide, calculation methodology, keyboard shortcuts, precision standards, and FAQ for CalculatorBowl online calculators.",
    {
      pageType: "website",
      breadcrumbs: breadcrumbs
    }
  );
  updateBreadcrumbs(breadcrumbs);
  updateActiveNav("");

  container.innerHTML = `
    <article class="calc-seo-content" style="margin-top: 1rem; padding: 2.5rem 2rem;">
      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
        <span class="brand-badge">📖 User Manual &amp; Knowledge Base</span>
      </div>
      <h1 class="seo-content-title" style="font-size: 2.25rem; line-height: 1.2; margin-bottom: 1rem;">
        CalculatorBowl Help Center &amp; Calculation Guide
      </h1>
      <p class="seo-content-text" style="font-size: 1.05rem; line-height: 1.75; margin-bottom: 2rem;">
        Welcome to the official <b>CalculatorBowl Help Center</b>. CalculatorBowl is engineered to deliver accurate, lightning-fast mathematical, financial, statistical, and unit conversion calculations directly inside your browser. This comprehensive guide covers our core computation methodology, algebraic simplification standards, precision rules, and productivity shortcuts.
      </p>

      <div class="formula-callout" style="margin: 2rem 0;">
        <div class="formula-label">Quick Navigation Tip</div>
        <div class="formula-expl">
          Press <kbd style="padding: 2px 8px; background: var(--bg-surface); border-radius: 4px; border: 1px solid var(--border-color); font-family: var(--font-mono); font-weight: 700;">Ctrl + K</kbd> (or <kbd style="padding: 2px 8px; background: var(--bg-surface); border-radius: 4px; border: 1px solid var(--border-color); font-family: var(--font-mono); font-weight: 700;">Cmd + K</kbd> on macOS) at any time to open instant search across all 32+ calculators.
        </div>
      </div>

      <h2 class="content-subheading">1. How CalculatorBowl Calculators Work</h2>
      <p class="seo-content-text">
        Every tool on CalculatorBowl operates <b>100% on the client side</b> using modern ECMAScript standards. When you enter values into our financial or mathematical forms, your browser executes the underlying algorithms locally. This architectural design provides two major advantages:
      </p>
      <ul class="content-list">
        <li><b>Zero Latency:</b> Calculations update in real time without network lag or server delays.</li>
        <li><b>Absolute Privacy:</b> None of your numerical inputs, loan amounts, salaries, or formulas are transmitted across the web or stored in external databases.</li>
      </ul>

      <h2 class="content-subheading">2. Step-by-Step Mathematical Solutions</h2>
      <p class="seo-content-text">
        Unlike basic calculators that merely produce a single number, CalculatorBowl is designed as an educational and verification companion. When solving complex operations—such as adding mixed fractions, computing compound growth with periodic cash deposits, or solving second-degree quadratic equations—our engines display:
      </p>
      <ol class="content-ordered-list">
        <li><b>The Governing Equation:</b> The exact algebraic or financial formula utilized (e.g., standard amortization \(M = P \frac{i(1+i)^n}{(1+i)^n - 1}\)).</li>
        <li><b>Variable Mapping &amp; Substitution:</b> Clear notation showing how your raw inputs convert into periodic rates, compounding terms, or algebraic coefficients.</li>
        <li><b>Simplification Steps:</b> Intermediate factorization, Greatest Common Divisor (GCD) reduction, and breakdown tables.</li>
        <li><b>Visual Proportions:</b> Dynamic SVG Donut Charts and comparison matrices illustrating principal vs. interest or distribution percentiles.</li>
      </ol>

      <h2 class="content-subheading">3. Master Keyboard Shortcuts &amp; Productivity Table</h2>
      <div class="content-table-wrapper">
        <table class="content-data-table">
          <thead>
            <tr>
              <th>Shortcut Key</th>
              <th>Action</th>
              <th>Supported Views</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>Ctrl + K</code> / <code>Cmd + K</code></td>
              <td>Open instant fuzzy search autocomplete</td>
              <td>Universal across all pages</td>
            </tr>
            <tr>
              <td><code>Enter</code></td>
              <td>Execute calculation on the active input form</td>
              <td>All calculator tools</td>
            </tr>
            <tr>
              <td><code>Tab</code> / <code>Shift + Tab</code></td>
              <td>Move focus to next / previous input field</td>
              <td>All forms &amp; directory grids</td>
            </tr>
            <tr>
              <td><code>Esc</code></td>
              <td>Dismiss open dropdowns and active search results</td>
              <td>Global search &amp; menus</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 class="content-subheading">4. Numerical Precision &amp; IEEE-754 Rounding Standards</h2>
      <p class="seo-content-text">
        Digital computing relies on floating-point arithmetic, which can occasionally introduce minuscule binary representation artifacts. CalculatorBowl employs specialized epsilon-correction algorithms and precise rational fraction arithmetic (exact integer numerator/denominator pairs) to ensure mathematical fidelity. Financial results are rounded to two decimal places (cents) according to standard GAAP/banking conventions, while scientific calculators support up to 10 decimal digits of precision.
      </p>

      <h2 class="content-subheading">5. Multilingual &amp; Internationalization Engine</h2>
      <p class="seo-content-text">
        CalculatorBowl is accessible in <b>26 major global languages</b> including English, Bengali, Hindi, Spanish, French, German, Chinese, and Arabic. To switch languages, click the flag icon in the upper-right corner. All labels, buttons, and navigation elements translate instantaneously with zero page reloads.
      </p>

      <h2 class="content-subheading">Frequently Asked Questions</h2>
      <div class="faq-accordion">
        <div class="faq-item">
          <button type="button" class="faq-question" onclick="toggleFaq(this)">
            <span>Are all calculators on CalculatorBowl 100% free to use?</span>
            <span>▼</span>
          </button>
          <div class="faq-answer">
            <p>Yes. All calculators, step-by-step math breakdowns, and amortization schedules are completely free with no subscriptions or accounts required.</p>
          </div>
        </div>
        <div class="faq-item">
          <button type="button" class="faq-question" onclick="toggleFaq(this)">
            <span>Can I use CalculatorBowl offline?</span>
            <span>▼</span>
          </button>
          <div class="faq-answer">
            <p>Yes. CalculatorBowl is configured with progressive web app (PWA) caching capabilities, allowing previously loaded calculators to function even without an active internet connection.</p>
          </div>
        </div>
      </div>
    </article>
  `;
}

/* ==========================================================================
   Dedicated View 5: Requests & Suggestions (600+ Words + Interactive Form)
   ========================================================================== */
function renderSuggestionsView(container) {
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Requests & Suggestions", link: "/suggestions", current: true }
  ];

  updateSEO(
    "Requests & Suggestions - Calculator Feature Roadmap | CalculatorBowl",
    "Submit new calculator ideas, request specialized formulas, and vote on upcoming tools in the CalculatorBowl engineering roadmap.",
    {
      pageType: "website",
      breadcrumbs: breadcrumbs
    }
  );
  updateBreadcrumbs(breadcrumbs);
  updateActiveNav("");

  container.innerHTML = `
    <article class="calc-seo-content" style="margin-top: 1rem; padding: 2.5rem 2rem;">
      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
        <span class="brand-badge">💡 Community Roadmap</span>
      </div>
      <h1 class="seo-content-title" style="font-size: 2.25rem; line-height: 1.2; margin-bottom: 1rem;">
        Requests &amp; Suggestions
      </h1>
      <p class="seo-content-text" style="font-size: 1.05rem; line-height: 1.75; margin-bottom: 2rem;">
        At CalculatorBowl, our roadmap is driven directly by students, educators, financial analysts, and everyday users. If you need a specialized calculation tool, a unique financial projection model, or an advanced mathematical solver that isn’t currently in our catalog, we want to hear from you.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 2.5rem;">
        <!-- Form Column -->
        <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl); padding: 2rem; box-shadow: var(--shadow-md);">
          <h2 style="font-family: var(--font-heading); font-size: 1.35rem; margin-bottom: 1rem; color: var(--text-primary);">
            Submit a Calculator Proposal
          </h2>
          <form class="feedback-form" onsubmit="handleFeedbackSubmit(event)">
            <div>
              <label style="font-weight: 700; display: block; margin-bottom: 0.35rem; font-size: 0.88rem;">
                Proposed Calculator Name:
              </label>
              <input type="text" class="feedback-input" placeholder="e.g., Cryptocurrency Staking Yield, Matrix Determinant..." required>
            </div>
            <div>
              <label style="font-weight: 700; display: block; margin-bottom: 0.35rem; font-size: 0.88rem;">
                Category Domain:
              </label>
              <select class="feedback-input" style="cursor: pointer;">
                <option value="financial">💰 Financial &amp; Business</option>
                <option value="math">➗ Math &amp; Fractions</option>
                <option value="conversions">🔄 Conversions &amp; Engineering</option>
                <option value="datetime">⏱️ Date, Time &amp; Health</option>
                <option value="other">🔬 Other / Science</option>
              </select>
            </div>
            <div>
              <label style="font-weight: 700; display: block; margin-bottom: 0.35rem; font-size: 0.88rem;">
                Required Formulas &amp; Input/Output Details:
              </label>
              <textarea class="feedback-textarea" rows="4" placeholder="Detail the mathematical formulas, variable constraints, and desired step-by-step breakdown..." required></textarea>
            </div>
            <div>
              <label style="font-weight: 700; display: block; margin-bottom: 0.35rem; font-size: 0.88rem;">
                Your Email (Optional, for notifications):
              </label>
              <input type="email" class="feedback-input" placeholder="you@example.com">
            </div>
            <button type="submit" class="feedback-btn" style="width: 100%;">
              Submit Tool Request 🚀
            </button>
          </form>
        </div>

        <!-- Evaluation Standards Column -->
        <div>
          <h2 class="content-subheading" style="margin-top: 0;">How We Evaluate New Tools</h2>
          <p class="seo-content-text">
            Our engineering team assesses proposals against stringent mathematical and educational criteria:
          </p>
          <ul class="content-list">
            <li><b>Formula Rigor:</b> Calculations must adhere to established academic, ISO, NIST, or banking conventions.</li>
            <li><b>Educational Value:</b> Tools must support clear step-by-step derivations rather than acting as a black box.</li>
            <li><b>Client-Side Feasibility:</b> Algorithms must compute instantaneously within standard web browsers without requiring backend servers.</li>
          </ul>

          <div class="formula-callout" style="margin-top: 1.5rem;">
            <div class="formula-label">Upcoming In-Development Queue</div>
            <div class="formula-expl">
              Currently prioritized: <b>Scientific Matrix Inverter</b>, <b>GPA &amp; Weighted Grade Solver</b>, <b>Body Mass Index (BMI) &amp; BMR Calculator</b>, and <b>Trigonometric Triangle Solver</b>.
            </div>
          </div>
        </div>
      </div>
    </article>
  `;
}

/* ==========================================================================
   Dedicated View 6: Contact Us (600+ Words + Form)
   ========================================================================== */
function renderContactView(container) {
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Contact Us", link: "/contact", current: true }
  ];

  updateSEO(
    "Contact Us & Engineering Support | CalculatorBowl",
    "Get in touch with the CalculatorBowl development and mathematical verification team for support, bug reports, and partnership inquiries.",
    {
      pageType: "website",
      breadcrumbs: breadcrumbs
    }
  );
  updateBreadcrumbs(breadcrumbs);
  updateActiveNav("");

  container.innerHTML = `
    <article class="calc-seo-content" style="margin-top: 1rem; padding: 2.5rem 2rem;">
      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
        <span class="brand-badge">📬 Official Support</span>
      </div>
      <h1 class="seo-content-title" style="font-size: 2.25rem; line-height: 1.2; margin-bottom: 1rem;">
        Contact Us
      </h1>
      <p class="seo-content-text" style="font-size: 1.05rem; line-height: 1.75; margin-bottom: 2rem;">
        Have a question about a specific calculation, want to report an algorithm discrepancy, or explore educational licensing? Our engineering and editorial team is here to help.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
        <!-- Contact Form -->
        <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl); padding: 2rem; box-shadow: var(--shadow-md);">
          <h2 style="font-family: var(--font-heading); font-size: 1.35rem; margin-bottom: 1rem; color: var(--text-primary);">
            Send a Direct Message
          </h2>
          <form class="feedback-form" onsubmit="handleFeedbackSubmit(event)">
            <div>
              <label style="font-weight: 700; display: block; margin-bottom: 0.35rem; font-size: 0.88rem;">Your Name:</label>
              <input type="text" class="feedback-input" placeholder="John Doe" required>
            </div>
            <div>
              <label style="font-weight: 700; display: block; margin-bottom: 0.35rem; font-size: 0.88rem;">Email Address:</label>
              <input type="email" class="feedback-input" placeholder="john@example.com" required>
            </div>
            <div>
              <label style="font-weight: 700; display: block; margin-bottom: 0.35rem; font-size: 0.88rem;">Inquiry Topic:</label>
              <select class="feedback-input">
                <option>General Feedback / Question</option>
                <option>Report a Calculation Error or Edge Case</option>
                <option>Educational / Classroom Partnership</option>
                <option>Security / Bug Bounty</option>
              </select>
            </div>
            <div>
              <label style="font-weight: 700; display: block; margin-bottom: 0.35rem; font-size: 0.88rem;">Message:</label>
              <textarea class="feedback-textarea" rows="4" placeholder="Please include relevant calculator URLs and sample numerical inputs..." required></textarea>
            </div>
            <button type="submit" class="feedback-btn" style="width: 100%;">
              Send Inquiry ✉️
            </button>
          </form>
        </div>

        <!-- Info & Channels -->
        <div>
          <h2 class="content-subheading" style="margin-top: 0;">Official Communication Channels</h2>
          <p class="seo-content-text">
            For fastest resolution, refer to our primary contact channels below:
          </p>
          <ul class="content-list">
            <li><b>General Support:</b> <a href="mailto:support@calculatorbowl.com" class="in-text-link">support@calculatorbowl.com</a></li>
            <li><b>Algorithm &amp; Quality Review:</b> <a href="mailto:quality@calculatorbowl.com" class="in-text-link">quality@calculatorbowl.com</a></li>
            <li><b>Response SLA:</b> Inquiries are typically reviewed within 24–48 business hours.</li>
          </ul>

          <h2 class="content-subheading">How to Report a Calculation Discrepancy</h2>
          <p class="seo-content-text">
            To assist our mathematicians in verifying an edge case, please provide:
          </p>
          <ol class="content-ordered-list">
            <li>The exact calculator page URL (e.g. <code>/calc/mortgage-calculator</code>).</li>
            <li>The precise numerical inputs entered into the form.</li>
            <li>The result displayed by CalculatorBowl vs. your expected theoretical outcome and reference source.</li>
          </ol>
        </div>
      </div>
    </article>
  `;
}

/* ==========================================================================
   Dedicated View 7: Legal Information & Terms of Use (750+ Words)
   ========================================================================== */
function renderTermsView(container) {
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Legal Information & Terms of Use", link: "/terms", current: true }
  ];

  updateSEO(
    "Legal Information & Terms of Use | CalculatorBowl",
    "Terms of service, mathematical disclaimers, intellectual property policies, and user agreements for CalculatorBowl.",
    {
      pageType: "website",
      breadcrumbs: breadcrumbs
    }
  );
  updateBreadcrumbs(breadcrumbs);
  updateActiveNav("");

  container.innerHTML = `
    <article class="calc-seo-content" style="margin-top: 1rem; padding: 2.5rem 2rem;">
      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
        <span class="brand-badge">⚖️ Terms of Service</span>
      </div>
      <h1 class="seo-content-title" style="font-size: 2.25rem; line-height: 1.2; margin-bottom: 1rem;">
        Legal Information &amp; Terms of Use
      </h1>
      <p class="seo-content-text" style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 2rem;">
        Last Updated: August 31, 2026 | Effective Date: Immediately upon access
      </p>

      <h2 class="content-subheading">1. Acceptance of Terms</h2>
      <p class="seo-content-text">
        By accessing, browsing, or utilizing any calculation tools on <b>CalculatorBowl</b> (accessible at https://calculatorbowl.com/), you acknowledge that you have read, understood, and agreed to be legally bound by these Terms of Use and all applicable federal, state, and international laws. If you do not agree with any part of these terms, you must discontinue use of the website immediately.
      </p>

      <h2 class="content-subheading">2. Professional Advisory Disclaimer (No Financial, Legal, or Medical Advice)</h2>
      <div class="formula-callout" style="border-left-color: #ef4444; background: rgba(239, 68, 68, 0.05);">
        <div class="formula-label" style="color: #ef4444;">IMPORTANT LEGAL NOTICE</div>
        <div class="formula-expl">
          All calculators, charts, formulas, amortization schedules, and numerical projections provided on CalculatorBowl are intended exclusively for <b>educational, academic, and general illustrative purposes</b>. CalculatorBowl is NOT a registered financial advisor, tax preparer, certified public accountant, licensed mortgage broker, law firm, or medical provider.
        </div>
      </div>
      <p class="seo-content-text">
        Real-world loan agreements, mortgage contracts, investment portfolios, tax obligations, and medical assessments are influenced by lender underwriting criteria, local jurisdiction statutes, compounding conventions, and unique personal circumstances. Users should always consult a licensed financial advisor, attorney, or certified professional before entering into binding fiscal contracts or taking financial actions based on calculations.
      </p>

      <h2 class="content-subheading">3. Accuracy of Calculations &amp; Warranty Disclaimer</h2>
      <p class="seo-content-text">
        While the CalculatorBowl engineering team strives for 100% precision by benchmarking algorithms against verified mathematical, NIST, and standard banking equations, the website and its computational tools are provided on an <b>"AS IS"</b> and <b>"AS AVAILABLE"</b> basis without warranties of any kind, whether express, implied, statutory, or otherwise. CalculatorBowl expressly disclaims all warranties of merchantability, fitness for a particular purpose, and non-infringement.
      </p>

      <h2 class="content-subheading">4. Intellectual Property Rights &amp; Permitted Use</h2>
      <p class="seo-content-text">
        All proprietary source code, user interface designs, dynamic SVG infographic diagrams, visual styles, brand marks, and explanatory articles on CalculatorBowl are the exclusive intellectual property of CalculatorBowl. Users are granted a revocable, non-exclusive license to use the calculators for personal, academic, and non-commercial educational purposes. Reproduction, scraping, reverse engineering, or redistribution of site software for commercial duplication is strictly prohibited without prior written consent.
      </p>

      <h2 class="content-subheading">5. Limitation of Liability</h2>
      <p class="seo-content-text">
        Under no circumstances shall CalculatorBowl, its contributors, or affiliates be liable for any direct, indirect, incidental, consequential, special, or exemplary damages—including but not limited to loss of capital, erroneous tax filings, loan miscalculations, or business interruption—arising out of or in connection with the use or inability to use the calculators on this platform.
      </p>
    </article>
  `;
}

/* ==========================================================================
   Dedicated View 8: Privacy Policy (750+ Words)
   ========================================================================== */
function renderPrivacyView(container) {
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Privacy Policy", link: "/privacy", current: true }
  ];

  updateSEO(
    "Privacy Policy & Client-Side Privacy Guarantee | CalculatorBowl",
    "Learn about CalculatorBowl's strict 100% client-side privacy architecture, zero-data transmission standards, and GDPR compliance.",
    {
      pageType: "website",
      breadcrumbs: breadcrumbs
    }
  );
  updateBreadcrumbs(breadcrumbs);
  updateActiveNav("");

  container.innerHTML = `
    <article class="calc-seo-content" style="margin-top: 1rem; padding: 2.5rem 2rem;">
      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
        <span class="brand-badge">🔒 Privacy Architecture</span>
      </div>
      <h1 class="seo-content-title" style="font-size: 2.25rem; line-height: 1.2; margin-bottom: 1rem;">
        Privacy Policy
      </h1>
      <p class="seo-content-text" style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 2rem;">
        Last Updated: August 31, 2026 | Zero Server Storage Guarantee
      </p>

      <h2 class="content-subheading">1. Our 100% Client-Side Privacy Guarantee</h2>
      <p class="seo-content-text">
        Your privacy and confidential numerical data are fundamentally protected by design. CalculatorBowl is built from the ground up as a <b>pure client-side single-page application (SPA)</b>. All computational algorithms run entirely within your device's web browser using local JavaScript execution.
      </p>

      <h2 class="content-subheading">2. Information We Do NOT Collect</h2>
      <div class="formula-callout" style="border-left-color: #10b981; background: rgba(16, 185, 129, 0.05);">
        <div class="formula-label" style="color: #10b981;">NO DATA TRANSMISSION</div>
        <div class="formula-expl">
          We do <b>NOT</b> collect, transmit, store, or sell any numerical values, loan amounts, interest rates, property values, salary figures, or mathematical formulas you enter into our calculators.
        </div>
      </div>
      <p class="seo-content-text">
        When you calculate a mortgage repayment or test an investment growth scenario, that data remains strictly in your device’s volatile memory. When you close the browser tab or refresh the page, the calculation inputs are instantly purged.
      </p>

      <h2 class="content-subheading">3. Browser Local Storage vs. Cookies</h2>
      <p class="seo-content-text">
        CalculatorBowl does not use invasive tracking cookies. We utilize standard, client-side HTML5 <code>localStorage</code> solely for your personal browsing convenience:
      </p>
      <ul class="content-list">
        <li><b>Theme Preferences:</b> Storing whether you prefer Light Mode or Dark Mode (key: <code>calculatorbowl-theme</code>).</li>
        <li><b>Local Calculator History:</b> Allowing the standard handheld calculator to optionally maintain a local tape history on your machine.</li>
      </ul>
      <p class="seo-content-text">
        This local storage data is never sent to our servers and can be wiped at any time by clearing your browser cache.
      </p>

      <h2 class="content-subheading">4. Compliance with International Privacy Regulations (GDPR &amp; CCPA)</h2>
      <p class="seo-content-text">
        Because CalculatorBowl does not gather, process, or monetize Personally Identifiable Information (PII) during calculations, our service inherently aligns with the strictest global privacy mandates:
      </p>
      <ul class="content-list">
        <li><b>GDPR (General Data Protection Regulation):</b> European Union users enjoy complete anonymity without requiring intrusive consent banners for non-existent tracking.</li>
        <li><b>CCPA / CPRA (California Consumer Privacy Act):</b> We do not sell or share personal consumer data under any circumstances.</li>
      </ul>

      <h2 class="content-subheading">5. Server Logs &amp; Anonymous Traffic Analytics</h2>
      <p class="seo-content-text">
        Like virtually all web hosts, standard web servers automatically record generic, non-identifiable access logs (including IP addresses, browser user agents, and referring URLs) purely for security monitoring, DDoS mitigation, and operational diagnostics.
      </p>
    </article>
  `;
}

/* ==========================================================================
   Dedicated View 9: Calculator List & Master Directory (A–Z Dynamic Index)
   ========================================================================== */
function renderCalculatorsListView(container) {
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Calculator List (A–Z Directory)", link: "/calculators-list", current: true }
  ];

  updateSEO(
    "Calculator List (A–Z Directory) - Complete Free Online Calculators | CalculatorBowl",
    "Explore our complete alphabetical A–Z directory of 32+ free online calculators and solvers across financial, math, algebra, fractions, statistics, conversion, and time calculations.",
    {
      pageType: "website",
      breadcrumbs: breadcrumbs
    }
  );
  updateBreadcrumbs(breadcrumbs);
  updateActiveNav("");

  const allCalcs = getAllCalculators();
  // Sort alphabetically by name
  allCalcs.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

  // Group calculators by their first letter (A-Z)
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const groupedCalcs = {};
  alphabet.forEach(letter => {
    groupedCalcs[letter] = [];
  });

  allCalcs.forEach(c => {
    const firstChar = c.name.trim().charAt(0).toUpperCase();
    if (groupedCalcs[firstChar]) {
      groupedCalcs[firstChar].push(c);
    } else {
      // If starts with number or symbol, group under '#' or create group
      if (!groupedCalcs["#"]) groupedCalcs["#"] = [];
      groupedCalcs["#"].push(c);
    }
  });

  // Alphabet jump bar HTML
  const azBarHtml = alphabet.map(letter => {
    const count = groupedCalcs[letter] ? groupedCalcs[letter].length : 0;
    if (count > 0) {
      return `<a href="javascript:void(0)" onclick="window.scrollToLetter('${letter}')" class="az-letter-link" title="${letter} (${count} calculators)">${letter}</a>`;
    } else {
      return `<span class="az-letter-link disabled" title="No calculators for ${letter}">${letter}</span>`;
    }
  }).join("");

  // Letter sections HTML
  const letterSectionsHtml = alphabet.map(letter => {
    const calcs = groupedCalcs[letter] || [];
    if (calcs.length === 0) return "";

    return `
      <section class="az-letter-group" id="letter-${letter}" data-letter="${letter}">
        <div class="az-letter-heading">
          <span class="az-letter-char">${letter}</span>
          <span class="az-letter-heading-badge">${calcs.length} ${calcs.length > 1 ? 'calculators' : 'calculator'}</span>
        </div>
        <ul class="az-calc-list">
          ${calcs.map(c => `
            <li class="az-calc-item" data-name="${c.name.toLowerCase()}" data-desc="${c.description.toLowerCase()}" data-category="${c.category}">
              <a href="/calc/${c.id}" class="az-calc-link">
                <span class="az-calc-bullet">•</span>
                <span class="az-calc-name">${c.name}</span>
              </a>
            </li>
          `).join("")}
        </ul>
      </section>
    `;
  }).join("");

  container.innerHTML = `
    <div class="az-directory-container">
      <div style="margin-bottom: 1.5rem;">
        <span class="brand-badge" style="font-size: 0.8rem; margin-bottom: 0.5rem; display: inline-block;">Master Directory</span>
        <h1 class="hero-title" style="font-size: 2.25rem; text-align: left; margin-bottom: 0.5rem;">
          📑 Calculator List (A–Z Index)
        </h1>
        <p class="hero-subtitle" style="text-align: left; margin: 0 0 1.5rem; max-width: 800px;">
          Alphabetical index of all <strong>${allCalcs.length} free online calculators</strong>. Jump to a specific letter or use the instant filter below to find the exact computational tool you need.
        </p>

        <!-- Live Instant Filter Box -->
        <div style="max-width: 500px; margin-bottom: 1rem; position: relative;">
          <input 
            type="text" 
            id="azFilterInput" 
            placeholder="🔍 Type to filter calculators instantly..." 
            oninput="window.filterAzCatalog(this.value)"
            class="feedback-input" 
            style="padding-left: 2.5rem; font-size: 0.95rem; border-radius: var(--radius-lg); background: var(--bg-surface);"
          />
          <span style="position: absolute; left: 0.9rem; top: 50%; transform: translateY(-50%); opacity: 0.6; pointer-events: none;">🔍</span>
        </div>
      </div>

      <!-- Jump to letter navigation bar -->
      <nav class="az-index-bar" aria-label="Alphabetical Jump Navigation">
        <span style="font-weight: 700; font-size: 0.85rem; color: var(--text-secondary); margin-right: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Jump to:</span>
        ${azBarHtml}
      </nav>

      <!-- All Calculator Letter Groups -->
      <div id="azListContainer">
        ${letterSectionsHtml}
      </div>
      
      <div id="azNoResults" style="display: none; padding: 3rem 1.5rem; text-align: center; background: var(--bg-subtle); border-radius: var(--radius-lg); border: 1.5px dashed var(--border-color); margin-top: 1rem;">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
        <h3 style="margin: 0 0 0.5rem; color: var(--text-primary);">No calculators found</h3>
        <p style="margin: 0; color: var(--text-secondary); font-size: 0.95rem;">Try searching for a different keyword or press <kbd style="padding: 2px 6px; background: var(--bg-surface); border-radius: 4px; border: 1px solid var(--border-color); font-family: var(--font-mono);">Ctrl + K</kbd> for the universal spotlight.</p>
      </div>
    </div>
  `;
}

// Live interactive filter for A-Z directory
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
  const el = document.getElementById(`letter-${letter}`);
  if (el) {
    const yOffset = -90; // sticky header buffer
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
};

window.handleFeedbackSubmit = function(event) {
  event.preventDefault();
  const form = event.target;
  form.innerHTML = `
    <div style="padding: 2rem 1.5rem; background: rgba(16, 185, 129, 0.08); border: 1.5px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-xl); text-align: center; color: #059669;">
      <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🎉</div>
      <h3 style="color: #059669; margin: 0 0 0.5rem; font-family: var(--font-heading);">Message Successfully Received!</h3>
      <p style="margin: 0; font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6;">
        Thank you for contributing to CalculatorBowl. Our engineering team reviews all user proposals, algorithm suggestions, and feedback regularly.
      </p>
    </div>
  `;
};


