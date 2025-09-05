// main.js - Refactored JavaScript for HellasNOC

// ====================
// CONSTANTS
// ====================
const MOBILE_BREAKPOINT = 768;
const LANGUAGE_KEY = 'hellasnoc-language';

// ====================
// DOM READY ENTRY POINT
// ====================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initLanguageSystem();
    initLanguageToggle();
    initScrollAnimations();
    initPageSpecificFeatures();
});

// ====================
// NAVIGATION FUNCTIONS
// ====================

function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            const expanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', String(!expanded));
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }

    // Mobile dropdown toggle
    document.addEventListener('click', (e) => {
        // Use event delegation for dropdown toggles
        if (window.innerWidth < MOBILE_BREAKPOINT) {
            const toggle = e.target.closest('.dropdown > a, .products-dropdown > a');
            if (toggle && toggle.getAttribute('href') === '#') {
                e.preventDefault();
                toggle.parentElement.classList.toggle('active');
                document.querySelectorAll('.dropdown, .products-dropdown').forEach(dropdown => {
                    if (dropdown !== toggle.parentElement) {
                        dropdown.classList.remove('active');
                    }
                });
            } else if (
                !e.target.closest('.dropdown') &&
                !e.target.closest('.products-dropdown') &&
                !e.target.closest('.hamburger')
            ) {
                document.querySelectorAll('.dropdown, .products-dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        }
    });

    // Desktop hover behavior for dropdowns
    initDesktopDropdowns();
}

function initDesktopDropdowns() {
    const productsDropdown = document.querySelector('.products-dropdown');
    const productsDropdownContent = document.querySelector('.products-dropdown-content');

    if (productsDropdown && productsDropdownContent) {
        const handleEnter = () => {
            if (window.innerWidth >= MOBILE_BREAKPOINT + 1) {
                productsDropdown.classList.add('hover-active');
            }
        };
        const handleLeave = (e) => {
            if (window.innerWidth >= MOBILE_BREAKPOINT + 1) {
                const related = e.relatedTarget;
                if (related && !productsDropdownContent.contains(related)) {
                    productsDropdown.classList.remove('hover-active');
                }
            }
        };
        productsDropdown.addEventListener('mouseenter', handleEnter);
        productsDropdown.addEventListener('mouseleave', handleLeave);
        productsDropdownContent.addEventListener('mouseenter', handleEnter);
        productsDropdownContent.addEventListener('mouseleave', (e) => {
            if (window.innerWidth >= MOBILE_BREAKPOINT + 1) {
                const related = e.relatedTarget;
                if (related && !productsDropdown.contains(related)) {
                    productsDropdown.classList.remove('hover-active');
                }
            }
        });
    }
}

// ====================
// LANGUAGE MANAGEMENT
// ====================

function initLanguageSystem() {
    let currentLang = getStoredLanguage();
    updateLanguage(currentLang);

    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            if (lang !== currentLang) {
                setStoredLanguage(lang);
                currentLang = lang;
                updateLanguage(lang);
                showLanguageLoadingIndicator();
                setTimeout(() => window.location.reload(), 300);
            }
        });
    });

    window.addEventListener('resize', () => updateLanguage(currentLang));
}

function getStoredLanguage() {
    try {
        return localStorage.getItem(LANGUAGE_KEY) || 'el';
    } catch {
        console.warn('LocalStorage not available, using default language');
        return 'el';
    }
}

function setStoredLanguage(lang) {
    try {
        localStorage.setItem(LANGUAGE_KEY, lang);
    } catch {
        console.warn('Could not save language preference to localStorage');
    }
}

function updateLanguage(lang) {
    // Button active state
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Slider
    const slider = document.querySelector('.language-slider');
    if (slider) {
        const activeBtn = document.querySelector(`.language-btn[data-lang="${lang}"]`);
        if (activeBtn) {
            slider.style.width = `${activeBtn.offsetWidth}px`;
            slider.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
        }
    }

    // Set lang attribute for accessibility
    document.documentElement.lang = lang;

    // Translations
    if (typeof translations !== 'undefined') {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            el.textContent = translations[lang] && translations[lang][key] ? translations[lang][key] : el.textContent;
        });
    }
}

function showLanguageLoadingIndicator() {
    // Basic example: you may want to implement a spinner or overlay
    document.body.classList.add('language-loading');
    setTimeout(() => document.body.classList.remove('language-loading'), 600);
}

// ====================
// LANGUAGE TOGGLE (UI)
// ====================

function initLanguageToggle() {
    const languageSlider = document.querySelector('.language-slider');
    const languageButtons = document.querySelectorAll('.language-btn');

    if (!languageSlider || languageButtons.length === 0) return;
    languageSlider.classList.add('smooth');

    // Set initial position based on active button
    const activeButton = document.querySelector('.language-btn.active');
    if (activeButton) {
        const buttonIndex = Array.from(languageButtons).indexOf(activeButton);
        languageSlider.style.transform = `translateX(${buttonIndex * 100}%)`;
    }

    languageButtons.forEach((button, buttonIndex) => {
        button.addEventListener('click', () => {
            languageButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            languageSlider.style.transform = `translateX(${buttonIndex * 100}%)`;
            // Language switch logic handled by initLanguageSystem
        });
    });
}

// ====================
// SCROLL ANIMATIONS
// ====================

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length === 0) return;

    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

// ====================
// PAGE-SPECIFIC FEATURES
// ====================

function initPageSpecificFeatures() {
    initContactForm();
    initServicesTabs();
    initRoadmapAnimation();
}

// --- CONTACT FORM VALIDATION ---

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const currentLang = getStoredLanguage();

        if (!validateEmail(email)) {
            alert(translations[currentLang]?.['invalid-email'] || 'Invalid email address.');
            return;
        }
        alert(translations[currentLang]?.['message-sent-alert'] || 'Your message has been sent!');
        this.reset();
    });
}

function validateEmail(email) {
    // Robust email regex validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// --- SERVICES TABS FUNCTIONALITY ---

function initServicesTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    if (tabBtns.length === 0 || tabContents.length === 0) return;

    let currentTab = 'network';

    function switchTab(tabName) {
        if (tabName === currentTab) return;

        const currentTabContent = document.getElementById(`${currentTab}-tab`);
        const nextTabContent = document.getElementById(`${tabName}-tab`);
        if (!currentTabContent || !nextTabContent) return;

        const currentIndex = Array.from(tabBtns).findIndex(btn => btn.dataset.tab === currentTab);
        const nextIndex = Array.from(tabBtns).findIndex(btn => btn.dataset.tab === tabName);
        const direction = nextIndex > currentIndex ? 'right' : 'left';

        // Use CSS classes for transitions
        currentTabContent.classList.add(direction === 'right' ? 'slide-out-left' : 'slide-out-right');
        nextTabContent.classList.add('active', direction === 'right' ? 'slide-in-right' : 'slide-in-left');

        // Stagger animation for cards
        const cards = nextTabContent.querySelectorAll('.service-card');
        cards.forEach((card, i) => {
            card.classList.add('card-hidden');
            setTimeout(() => card.classList.remove('card-hidden'), 150 * i);
        });

        // Cleanup after animation
        setTimeout(() => {
            currentTabContent.classList.remove('active', 'slide-out-left', 'slide-out-right');
            nextTabContent.classList.remove('slide-in-right', 'slide-in-left');
            currentTab = tabName;
        }, 800 + cards.length * 150);

        // Update tab buttons
        tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabName));
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
}

// --- ROADMAP ANIMATION ---

function initRoadmapAnimation() {
    const roadmapSteps = document.querySelectorAll('.roadmap-step');
    const roadmapSection = document.querySelector('.roadmap-section');
    if (roadmapSteps.length === 0 || !roadmapSection) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                roadmapSteps.forEach((step, index) => {
                    setTimeout(() => step.classList.add('animate'), 200 * index);
                });
                obs.unobserve(roadmapSection);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(roadmapSection);
}