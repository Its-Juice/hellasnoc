// main.js - Consolidated JavaScript for HellasNOC
// Enhanced with robust language persistence and improved documentation

/**
 * ====================
 * INITIALIZATION
 * ====================
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initLanguageSystem();
    initScrollAnimations();
    initPageSpecificFeatures();
});

/**
 * ====================
 * NAVIGATION FUNCTIONS
 * ====================
 */

/**
 * Initialize mobile navigation and dropdown menus
 */
function initNavigation() {
    // Mobile nav toggle
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
    const dropdownToggles = document.querySelectorAll('.dropdown > a, .products-dropdown > a');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            // Only prevent default on mobile and for dropdown toggles (not regular links)
            if (window.innerWidth < 768 && this.getAttribute('href') === '#') {
                e.preventDefault();
                this.parentElement.classList.toggle('active');
                
                // Close other dropdowns when opening this one
                document.querySelectorAll('.dropdown, .products-dropdown').forEach(dropdown => {
                    if (dropdown !== this.parentElement) {
                        dropdown.classList.remove('active');
                    }
                });
            }
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth < 768 && 
            !e.target.closest('.dropdown') && 
            !e.target.closest('.products-dropdown') &&
            !e.target.closest('.hamburger')) {
            
            document.querySelectorAll('.dropdown, .products-dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    // Desktop hover behavior for dropdowns
    initDesktopDropdowns();
}

/**
 * Initialize desktop dropdown hover behavior
 */
function initDesktopDropdowns() {
    const productsDropdown = document.querySelector('.products-dropdown');
    const productsDropdownContent = document.querySelector('.products-dropdown-content');
    
    if (productsDropdown && productsDropdownContent) {
        // Desktop hover behavior
        productsDropdown.addEventListener('mouseenter', function() {
            if (window.innerWidth >= 769) {
                this.classList.add('hover-active');
            }
        });
        
        productsDropdown.addEventListener('mouseleave', function(e) {
            if (window.innerWidth >= 769) {
                // Check if mouse is moving to dropdown content
                const relatedTarget = e.relatedTarget;
                if (relatedTarget && !productsDropdownContent.contains(relatedTarget)) {
                    this.classList.remove('hover-active');
                }
            }
        });
        
        productsDropdownContent.addEventListener('mouseenter', function() {
            if (window.innerWidth >= 769) {
                productsDropdown.classList.add('hover-active');
            }
        });
        
        productsDropdownContent.addEventListener('mouseleave', function(e) {
            if (window.innerWidth >= 769) {
                // Check if mouse is moving to dropdown trigger
                const relatedTarget = e.relatedTarget;
                if (relatedTarget && !productsDropdown.contains(relatedTarget)) {
                    productsDropdown.classList.remove('hover-active');
                }
            }
        });
    }
}

/**
 * ====================
 * LANGUAGE MANAGEMENT
 * ====================
 */

/**
 * Initialize the language system with persistence
 */
function initLanguageSystem() {
    // Set the language key for localStorage
    const LANGUAGE_KEY = 'hellasnoc-language';
    let currentLang = getStoredLanguage();
    
    // Initialize language on page load
    updateLanguage(currentLang);
    
    // Add event listeners to language buttons
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            if (lang !== currentLang) {
                setStoredLanguage(lang);
                currentLang = lang;
                updateLanguage(lang);
                
                // Show a brief loading indicator for better UX
                showLanguageLoadingIndicator();
                
                // Small delay to allow UI to update before potentially heavy translation work
                setTimeout(() => {
                    window.location.reload();
                }, 300);
            }
        });
    });
    
    // Update language on window resize
    window.addEventListener('resize', function() {
        updateLanguage(currentLang);
    });
}

/**
 * Retrieve stored language preference from localStorage
 * @returns {string} The language code (default: 'el')
 */
function getStoredLanguage() {
    try {
        return localStorage.getItem('hellasnoc-language') || 'el';
    } catch (e) {
        console.warn('LocalStorage not available, using default language');
        return 'el';
    }
}

/**
 * Store language preference in localStorage
 * @param {string} lang - The language code to store
 */
function setStoredLanguage(lang) {
    try {
        localStorage.setItem('hellasnoc-language', lang);
    } catch (e) {
        console.warn('Could not save language preference to localStorage');
    }
}

/**
 * Update the UI to reflect the current language
 * @param {string} lang - The language code to apply
 */
function updateLanguage(lang) {
    // Update buttons
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Update slider position
    const slider = document.querySelector('.language-slider');
    if (slider) {
        const activeBtn = document.querySelector(`.language-btn[data-lang="${lang}"]`);
        if (activeBtn) {
            const btnWidth = activeBtn.offsetWidth;
            const btnLeft = activeBtn.offsetLeft;
            
            slider.style.width = `${btnWidth}px`;
            slider.style.transform = `translateX(${btnLeft}px)`;
        }
    }

    // Update html lang attribute for accessibility
    document.documentElement.lang = lang;
    
    // Update all translatable elements if translations are available
    if (typeof translations !== 'undefined') {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
    }
}

/**
 * Show a brief loading indicator when changing languages
 */
function showLanguageLoadingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'language-loading-indicator';
    indicator.innerHTML = '<div class="loading-spinner"></div>';
    
    // Add styles if not already present
    if (!document.querySelector('#language-loading-styles')) {
        const styles = document.createElement('style');
        styles.id = 'language-loading-styles';
        styles.textContent = `
            .language-loading-indicator {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(10, 14, 23, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            }
            .loading-spinner {
                width: 50px;
                height: 50px;
                border: 5px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: var(--primary);
                animation: spin 1s ease-in-out infinite;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(indicator);
    
    // Remove after a short delay
    setTimeout(() => {
        if (document.body.contains(indicator)) {
            document.body.removeChild(indicator);
        }
    }, 1000);
}

/**
 * ====================
 * SCROLL ANIMATIONS
 * ====================
 */

/**
 * Initialize scroll animations for elements with animate-on-scroll class
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animatedElements.length > 0) {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
}

/**
 * ====================
 * PAGE-SPECIFIC FEATURES
 * ====================
 */

/**
 * Initialize features specific to certain pages
 */
function initPageSpecificFeatures() {
    // Contact form validation (only on contact page)
    initContactForm();
    
    // Services tabs functionality (only on services page)
    initServicesTabs();
    
    // Roadmap animation (only on services page)
    initRoadmapAnimation();
}

/**
 * Initialize contact form validation
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            
            // Get current language for error messages
            const currentLang = getStoredLanguage();
            
            if (!email.includes('@')) {
                alert(translations[currentLang]['invalid-email'] || 'Invalid email address.');
                return;
            }
            
            alert(translations[currentLang]['message-sent-alert'] || 'Your message has been sent!');
            this.reset();
        });
    }
}

/**
 * Initialize services tabs functionality
 */
function initServicesTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabBtns.length > 0 && tabContents.length > 0) {
        let currentTab = 'network';
        
        function switchTab(tabName) {
            if (tabName === currentTab) return;
            
            const currentTabContent = document.getElementById(`${currentTab}-tab`);
            const nextTabContent = document.getElementById(`${tabName}-tab`);
            
            const currentIndex = Array.from(tabBtns).findIndex(btn => btn.dataset.tab === currentTab);
            const nextIndex = Array.from(tabBtns).findIndex(btn => btn.dataset.tab === tabName);
            const direction = nextIndex > currentIndex ? 'right' : 'left';
            
            // Exit animation for current tab
            currentTabContent.classList.add(direction === 'right' ? 'slide-out-left' : 'slide-out-right');
            
            // Prepare next tab
            nextTabContent.classList.add('active');
            const cards = nextTabContent.querySelectorAll('.service-card');
            
            cards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = direction === 'right' ? 'translateX(100vw)' : 'translateX(-100vw)';
                card.style.transition = 'all 0.6s ease';
            });
            
            // Force reflow
            nextTabContent.offsetHeight;
            
            // Animate cards in with stagger from off-screen
            cards.forEach((card, i) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateX(0)';
                }, i * 150);
            });
            
            // Cleanup after animation
            setTimeout(() => {
                currentTabContent.classList.remove('active', 'slide-out-left', 'slide-out-right');
                cards.forEach(card => {
                    card.style.opacity = '';
                    card.style.transform = '';
                    card.style.transition = '';
                });
                currentTab = tabName;
            }, 800 + cards.length * 150);
            
            // Update tab buttons
            tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabName));
        }
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                switchTab(tabId);
            });
        });
    }
}

/**
 * Initialize roadmap animation
 */
function initRoadmapAnimation() {
    const roadmapSteps = document.querySelectorAll('.roadmap-step');
    const roadmapSection = document.querySelector('.roadmap-section');
    
    if (roadmapSteps.length > 0 && roadmapSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    roadmapSteps.forEach((step, index) => {
                        setTimeout(() => {
                            step.classList.add('animate');
                        }, index * 200);
                    });
                    observer.unobserve(roadmapSection);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(roadmapSection);
    }
}