// ====================
// HELLASNOC 2025 - MODERN JAVASCRIPT
// Complete Redesign with Modern Features
// ====================

// ====================
// CONSTANTS & CONFIG
// ====================
const CONFIG = {
  mobileBreakpoint: 768,
  animationDuration: 300,
  scrollOffset: 100,
  languageKey: 'hellasnoc-language',
  defaultLanguage: 'el'
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
    try {
      return localStorage.getItem(CONFIG.languageKey) || CONFIG.defaultLanguage;
    } catch (error) {
      console.warn('LocalStorage not available, using default language');
      return CONFIG.defaultLanguage;
    }
  },

  // Set stored language preference
  setStoredLanguage(lang) {
    try {
      localStorage.setItem(CONFIG.languageKey, lang);
    } catch (error) {
      console.warn('Could not save language preference to localStorage');
    }
  },

  // Validate email address
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Format phone number
  formatPhoneNumber(phone) {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
  }
};

// ====================
// ANIMATION MANAGER
// ====================
class AnimationManager {
  constructor() {
    this.observers = new Map();
    this.init();
  }

  init() {
    this.setupScrollReveal();
    this.setupIntersectionObserver();
  }

  setupScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  setupIntersectionObserver() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    if (animatedElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const animation = entry.target.dataset.animate;
          entry.target.classList.add(animation);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    animatedElements.forEach(el => observer.observe(el));
  }

  // Animate counter numbers
  animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      element.textContent = Math.floor(start);
      
      if (start >= target) {
        element.textContent = target;
        clearInterval(timer);
      }
    }, 16);
  }
}

// ====================
// NAVIGATION MANAGER
// ====================
class NavigationManager {
  constructor() {
    this.isMenuOpen = false;
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupDropdowns();
    this.setupActiveLinks();
    this.setupSmoothScroll();
  }

  setupMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.mobile-menu');
    
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.mobile-menu');
    
    this.isMenuOpen = !this.isMenuOpen;
    
    toggle.classList.toggle('active', this.isMenuOpen);
    menu.classList.toggle('active', this.isMenuOpen);
    
    // Update aria attributes
    toggle.setAttribute('aria-expanded', this.isMenuOpen);
    menu.setAttribute('aria-hidden', !this.isMenuOpen);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  closeMobileMenu() {
    if (!this.isMenuOpen) return;
    
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.mobile-menu');
    
    this.isMenuOpen = false;
    toggle.classList.remove('active');
    menu.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  setupDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.nav-link');
      const menu = dropdown.querySelector('.dropdown-menu');
      
      if (!trigger || !menu) return;

      // Desktop hover behavior
      dropdown.addEventListener('mouseenter', () => {
        if (window.innerWidth > CONFIG.mobileBreakpoint) {
          menu.style.display = 'block';
          setTimeout(() => menu.classList.add('active'), 10);
        }
      });

      dropdown.addEventListener('mouseleave', () => {
        if (window.innerWidth > CONFIG.mobileBreakpoint) {
          menu.classList.remove('active');
          setTimeout(() => menu.style.display = 'none', 300);
        }
      });

      // Mobile click behavior
      trigger.addEventListener('click', (e) => {
        if (window.innerWidth <= CONFIG.mobileBreakpoint) {
          e.preventDefault();
          menu.classList.toggle('active');
        }
      });
    });
  }

  setupActiveLinks() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && currentPath.includes(href.replace('.html', ''))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Close mobile menu if open
          this.closeMobileMenu();
        }
      });
    });
  }
}

// ====================
// LANGUAGE MANAGER
// ====================
class LanguageManager {
  constructor() {
    this.currentLanguage = CONFIG.defaultLanguage;
    this.init();
  }

  init() {
    this.currentLanguage = utils.getStoredLanguage();
    this.setupLanguageSwitcher();
    this.updateLanguage(this.currentLanguage);
  }

  setupLanguageSwitcher() {
    const languageButtons = document.querySelectorAll('.language-btn');
    
    languageButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        if (lang !== this.currentLanguage) {
          this.switchLanguage(lang);
        }
      });
    });
  }

  switchLanguage(lang) {
    this.currentLanguage = lang;
    utils.setStoredLanguage(lang);
    this.updateLanguage(lang);
    
    // Show loading indicator
    this.showLoadingIndicator();
    
    // Reload page after a short delay to show the transition
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }

  updateLanguage(lang) {
    // Update document language
    document.documentElement.lang = lang;
    
    // Update active language button
    document.querySelectorAll('.language-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Update translations if available
    if (typeof translations !== 'undefined') {
      this.updateTranslations(lang);
    }
  }

  updateTranslations(lang) {
    const translationData = translations[lang] || {};
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.dataset.i18n;
      const translation = translationData[key];
      
      if (translation) {
        // Handle different element types
        if (element.tagName === 'INPUT' && element.type === 'text') {
          element.placeholder = translation;
        } else if (element.tagName === 'INPUT' && element.type === 'submit') {
          element.value = translation;
        } else {
          element.textContent = translation;
        }
      }
    });
  }

  showLoadingIndicator() {
    // Create loading overlay
    const overlay = document.createElement('div');
    overlay.className = 'language-loading-overlay';
    overlay.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>
    `;
    
    // Add styles
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;
    
    document.body.appendChild(overlay);
    
    // Remove after page reload
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, 2000);
  }
}

// ====================
// FORM MANAGER
// ====================
class FormManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupContactForm();
    this.setupFormValidation();
  }

  setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleContactFormSubmit(contactForm);
    });
  }

  setupFormValidation() {
    const inputs = document.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });
      
      input.addEventListener('input', () => {
        this.clearFieldError(input);
      });
    });
  }

  handleContactFormSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!this.validateForm(form)) {
      return;
    }
    
    // Show loading state
    this.setFormLoading(form, true);
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      this.setFormLoading(form, false);
      this.showSuccessMessage();
      form.reset();
    }, 2000);
  }

  validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }
    
    // Email validation
    if (type === 'email' && value && !utils.validateEmail(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (type === 'tel' && value && !/^[\d\s\-\+\(\)]+$/.test(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid phone number';
    }
    
    if (!isValid) {
      this.showFieldError(field, errorMessage);
    } else {
      this.clearFieldError(field);
    }
    
    return isValid;
  }

  showFieldError(field, message) {
    this.clearFieldError(field);
    
    field.classList.add('error');
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
  }

  clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  setFormLoading(form, isLoading) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    if (isLoading) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  showSuccessMessage() {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-check-circle"></i>
        <span>Message sent successfully!</span>
      </div>
    `;
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// ====================
// PERFORMANCE MANAGER
// ====================
class PerformanceManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupLazyLoading();
    this.setupPreloading();
    this.optimizeImages();
  }

  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  setupPreloading() {
    // Preload critical resources
    const criticalImages = [
      'assets/img/HellasNOC-Logo-Transparent.png'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  optimizeImages() {
    // Add loading="lazy" to non-critical images
    document.querySelectorAll('img:not([loading])').forEach(img => {
      if (!img.closest('.hero')) {
        img.loading = 'lazy';
      }
    });
  }
}

// ====================
// THEME MANAGER
// ====================
class ThemeManager {
  constructor() {
    this.currentTheme = 'dark';
    this.init();
  }

  init() {
    this.setupThemeToggle();
    this.applyTheme(this.currentTheme);
  }

  setupThemeToggle() {
    // This would be implemented if we add a theme toggle
    // For now, we only support dark theme
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
  }
}

// ====================
// MAIN APPLICATION
// ====================
class HellasNOCApp {
  constructor() {
    this.managers = {};
    this.init();
  }

  init() {
    // Initialize all managers
    this.managers.animation = new AnimationManager();
    this.managers.navigation = new NavigationManager();
    this.managers.language = new LanguageManager();
    this.managers.form = new FormManager();
    this.managers.performance = new PerformanceManager();
    this.managers.theme = new ThemeManager();

    // Setup global event listeners
    this.setupGlobalEvents();
    
    // Initialize page-specific features
    this.initPageFeatures();
  }

  setupGlobalEvents() {
    // Handle window resize
    window.addEventListener('resize', utils.debounce(() => {
      this.handleResize();
    }, 250));

    // Handle scroll events
    window.addEventListener('scroll', utils.throttle(() => {
      this.handleScroll();
    }, 16));

    // Handle page visibility change
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    });
  }

  handleResize() {
    // Close mobile menu on desktop
    if (window.innerWidth > CONFIG.mobileBreakpoint) {
      this.managers.navigation.closeMobileMenu();
    }
  }

  handleScroll() {
    // Update header on scroll
    const header = document.querySelector('.header');
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }
  }

  handleVisibilityChange() {
    // Pause/resume animations when page is hidden/visible
    const isVisible = !document.hidden;
    document.body.classList.toggle('page-visible', isVisible);
  }

  initPageFeatures() {
    // Initialize page-specific features based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch (currentPage) {
      case 'index.html':
        this.initHomePage();
        break;
      case 'services.html':
        this.initServicesPage();
        break;
      case 'contact.html':
        this.initContactPage();
        break;
      default:
        this.initGenericPage();
    }
  }

  initHomePage() {
    // Initialize home page specific features
    this.setupHeroAnimations();
    this.setupStatsCounters();
  }

  initServicesPage() {
    // Initialize services page specific features
    this.setupServiceTabs();
  }

  initContactPage() {
    // Initialize contact page specific features
    this.setupContactForm();
  }

  initGenericPage() {
    // Initialize generic page features
  }

  setupHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroActions = document.querySelector('.hero-actions');

    if (heroTitle) {
      setTimeout(() => heroTitle.classList.add('animate-fade-in-up'), 100);
    }
    if (heroSubtitle) {
      setTimeout(() => heroSubtitle.classList.add('animate-fade-in-up'), 300);
    }
    if (heroActions) {
      setTimeout(() => heroActions.classList.add('animate-fade-in-up'), 500);
    }
  }

  setupStatsCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const text = element.textContent;
          const number = parseInt(text.replace(/\D/g, ''));
          
          if (number) {
            this.managers.animation.animateCounter(element, number);
          }
          
          observer.unobserve(element);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
  }

  setupServiceTabs() {
    // This would be implemented for the services page
  }

  setupContactForm() {
    // This is already handled by FormManager
  }
}

// ====================
// INITIALIZATION
// ====================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the application
  window.hellasNOCApp = new HellasNOCApp();
  
  // Add loading complete class
  document.body.classList.add('loaded');
  
  // Log initialization
  console.log('🚀 HellasNOC 2025 - Application initialized successfully');
});

// ====================
// ERROR HANDLING
// ====================
window.addEventListener('error', (event) => {
  console.error('Application error:', event.error);
  // In production, you might want to send this to an error tracking service
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // In production, you might want to send this to an error tracking service
});

// ====================
// EXPORT FOR TESTING
// ====================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    HellasNOCApp,
    AnimationManager,
    NavigationManager,
    LanguageManager,
    FormManager,
    PerformanceManager,
    ThemeManager,
    utils
  };
}