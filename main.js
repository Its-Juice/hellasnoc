<<<<<<< HEAD
/**
 * HellasNOC Website - Modern JavaScript
 * Professional network and security services
 */

// ====================
// CONSTANTS & CONFIG
// ====================
const CONFIG = {
  mobileBreakpoint: 1024,
  languageKey: 'hellasnoc-language',
  animationDuration: 300,
  scrollOffset: 100
};

// ====================
// UTILITY FUNCTIONS
// ====================
const utils = {
  // Debounce function for performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function for scroll events
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Check if element is in viewport
  isInViewport(element, offset = 0) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= -offset &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // Get stored language preference
  getStoredLanguage() {
    return localStorage.getItem(CONFIG.languageKey) || 'el';
  },

  // Set stored language preference
  setStoredLanguage(lang) {
    localStorage.setItem(CONFIG.languageKey, lang);
  },

  // Validate email format
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
};

// ====================
// NAVIGATION MANAGER
// ====================
class NavigationManager {
  constructor() {
    this.mobileToggle = document.querySelector('.mobile-menu-toggle');
    this.navbarMenu = document.querySelector('.navbar-menu');
    this.dropdowns = document.querySelectorAll('.dropdown');
    this.isOpen = false;
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.handleResize();
  }

  bindEvents() {
    // Mobile menu toggle
    if (this.mobileToggle) {
      this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.navbarMenu.contains(e.target) && !this.mobileToggle.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Handle dropdown hover
    this.dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      const menu = dropdown.querySelector('.dropdown-menu');
      
      if (toggle && menu) {
        dropdown.addEventListener('mouseenter', () => this.openDropdown(dropdown));
        dropdown.addEventListener('mouseleave', () => this.closeDropdown(dropdown));
      }
    });

    // Handle window resize
    window.addEventListener('resize', utils.debounce(() => this.handleResize(), 250));
  }

  toggleMobileMenu() {
    this.isOpen = !this.isOpen;
    this.mobileToggle.setAttribute('aria-expanded', this.isOpen);
    this.navbarMenu.classList.toggle('active', this.isOpen);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = this.isOpen ? 'hidden' : '';
  }

  closeMobileMenu() {
    this.isOpen = false;
    this.mobileToggle.setAttribute('aria-expanded', 'false');
    this.navbarMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  openDropdown(dropdown) {
    if (window.innerWidth >= CONFIG.mobileBreakpoint) {
      dropdown.classList.add('active');
    }
  }

  closeDropdown(dropdown) {
    if (window.innerWidth >= CONFIG.mobileBreakpoint) {
      dropdown.classList.remove('active');
    }
  }

  handleResize() {
    if (window.innerWidth >= CONFIG.mobileBreakpoint) {
      this.closeMobileMenu();
    }
  }
}

// ====================
// LANGUAGE MANAGER
// ====================
class LanguageManager {
  constructor() {
    this.currentLang = utils.getStoredLanguage();
    this.languageButtons = document.querySelectorAll('.language-btn');
    this.translations = typeof translations !== 'undefined' ? translations : {};
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateLanguage(this.currentLang);
  }

  bindEvents() {
    this.languageButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = btn.dataset.lang;
        if (lang !== this.currentLang) {
          this.changeLanguage(lang);
        }
      });
    });
  }

  changeLanguage(lang) {
    this.currentLang = lang;
    utils.setStoredLanguage(lang);
    this.updateLanguage(lang);
    
    // Show loading state
    this.showLoadingState();
    
    // Reload page after short delay to apply translations
    setTimeout(() => {
      window.location.reload();
    }, CONFIG.animationDuration);
  }

  updateLanguage(lang) {
    // Update button states
    this.languageButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update document language
    document.documentElement.lang = lang;

    // Apply translations
    this.applyTranslations(lang);
  }

  applyTranslations(lang) {
    if (!this.translations[lang]) return;

    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.dataset.i18n;
      if (this.translations[lang][key]) {
        element.textContent = this.translations[lang][key];
      }
    });
  }

  showLoadingState() {
    document.body.classList.add('language-loading');
    setTimeout(() => {
      document.body.classList.remove('language-loading');
    }, 600);
  }
}

// ====================
// SCROLL ANIMATIONS
// ====================
class ScrollAnimations {
  constructor() {
    this.animatedElements = document.querySelectorAll('.service-card, .testimonial-card, .trust-item');
    this.observer = null;
    
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.setupIntersectionObserver();
    } else {
      // Fallback for older browsers
      this.animateOnScroll();
    }
  }

  setupIntersectionObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          this.observer.unobserve(entry.target);
        }
      });
    }, options);

    this.animatedElements.forEach(el => {
      this.observer.observe(el);
    });
  }

  animateOnScroll() {
    const checkElements = utils.throttle(() => {
      this.animatedElements.forEach(el => {
        if (utils.isInViewport(el, CONFIG.scrollOffset)) {
          el.classList.add('animate-fade-in-up');
        }
      });
    }, 100);

    window.addEventListener('scroll', checkElements);
    checkElements(); // Check on load
  }
}

// ====================
// FORM MANAGER
// ====================
class FormManager {
  constructor() {
    this.contactForm = document.getElementById('contactForm');
    this.currentLang = utils.getStoredLanguage();
    
    this.init();
  }

  init() {
    if (this.contactForm) {
      this.bindEvents();
    }
  }

  bindEvents() {
    this.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(this.contactForm);
    const email = formData.get('email');
    
    if (!utils.validateEmail(email)) {
      this.showMessage('invalid-email', 'error');
      return;
    }
    
    // Simulate form submission
    this.showMessage('message-sent-alert', 'success');
    this.contactForm.reset();
  }

  showMessage(key, type) {
    const message = this.getTranslation(key) || 'Your message has been sent!';
    const alertClass = type === 'error' ? 'alert-error' : 'alert-success';
    
    // Create and show alert
    const alert = document.createElement('div');
    alert.className = `alert ${alertClass}`;
    alert.textContent = message;
    alert.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: ${type === 'error' ? '#ef4444' : '#10b981'};
      color: white;
      border-radius: 0.5rem;
      z-index: 1000;
      animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
      alert.remove();
    }, 5000);
  }

  getTranslation(key) {
    return this.translations?.[this.currentLang]?.[key];
  }
}

// ====================
// SMOOTH SCROLLING
// ====================
class SmoothScrolling {
  constructor() {
    this.init();
  }

  init() {
    // Handle anchor links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          this.scrollToElement(targetElement);
        }
      }
    });
  }

  scrollToElement(element) {
    const headerHeight = 70;
    const targetPosition = element.offsetTop - headerHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

// ====================
// HEADER SCROLL EFFECT
// ====================
class HeaderScrollEffect {
  constructor() {
    this.header = document.querySelector('.header');
    this.lastScrollY = window.scrollY;
    
    this.init();
  }

  init() {
    if (this.header) {
      window.addEventListener('scroll', utils.throttle(() => this.handleScroll(), 100));
    }
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
    
    this.lastScrollY = currentScrollY;
  }
}

// ====================
// PRICING TOGGLE
// ====================
class PricingToggle {
  constructor() {
    this.toggleButtons = document.querySelectorAll('.toggle-btn');
    this.slider = document.querySelector('.toggle-slider');
    this.monthlyPrices = document.querySelectorAll('.price[data-billing="monthly"]');
    this.annualPrices = document.querySelectorAll('.price[data-billing="annual"]');
    this.savings = document.querySelectorAll('.savings');
    
    this.init();
  }

  init() {
    if (!this.toggleButtons.length || !this.slider) return;

    this.toggleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.updatePricing(btn.dataset.billing);
      });
    });

    // Initialize with monthly
    this.updatePricing('monthly');
  }

  updatePricing(billing) {
    // Update toggle buttons
    this.toggleButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.billing === billing);
    });

    // Update prices
    this.monthlyPrices.forEach(price => {
      price.classList.toggle('active', billing === 'monthly');
    });
    
    this.annualPrices.forEach(price => {
      price.classList.toggle('active', billing === 'annual');
    });

    // Update savings visibility
    this.savings.forEach(saving => {
      saving.classList.toggle('show', billing === 'annual');
    });
  }
}

// ====================
// INITIALIZATION
// ====================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  new NavigationManager();
  new LanguageManager();
  new ScrollAnimations();
  new FormManager();
  new SmoothScrolling();
  new HeaderScrollEffect();
  new PricingToggle();
  new AccessibilityManager();
  
  // Add loading complete class
  document.body.classList.add('loaded');
});

// ====================
// ERROR HANDLING
// ====================
window.addEventListener('error', (e) => {
  console.error('JavaScript error:', e.error);
});

// ====================
// PERFORMANCE MONITORING & OPTIMIZATIONS
// ====================
if ('performance' in window) {
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
=======
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
>>>>>>> 9b846f0e6eff4de07db4cc20a683fb459ad98d30
  });

<<<<<<< HEAD
// ====================
// PERFORMANCE OPTIMIZATIONS
// ====================
// Debounce function for better performance
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Optimize scroll events
const optimizedScrollHandler = throttle(() => {
  // Handle scroll events efficiently
}, 16); // ~60fps

// Optimize resize events
const optimizedResizeHandler = debounce(() => {
  // Handle resize events efficiently
}, 250);

// Add optimized event listeners
window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
window.addEventListener('resize', optimizedResizeHandler, { passive: true });

// Preload critical resources
function preloadCriticalResources() {
  const criticalImages = [
    'assets/img/HellasNOC-Logo-Transparent.png',
    'assets/home.jpg'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// Initialize preloading
preloadCriticalResources();

// ====================
// ACCESSIBILITY ENHANCEMENTS
// ====================
class AccessibilityManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupKeyboardNavigation();
    this.setupAriaLabels();
    this.setupFocusManagement();
    this.setupScreenReaderSupport();
  }

  setupKeyboardNavigation() {
    // Handle keyboard navigation for dropdowns
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close any open dropdowns
        const openDropdowns = document.querySelectorAll('.dropdown-menu[aria-expanded="true"]');
        openDropdowns.forEach(dropdown => {
          dropdown.setAttribute('aria-expanded', 'false');
          dropdown.style.display = 'none';
        });
      }
    });

    // Handle arrow keys for navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('dropdown-toggle')) {
          e.preventDefault();
          const dropdown = focusedElement.nextElementSibling;
          if (dropdown) {
            dropdown.style.display = 'block';
            dropdown.setAttribute('aria-expanded', 'true');
            const firstItem = dropdown.querySelector('.dropdown-item');
            if (firstItem) firstItem.focus();
          }
        }
      }
    });
  }

  setupAriaLabels() {
    // Add aria-labels to interactive elements
    const buttons = document.querySelectorAll('button:not([aria-label])');
    buttons.forEach(button => {
      if (!button.textContent.trim()) {
        button.setAttribute('aria-label', 'Button');
      }
    });

    // Add aria-labels to images without alt text
    const images = document.querySelectorAll('img:not([alt])');
    images.forEach(img => {
      img.setAttribute('alt', 'Image');
    });
  }

  setupFocusManagement() {
    // Trap focus in modals (if any)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const modal = document.querySelector('.modal[aria-hidden="false"]');
        if (modal) {
          const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }

  setupScreenReaderSupport() {
    // Announce dynamic content changes
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);

    // Function to announce messages
    window.announceToScreenReader = (message) => {
      announcer.textContent = message;
      setTimeout(() => {
        announcer.textContent = '';
      }, 1000);
    };
  }
}

// Initialize accessibility manager
new AccessibilityManager();
=======
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
>>>>>>> 9b846f0e6eff4de07db4cc20a683fb459ad98d30
