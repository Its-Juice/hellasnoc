// HellasNOC 2025 UI Core
const MOBILE_BP = 900;
const LS_LANG_KEY = 'hnoc:lang';

document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initLanguage();
  applyTranslations(getLang());
  setActiveLink();
  initReveal();
});

function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

// Menu / Navigation
function initMenu() {
  const toggle = qs('.menu-toggle');
  const nav = qs('.site-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  // Mobile submenu toggles
  qsa('.has-submenu > a').forEach(a => {
    a.addEventListener('click', (e) => {
      if (window.innerWidth <= MOBILE_BP) {
        const parent = a.parentElement;
        const expanded = parent.getAttribute('aria-expanded') === 'true';
        parent.setAttribute('aria-expanded', String(!expanded));
        e.preventDefault();
      }
    });
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > MOBILE_BP) nav.classList.remove('is-open');
  });
}

// Language
function getLang() {
  try { return localStorage.getItem(LS_LANG_KEY) || 'el'; } catch { return 'el'; }
}
function setLang(lang) {
  try { localStorage.setItem(LS_LANG_KEY, lang); } catch {}
  document.documentElement.lang = lang;
}
function initLanguage() {
  const current = getLang();
  setLang(current);
  qsa('.lang-switch [data-lang]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === current);
    btn.addEventListener('click', () => {
      if (btn.dataset.lang === getLang()) return;
      qsa('.lang-switch [data-lang]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setLang(btn.dataset.lang);
      applyTranslations(getLang());
    });
  });
}

function applyTranslations(lang) {
  if (typeof translations === 'undefined') return;
  qsa('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const dict = translations[lang] || {};
    let t = dict[key];
    if (typeof t !== 'string') return;
    if (el.dataset.i18nCount) {
      t = t.replace('{count}', el.dataset.i18nCount);
    }
    el.textContent = t;
  });
}

// Active link
function setActiveLink() {
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  qsa('.menu a[href]').forEach(a => a.removeAttribute('aria-current'));
  const exact = qsa('.menu a[href]').find(a => (a.getAttribute('href')||'').toLowerCase().endsWith(path));
  if (exact) exact.setAttribute('aria-current','page');
}

// Reveal on scroll
function initReveal() {
  const els = qsa('.reveal');
  if (els.length === 0) return;
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
  els.forEach(el => io.observe(el));
}
