// HellasNOC 2025 — Minimal JS for navigation, reveal, pricing toggle, and contact form
(function() {
  const SELECTORS = {
    nav: '.nav',
    menuToggle: '.menu-toggle',
    navLinks: '.nav__link',
    reveal: '.reveal',
    billingToggle: '.billing-toggle',
    billingBtn: '.billing-toggle__btn',
    plans: '.plan',
    period: '.plan__period',
    contactForm: '#contact-form',
    email: '#email'
  };

  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initReveal();
    initBilling();
    initContactForm();
    setActiveNavLink();
  });

  function initNav() {
    const nav = document.querySelector(SELECTORS.nav);
    const btn = document.querySelector(SELECTORS.menuToggle);
    if (!nav || !btn) return;

    btn.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on link click (mobile)
    nav.querySelectorAll(SELECTORS.navLinks).forEach(link => {
      link.addEventListener('click', () => {
        if (getViewportWidth() <= 960) {
          nav.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  function setActiveNavLink() {
    try {
      const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
      document.querySelectorAll(SELECTORS.navLinks).forEach(a => {
        a.removeAttribute('aria-current');
        if ((a.getAttribute('href') || '').toLowerCase() === path) {
          a.setAttribute('aria-current', 'page');
        }
      });
    } catch (_) {}
  }

  function initReveal() {
    const items = document.querySelectorAll(SELECTORS.reveal);
    if (!items.length) return;

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    items.forEach(el => io.observe(el));
  }

  function initBilling() {
    const toggle = document.querySelector(SELECTORS.billingToggle);
    if (!toggle) return;

    const monthlyBtn = document.getElementById('bill-monthly');
    const annualBtn = document.getElementById('bill-annual');

    function setMode(mode) {
      // Buttons
      [monthlyBtn, annualBtn].forEach(b => b && b.classList.remove('is-active'));
      const activeBtn = mode === 'annual' ? annualBtn : monthlyBtn;
      if (activeBtn) activeBtn.classList.add('is-active');

      // Plans
      document.querySelectorAll(SELECTORS.plans).forEach(plan => {
        if (mode === 'annual') plan.classList.add('is-annual');
        else plan.classList.remove('is-annual');
      });

      // Period labels
      document.querySelectorAll(SELECTORS.period).forEach(el => {
        el.textContent = mode === 'annual' ? '/έτος' : '/μήνα';
      });
    }

    monthlyBtn && monthlyBtn.addEventListener('click', () => setMode('monthly'));
    annualBtn && annualBtn.addEventListener('click', () => setMode('annual'));

    // Initial state
    setMode('monthly');
  }

  function initContactForm() {
    const form = document.querySelector(SELECTORS.contactForm);
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailEl = document.querySelector(SELECTORS.email);
      const email = (emailEl && emailEl.value || '').trim();
      if (!validateEmail(email)) {
        alert('Παρακαλούμε εισάγετε έγκυρο email.');
        return;
      }
      alert('Το μήνυμά σας εστάλη! Θα επικοινωνήσουμε μαζί σας σύντομα.');
      form.reset();
    });
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function getViewportWidth() {
    return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  }
})();
