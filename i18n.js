// ICLOTH — Global Language System
// Usage: data-ar="نص عربي" data-en="English text"
// OR: class="ar" / class="en" on blocks

const TRANSLATIONS = {
  en: {
    nav_home:    'HOME',
    nav_shop:    'SHOP',
    nav_about:   'ABOUT',
    nav_contact: 'CONTACT',
    shop_btn:    'SHOP NOW',
    tagline:     'PREMIUM CLOTHING STORE',
    sub_tagline: 'Quality you can feel',
    // shop page
    shop_title:  'THE STORE',
    shop_sub:    'Latest fashion · Premium quality · Fast delivery',
    all_cats:    'All',
    sort_label:  'Sort',
    sort_newest: 'Newest',
    sort_price_asc:  'Price: Low → High',
    sort_price_desc: 'Price: High → Low',
    sort_discount:   'Highest Discount',
    empty_title: 'No products yet',
    empty_sub:   'Products are coming soon — stay tuned!',
    in_stock:    'In Stock',
    low_stock:   'Low Stock',
    out_stock:   'Out of Stock',
    add_cart:    'Add to Cart',
    // footer
    footer_links:    'Links',
    footer_help:     'Help',
    footer_social:   'Social',
    footer_copy:     '© 2026 ICLOTH — Kafr Shukr',
    footer_made:     'Made with ❤️ in Egypt',
    footer_admin:    'Admin',
    footer_app:      'Download App',
    link_home:       'Home',
    link_shop:       'Shop',
    link_about:      'About Us',
    link_contact:    'Contact',
    link_faq:        'FAQ',
    link_shipping:   'Shipping Policy',
    link_returns:    'Returns',
    link_fb:         'Facebook',
    link_ig:         'Instagram',
    link_wa:         'WhatsApp',
    // pwa
    pwa_title: 'Download ICLOTH App',
    pwa_sub:   'Add to your home screen for quick access',
    pwa_install: 'Install',
    pwa_dismiss: 'Not now',
  },
  ar: {
    nav_home:    'الرئيسية',
    nav_shop:    'المتجر',
    nav_about:   'من نحن',
    nav_contact: 'تواصل',
    shop_btn:    'تسوق الآن',
    tagline:     'متجر الملابس الراقية',
    sub_tagline: 'جودة تشعر بها',
    // shop
    shop_title:  'المتجر',
    shop_sub:    'أحدث الأزياء · جودة راقية · توصيل سريع',
    all_cats:    'الكل',
    sort_label:  'ترتيب',
    sort_newest: 'الأحدث',
    sort_price_asc:  'السعر: الأقل أولاً',
    sort_price_desc: 'السعر: الأعلى أولاً',
    sort_discount:   'أعلى خصم',
    empty_title: 'لا توجد منتجات حتى الآن',
    empty_sub:   'سيتم إضافة المنتجات قريباً — ترقبونا!',
    in_stock:    'متوفر',
    low_stock:   'كمية محدودة',
    out_stock:   'نفذت الكمية',
    add_cart:    'أضف للسلة',
    // footer
    footer_links:    'روابط',
    footer_help:     'مساعدة',
    footer_social:   'تواصل اجتماعي',
    footer_copy:     '© 2026 ICLOTH — كفر شكر',
    footer_made:     'صُنع بـ ❤️ في مصر',
    footer_admin:    'لوحة الإدارة',
    footer_app:      'تحميل التطبيق',
    link_home:       'الرئيسية',
    link_shop:       'المتجر',
    link_about:      'من نحن',
    link_contact:    'اتصل بنا',
    link_faq:        'الأسئلة الشائعة',
    link_shipping:   'سياسة الشحن',
    link_returns:    'المرتجعات',
    link_fb:         'فيسبوك',
    link_ig:         'إنستغرام',
    link_wa:         'واتساب',
    // pwa
    pwa_title:   'تحميل تطبيق ICLOTH',
    pwa_sub:     'أضفه لشاشتك الرئيسية للوصول السريع',
    pwa_install: 'تحميل',
    pwa_dismiss: 'لاحقاً',
  }
};

const LANG_KEY = 'icloth_lang';
let currentLang = localStorage.getItem(LANG_KEY) || 'ar';

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang;
  document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';

  const t = TRANSLATIONS[lang];

  // Update all [data-i18n] elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // Update lang toggle buttons
  document.querySelectorAll('.lang-toggle button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Dispatch event for page-specific use
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang, t } }));
}

function initLang() {
  applyLang(currentLang);

  document.querySelectorAll('.lang-toggle button').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang));
  });
}

// PWA Logic
let deferredInstallPrompt = null;

function initPWA() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredInstallPrompt = e;
    document.querySelectorAll('.pwa-trigger').forEach(b => b.style.display = 'flex');
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    document.querySelectorAll('.pwa-trigger').forEach(b => b.style.display = 'none');
    hidePwaOverlay();
  });

  document.querySelectorAll('.pwa-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('pwaOverlay')?.classList.add('show');
    });
  });

  document.getElementById('pwaInstall')?.addEventListener('click', async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      if (outcome === 'accepted') hidePwaOverlay();
      deferredInstallPrompt = null;
    }
  });

  document.getElementById('pwaDismiss')?.addEventListener('click', hidePwaOverlay);
}

function hidePwaOverlay() {
  document.getElementById('pwaOverlay')?.classList.remove('show');
}

// Shared header builder
function buildHeader(activePage = 'home') {
  const pages = [
    { key: 'nav_home',    href: 'index.html', id: 'home' },
    { key: 'nav_shop',    href: 'shop.html',  id: 'shop' },
    { key: 'nav_about',   href: '#about',      id: 'about' },
    { key: 'nav_contact', href: '#contact',    id: 'contact' },
  ];

  return `
  <header class="site-header">
    <a href="index.html" class="header-logo">
      <img src="logo/logo2..png" alt="ICLOTH">
    </a>
    <nav class="header-nav">
      ${pages.map(p => `
        <a href="${p.href}" class="${p.id === activePage ? 'active' : ''}" data-i18n="${p.key}">${TRANSLATIONS[currentLang][p.key]}</a>
      `).join('')}
    </nav>
    <div class="header-actions">
      <div class="lang-toggle">
        <button data-lang="ar" ${currentLang === 'ar' ? 'class="active"' : ''}>ع</button>
        <button data-lang="en" ${currentLang === 'en' ? 'class="active"' : ''}>EN</button>
      </div>
      <a href="shop.html" class="icon-btn"><i class="fa-solid fa-magnifying-glass"></i></a>
      <a href="#" class="icon-btn"><i class="fa-solid fa-bag-shopping"></i></a>
    </div>
  </header>`;
}

// Shared footer builder
function buildFooter() {
  const t = TRANSLATIONS[currentLang];
  return `
  <footer class="site-footer">
    <div class="footer-top">
      <div class="footer-brand">
        <img src="logo/logo2..png" alt="ICLOTH">
        <p data-i18n="sub_tagline">${t.sub_tagline}</p>
      </div>
      <div class="footer-col">
        <h4 data-i18n="footer_links">${t.footer_links}</h4>
        <a href="index.html" data-i18n="link_home">${t.link_home}</a>
        <a href="shop.html" data-i18n="link_shop">${t.link_shop}</a>
        <a href="#" data-i18n="link_about">${t.link_about}</a>
        <a href="#" data-i18n="link_contact">${t.link_contact}</a>
      </div>
      <div class="footer-col">
        <h4 data-i18n="footer_help">${t.footer_help}</h4>
        <a href="#" data-i18n="link_faq">${t.link_faq}</a>
        <a href="#" data-i18n="link_shipping">${t.link_shipping}</a>
        <a href="#" data-i18n="link_returns">${t.link_returns}</a>
      </div>
      <div class="footer-col">
        <h4 data-i18n="footer_social">${t.footer_social}</h4>
        <a href="#" data-i18n="link_fb">${t.link_fb}</a>
        <a href="#" data-i18n="link_ig">${t.link_ig}</a>
        <a href="#" data-i18n="link_wa">${t.link_wa}</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span data-i18n="footer_copy">${t.footer_copy}</span>
      <div class="footer-bottom-actions">
        <button class="footer-pill pwa pwa-trigger" style="display:none" id="pwaFooterBtn">
          <i class="fa-solid fa-download"></i>
          <span data-i18n="footer_app">${t.footer_app}</span>
        </button>
        <a href="admin-login.html" class="footer-pill admin">
          <i class="fa-solid fa-lock"></i>
          <span data-i18n="footer_admin">${t.footer_admin}</span>
        </a>
      </div>
    </div>
  </footer>

  <!-- PWA Overlay -->
  <div class="pwa-overlay" id="pwaOverlay">
    <div class="pwa-card">
      <img src="logo/logo2..png" alt="ICLOTH">
      <h3 data-i18n="pwa_title">${t.pwa_title}</h3>
      <p data-i18n="pwa_sub">${t.pwa_sub}</p>
      <div class="pwa-btns">
        <button class="pwa-btn-install" id="pwaInstall" data-i18n="pwa_install">${t.pwa_install}</button>
        <button class="pwa-btn-dismiss" id="pwaDismiss" data-i18n="pwa_dismiss">${t.pwa_dismiss}</button>
      </div>
    </div>
  </div>`;
}

export { initLang, initPWA, buildHeader, buildFooter, applyLang, currentLang, TRANSLATIONS };
