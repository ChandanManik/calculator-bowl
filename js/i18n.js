/**
 * CalculatorBowl - Multilingual & Bilingual Internationalization (i18n) Engine
 * Supports 26+ Languages: English, Bengali, Hindi, Chinese, German, French, Italian,
 * Spanish, Portuguese, Russian, Dutch, Swedish, Norwegian, Danish, Finnish, Icelandic,
 * Estonian, Latvian, Lithuanian, Arabic (RTL), Polish, Romanian, Czech, Croatian, Greek, Turkish.
 */

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇧🇩', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', native: '简体中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹', dir: 'ltr' },
  { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', flag: '🇳🇱', dir: 'ltr' },
  { code: 'pl', name: 'Polish', native: 'Polski', flag: '🇵🇱', dir: 'ltr' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
  { code: 'sv', name: 'Swedish', native: 'Svenska', flag: '🇸🇪', dir: 'ltr' },
  { code: 'no', name: 'Norwegian', native: 'Norsk', flag: '🇳🇴', dir: 'ltr' },
  { code: 'da', name: 'Danish', native: 'Dansk', flag: '🇩🇰', dir: 'ltr' },
  { code: 'fi', name: 'Finnish', native: 'Suomi', flag: '🇫🇮', dir: 'ltr' },
  { code: 'is', name: 'Icelandic', native: 'Íslenska', flag: '🇮🇸', dir: 'ltr' },
  { code: 'et', name: 'Estonian', native: 'Eesti', flag: '🇪🇪', dir: 'ltr' },
  { code: 'lv', name: 'Latvian', native: 'Latviešu', flag: '🇱🇻', dir: 'ltr' },
  { code: 'lt', name: 'Lithuanian', native: 'Lietuvių', flag: '🇱🇹', dir: 'ltr' },
  { code: 'ro', name: 'Romanian', native: 'Română', flag: '🇷🇴', dir: 'ltr' },
  { code: 'cs', name: 'Czech', native: 'Čeština', flag: '🇨🇿', dir: 'ltr' },
  { code: 'hr', name: 'Croatian', native: 'Hrvatski', flag: '🇭🇷', dir: 'ltr' },
  { code: 'el', name: 'Greek', native: 'Ελληνικά', flag: '🇬🇷', dir: 'ltr' }
];

// Core UI translation dictionaries for instant, zero-latency switching
const I18N_DICTIONARY = {
  en: {
    nav_home: "🏠 Home",
    nav_financial: "💰 Financial",
    nav_math: "➗ Math & Fractions",
    nav_conversions: "🔄 Conversions",
    nav_datetime: "⏱️ Date & Time",
    quick_search: "Quick search...",
    shortcut_hint: "Ctrl K",
    theme_toggle: "Toggle Theme",
    lang_select: "Language",
    popular_badge: "Popular",
    step_solution: "Step-by-Step Solution",
    formula_breakdown: "Formula Breakdown",
    related_calculators: "Related Calculators in this Cluster",
    calculate_btn: "Calculate",
    clear_btn: "Reset",
    copy_btn: "Copy Result",
    copied_btn: "Copied!",
    footer_copy: "© 2026 CalculatorBowl. Free online calculators with step-by-step solutions."
  },
  bn: {
    nav_home: "🏠 হোম",
    nav_financial: "💰 ফাইন্যান্সিয়াল",
    nav_math: "➗ গণিত ও ভগ্নাংশ",
    nav_conversions: "🔄 একক রূপান্তর",
    nav_datetime: "⏱️ তারিখ ও সময়",
    quick_search: "দ্রুত ক্যালকুলেটর খুঁজুন...",
    shortcut_hint: "Ctrl K",
    theme_toggle: "থিম পরিবর্তন করুন",
    lang_select: "ভাষা",
    popular_badge: "জনপ্রিয়",
    step_solution: "ধাপে ধাপে বিস্তারিত সমাধান",
    formula_breakdown: "গাণিতিক সূত্রের বিশ্লেষণ",
    related_calculators: "এই ক্লাস্টারের সংশ্লিষ্ট অন্যান্য ক্যালকুলেটর",
    calculate_btn: "গণনা করুন",
    clear_btn: "রিসেট",
    copy_btn: "ফলাফল কপি করুন",
    copied_btn: "কপি হয়েছে!",
    footer_copy: "© ২০২৬ CalculatorBowl। ধাপে ধাপে সমাধানসহ ফ্রি অনলাইন ক্যালকুলেটর।"
  },
  hi: {
    nav_home: "🏠 होम",
    nav_financial: "💰 वित्तीय",
    nav_math: "➗ गणित और भिन्न",
    nav_conversions: "🔄 इकाई रूपांतरण",
    nav_datetime: "⏱️ दिनांक और समय",
    quick_search: "कैलकुलेटर खोजें...",
    shortcut_hint: "Ctrl K",
    theme_toggle: "थीम बदलें",
    lang_select: "भाषा",
    popular_badge: "लोकप्रिय",
    step_solution: "चरण-दर-चरण समाधान",
    formula_breakdown: "सूत्र विश्लेषण",
    related_calculators: "इस क्लस्टर में संबंधित कैलकुलेटर",
    calculate_btn: "गणना करें",
    clear_btn: "रीसेट",
    copy_btn: "परिणाम कॉपी करें",
    copied_btn: "कॉपी किया गया!",
    footer_copy: "© 2026 CalculatorBowl। चरण-दर-चरण समाधान के साथ मुफ्त ऑनलाइन कैलकुलेटर।"
  },
  es: {
    nav_home: "🏠 Inicio",
    nav_financial: "💰 Financiero",
    nav_math: "➗ Matemáticas",
    nav_conversions: "🔄 Conversiones",
    nav_datetime: "⏱️ Fecha y Hora",
    quick_search: "Buscar calculadora...",
    shortcut_hint: "Ctrl K",
    theme_toggle: "Cambiar Tema",
    lang_select: "Idioma",
    popular_badge: "Popular",
    step_solution: "Solución Paso a Paso",
    formula_breakdown: "Desglose de Fórmula",
    related_calculators: "Calculadoras Relacionadas",
    calculate_btn: "Calcular",
    clear_btn: "Restablecer",
    copy_btn: "Copiar Resultado",
    copied_btn: "¡Copiado!",
    footer_copy: "© 2026 CalculatorBowl. Calculadoras gratuitas en línea con soluciones paso a paso."
  },
  fr: {
    nav_home: "🏠 Accueil",
    nav_financial: "💰 Financier",
    nav_math: "➗ Maths & Fractions",
    nav_conversions: "🔄 Conversions",
    nav_datetime: "⏱️ Date & Heure",
    quick_search: "Recherche rapide...",
    shortcut_hint: "Ctrl K",
    theme_toggle: "Changer de thème",
    lang_select: "Langue",
    popular_badge: "Populaire",
    step_solution: "Solution Étape par Étape",
    formula_breakdown: "Détail de la Formule",
    related_calculators: "Calculatrices Associées",
    calculate_btn: "Calculer",
    clear_btn: "Réinitialiser",
    copy_btn: "Copier le Résultat",
    copied_btn: "Copié !",
    footer_copy: "© 2026 CalculatorBowl. Calculatrices en ligne gratuites avec solutions pas à pas."
  },
  de: {
    nav_home: "🏠 Startseite",
    nav_financial: "💰 Finanzen",
    nav_math: "➗ Mathe & Brüche",
    nav_conversions: "🔄 Umrechnungen",
    nav_datetime: "⏱️ Datum & Zeit",
    quick_search: "Rechner suchen...",
    shortcut_hint: "Ctrl K",
    theme_toggle: "Design wechseln",
    lang_select: "Sprache",
    popular_badge: "Beliebt",
    step_solution: "Schritt-für-Schritt-Lösung",
    formula_breakdown: "Formelaufschlüsselung",
    related_calculators: "Ähnliche Rechner in diesem Cluster",
    calculate_btn: "Berechnen",
    clear_btn: "Zurücksetzen",
    copy_btn: "Ergebnis kopieren",
    copied_btn: "Kopiert!",
    footer_copy: "© 2026 CalculatorBowl. Kostenlose Online-Rechner mit Schritt-für-Schritt-Lösungen."
  },
  'zh-CN': {
    nav_home: "🏠 首页",
    nav_financial: "💰 金融计算",
    nav_math: "➗ 数学与分数",
    nav_conversions: "🔄 单位换算",
    nav_datetime: "⏱️ 日期与时间",
    quick_search: "快速搜索计算器...",
    shortcut_hint: "Ctrl K",
    theme_toggle: "切换主题",
    lang_select: "语言",
    popular_badge: "热门",
    step_solution: "逐步详细计算过程",
    formula_breakdown: "公式解析",
    related_calculators: "相关计算器推荐",
    calculate_btn: "开始计算",
    clear_btn: "重置",
    copy_btn: "复制结果",
    copied_btn: "已复制！",
    footer_copy: "© 2026 CalculatorBowl。提供分步解答的免费在线多功能计算器。"
  },
  ar: {
    nav_home: "🏠 الرئيسية",
    nav_financial: "💰 المالية",
    nav_math: "➗ الرياضيات والكسور",
    nav_conversions: "🔄 تحويل الوحدات",
    nav_datetime: "⏱️ التاريخ والوقت",
    quick_search: "بحث سريع عن آلة حاسبة...",
    shortcut_hint: "Ctrl K",
    theme_toggle: "تبديل المظهر",
    lang_select: "اللغة",
    popular_badge: "شائع",
    step_solution: "حل خطوة بخطوة",
    formula_breakdown: "تفصيل الصيغة الرياضية",
    related_calculators: "حاسبات ذات صلة في هذا القسم",
    calculate_btn: "احسب الآن",
    clear_btn: "إعادة ضبط",
    copy_btn: "نسخ النتيجة",
    copied_btn: "تم النسخ!",
    footer_copy: "© 2026 CalculatorBowl. آلات حاسبة مجانية عبر الإنترنت مع حلول خطوة بخطوة."
  },
  pt: {
    nav_home: "🏠 Início",
    nav_financial: "💰 Financeiro",
    nav_math: "➗ Matemática",
    nav_conversions: "🔄 Conversões",
    nav_datetime: "⏱️ Data e Hora",
    quick_search: "Pesquisar calculadora...",
    shortcut_hint: "Ctrl K",
    theme_toggle: "Alternar Tema",
    lang_select: "Idioma",
    popular_badge: "Popular",
    step_solution: "Solução Passo a Passo",
    formula_breakdown: "Análise da Fórmula",
    related_calculators: "Calculadoras Relacionadas",
    calculate_btn: "Calcular",
    clear_btn: "Limpar",
    copy_btn: "Copiar Resultado",
    copied_btn: "Copiado!",
    footer_copy: "© 2026 CalculatorBowl. Calculadoras online gratuitas com soluções passo a passo."
  },
  ru: {
    nav_home: "🏠 Главная",
    nav_financial: "💰 Финансы",
    nav_math: "➗ Математика и дроби",
    nav_conversions: "🔄 Конвертеры",
    nav_datetime: "⏱️ Дата и время",
    quick_search: "Поиск калькулятора...",
    shortcut_hint: "Ctrl K",
    theme_toggle: "Сменить тему",
    lang_select: "Язык",
    popular_badge: "Популярно",
    step_solution: "Пошаговое решение",
    formula_breakdown: "Разбор формулы",
    related_calculators: "Похожие калькуляторы",
    calculate_btn: "Рассчитать",
    clear_btn: "Сброс",
    copy_btn: "Копировать результат",
    copied_btn: "Скопировано!",
    footer_copy: "© 2026 CalculatorBowl. Бесплатные онлайн калькуляторы с пошаговыми решениями."
  }
};

class I18nManager {
  constructor() {
    this.currentLang = this.detectUserLanguage();
    this.isDropdownOpen = false;
    this.init();
  }

  detectUserLanguage() {
    // 1. If user previously manually selected a language, respect their choice
    try {
      const saved = localStorage.getItem('calculatorbowl_lang');
      if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
        return saved;
      }
    } catch (e) {}

    // 2. Automatic Browser Language / Locale Detection (navigator.languages / navigator.language)
    try {
      const browserLangs = navigator.languages && navigator.languages.length > 0
        ? [...navigator.languages]
        : [navigator.language || navigator.userLanguage || ''];

      for (const bLang of browserLangs) {
        if (!bLang) continue;
        const normalized = bLang.toLowerCase().trim();

        // Exact match e.g. 'zh-cn' -> 'zh-CN'
        const exact = SUPPORTED_LANGUAGES.find(l => l.code.toLowerCase() === normalized);
        if (exact) {
          return exact.code;
        }

        // Prefix match e.g. 'es-es', 'es-mx', 'it-it', 'fr-fr', 'de-de', 'bn-bd', 'hi-in', 'ar-sa'
        const prefix = normalized.split('-')[0];
        const match = SUPPORTED_LANGUAGES.find(l => l.code.toLowerCase() === prefix);
        if (match) {
          return match.code;
        }
      }
    } catch (e) {}

    // 3. Fallback: Automatic Timezone Region Mapping (e.g. Europe/Madrid -> 'es', Europe/Rome -> 'it')
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const tzMap = {
        'Europe/Madrid': 'es',
        'Europe/Rome': 'it',
        'Europe/Paris': 'fr',
        'Europe/Berlin': 'de',
        'Europe/Lisbon': 'pt',
        'Europe/Moscow': 'ru',
        'Europe/Amsterdam': 'nl',
        'Europe/Warsaw': 'pl',
        'Europe/Istanbul': 'tr',
        'Europe/Stockholm': 'sv',
        'Europe/Oslo': 'no',
        'Europe/Copenhagen': 'da',
        'Europe/Helsinki': 'fi',
        'Europe/Bucharest': 'ro',
        'Europe/Prague': 'cs',
        'Europe/Zagreb': 'hr',
        'Europe/Athens': 'el',
        'Europe/Tallinn': 'et',
        'Europe/Riga': 'lv',
        'Europe/Vilnius': 'lt',
        'Atlantic/Reykjavik': 'is',
        'Asia/Dhaka': 'bn',
        'Asia/Kolkata': 'hi',
        'Asia/Shanghai': 'zh-CN',
        'Asia/Riyadh': 'ar',
        'Asia/Dubai': 'ar',
        'Asia/Cairo': 'ar'
      };
      if (tz && tzMap[tz]) {
        return tzMap[tz];
      }
    } catch (e) {}

    return 'en';
  }

  init() {
    // Set initial direction and html lang
    this.applyLanguageDirection(this.currentLang);
    if (this.currentLang && this.currentLang !== 'en') {
      this.setupGoogleTranslateBridge();
    }
    this.renderLanguageSelector();
    this.bindEvents();
    this.translateStaticUI();
  }

  getLanguageConfig(code) {
    return SUPPORTED_LANGUAGES.find(l => l.code === code) || SUPPORTED_LANGUAGES[0];
  }

  applyLanguageDirection(langCode) {
    const config = this.getLanguageConfig(langCode);
    document.documentElement.setAttribute('lang', config.code);
    document.documentElement.setAttribute('dir', config.dir);
    if (config.dir === 'rtl') {
      document.body.classList.add('rtl-layout');
    } else {
      document.body.classList.remove('rtl-layout');
    }
  }

  setLanguage(code) {
    this.currentLang = code;
    localStorage.setItem('calculatorbowl_lang', code);
    this.applyLanguageDirection(code);
    this.updateSelectorButton();
    this.translateStaticUI();
    if (code !== 'en') {
      this.setupGoogleTranslateBridge();
    }
    this.triggerGoogleTranslate(code);
    this.closeDropdown();
  }

  renderLanguageSelector() {
    const container = document.getElementById('langSelectorContainer');
    if (!container) return;

    const current = this.getLanguageConfig(this.currentLang);

    container.innerHTML = `
      <div class="lang-selector-wrapper" id="langSelectorWrapper">
        <button type="button" class="lang-btn" id="langToggleBtn" aria-label="Change Language" aria-expanded="false">
          <span class="lang-flag" id="currentLangFlag">${current.flag}</span>
          <span class="lang-name-code" id="currentLangCode">${current.code.toUpperCase()}</span>
          <span class="lang-arrow">▾</span>
        </button>

        <div class="lang-dropdown-menu" id="langDropdownMenu" style="display: none;">
          <div class="lang-dropdown-header">
            <span class="lang-dropdown-title">🌐 Select Language (${SUPPORTED_LANGUAGES.length})</span>
            <input type="text" id="langSearchInput" class="lang-search-box" placeholder="Filter language..." autocomplete="off">
          </div>
          <div class="lang-list-scroll" id="langListScroll">
            ${this.renderLanguageItems()}
          </div>
        </div>
      </div>
    `;
  }

  renderLanguageItems(filter = '') {
    const query = filter.toLowerCase().trim();
    const filtered = SUPPORTED_LANGUAGES.filter(lang => 
      lang.name.toLowerCase().includes(query) ||
      lang.native.toLowerCase().includes(query) ||
      lang.code.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      return `<div class="lang-no-match">No matching language found</div>`;
    }

    return filtered.map(lang => {
      const isSelected = lang.code === this.currentLang;
      return `
        <button type="button" class="lang-option-btn ${isSelected ? 'active' : ''}" data-lang="${lang.code}">
          <span class="lang-opt-flag">${lang.flag}</span>
          <span class="lang-opt-name">${lang.name}</span>
          <span class="lang-opt-native">${lang.native}</span>
          ${isSelected ? '<span class="lang-opt-check">✓</span>' : ''}
        </button>
      `;
    }).join('');
  }

  updateSelectorButton() {
    const current = this.getLanguageConfig(this.currentLang);
    const flagEl = document.getElementById('currentLangFlag');
    const codeEl = document.getElementById('currentLangCode');
    if (flagEl) flagEl.textContent = current.flag;
    if (codeEl) codeEl.textContent = current.code.toUpperCase();

    // Re-render list to update active state
    const scrollEl = document.getElementById('langListScroll');
    if (scrollEl) {
      scrollEl.innerHTML = this.renderLanguageItems();
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    const menu = document.getElementById('langDropdownMenu');
    const btn = document.getElementById('langToggleBtn');
    if (menu) {
      menu.style.display = this.isDropdownOpen ? 'block' : 'none';
      if (this.isDropdownOpen) {
        const searchInput = document.getElementById('langSearchInput');
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        const scrollEl = document.getElementById('langListScroll');
        if (scrollEl) scrollEl.innerHTML = this.renderLanguageItems();
      }
    }
    if (btn) btn.setAttribute('aria-expanded', this.isDropdownOpen);
  }

  closeDropdown() {
    this.isDropdownOpen = false;
    const menu = document.getElementById('langDropdownMenu');
    const btn = document.getElementById('langToggleBtn');
    if (menu) menu.style.display = 'none';
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  bindEvents() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('#langToggleBtn');
      const optionBtn = e.target.closest('.lang-option-btn');
      const wrapper = e.target.closest('#langSelectorWrapper');

      if (btn) {
        this.toggleDropdown();
        return;
      }

      if (optionBtn) {
        const langCode = optionBtn.getAttribute('data-lang');
        if (langCode) {
          this.setLanguage(langCode);
        }
        return;
      }

      if (!wrapper && this.isDropdownOpen) {
        this.closeDropdown();
      }
    });

    document.addEventListener('input', (e) => {
      if (e.target && e.target.id === 'langSearchInput') {
        const scrollEl = document.getElementById('langListScroll');
        if (scrollEl) {
          scrollEl.innerHTML = this.renderLanguageItems(e.target.value);
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isDropdownOpen) {
        this.closeDropdown();
      }
    });
  }

  translateStaticUI() {
    const lang = this.currentLang;
    const dict = I18N_DICTIONARY[lang] || I18N_DICTIONARY.en;

    // Update Nav links
    const navLinks = document.querySelectorAll('.site-header .nav-link');
    if (navLinks.length >= 5) {
      navLinks[0].textContent = dict.nav_home;
      navLinks[1].textContent = dict.nav_financial;
      navLinks[2].textContent = dict.nav_math;
      navLinks[3].textContent = dict.nav_conversions;
      navLinks[4].textContent = dict.nav_datetime;
    }

    // Update search placeholder
    const searchInput = document.getElementById('headerSearchInput');
    if (searchInput) {
      searchInput.placeholder = dict.quick_search;
    }

    const searchTriggerInput = document.querySelector('#headerSearchTrigger input');
    if (searchTriggerInput) {
      searchTriggerInput.placeholder = dict.quick_search;
    }

    // Update footer copyright
    const footerBottomSpan = document.querySelector('.footer-bottom span');
    if (footerBottomSpan) {
      footerBottomSpan.textContent = dict.footer_copy;
    }
  }

  setupGoogleTranslateBridge() {
    // Setup Google Translate Script dynamically if not already loaded
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: SUPPORTED_LANGUAGES.map(l => l.code).join(','),
            autoDisplay: false
          }, 'google_translate_element');

          // If user previously selected another language, trigger it
          if (this.currentLang && this.currentLang !== 'en') {
            setTimeout(() => this.triggerGoogleTranslate(this.currentLang), 600);
          }
        }
      };
    }
  }

  triggerGoogleTranslate(targetLang) {
    if (targetLang === 'en') {
      // Clear Google Translate cookie to reset to native English
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
      
      const iframe = document.querySelector('.goog-te-banner-frame');
      if (iframe) {
        iframe.style.display = 'none';
      }
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = '';
        select.dispatchEvent(new Event('change'));
      }
      return;
    }

    // Set google translate cookie format: /en/code
    const googleCode = targetLang === 'zh-CN' ? 'zh-CN' : targetLang;
    const cookieVal = `/en/${googleCode}`;
    try {
      document.cookie = `googtrans=${cookieVal}; path=/;`;
      document.cookie = `googtrans=${cookieVal}; path=/; domain=.${window.location.hostname};`;
    } catch (e) {}

    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = googleCode;
      select.dispatchEvent(new Event('change'));
    } else {
      // Retry in case widget is still loading
      setTimeout(() => {
        const retrySelect = document.querySelector('.goog-te-combo');
        if (retrySelect) {
          retrySelect.value = googleCode;
          retrySelect.dispatchEvent(new Event('change'));
        }
      }, 500);
    }
  }
}

// Global instance initialization
let i18nManagerInstance = null;
function initI18n() {
  if (!i18nManagerInstance) {
    i18nManagerInstance = new I18nManager();
    window.i18nManager = i18nManagerInstance;
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initI18n);
} else {
  initI18n();
}
