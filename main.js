// main.js - Consolidated JavaScript for HellasNOC

document.addEventListener('DOMContentLoaded', function() {
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
    
    // Mobile dropdown toggle - FIXED VERSION
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
    
    // Close dropdown when clicking outside - FIXED VERSION
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

    
    // Scroll animation functionality
    function initScrollAnimation() {
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
    
    initScrollAnimation();
    
    // Contact form validation (only on contact page)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            if (!email.includes('@')) {
                alert(translations[currentLang]['invalid-email'] || 'Invalid email address.');
                return;
            }
            alert(translations[currentLang]['message-sent-alert']);
            this.reset();
        });
    }
    
    // Services tabs functionality (only on services page)
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
    
    // Roadmap animation (only on services page)
    function animateRoadmap() {
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
    
    animateRoadmap();
    
    // Fixed Language switcher functionality
    let currentLang = localStorage.getItem('language') || 'el';
    
    function updateLanguage(lang) {
        // Update buttons
        document.querySelectorAll('.language-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Update slider position - fixed to account for padding
        const slider = document.querySelector('.language-slider');
        if (slider) {
            // Calculate the width and position based on the active button
            const activeBtn = document.querySelector(`.language-btn[data-lang="${lang}"]`);
            if (activeBtn) {
                const btnWidth = activeBtn.offsetWidth;
                const btnLeft = activeBtn.offsetLeft;
                
                slider.style.width = `${btnWidth}px`;
                slider.style.transform = `translateX(${btnLeft}px)`;
            }
        }

        // Update html lang attribute
        document.documentElement.lang = lang;
        
        // Update all translatable elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
        
        currentLang = lang;
    }
    
    // Initialize language
    updateLanguage(currentLang);
    
    // Add event listeners to language buttons
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            if (lang !== currentLang) {
                localStorage.setItem('language', lang);
                updateLanguage(lang);
            }
        });
    });
    
    // Update language switcher on window resize to handle responsive changes
    window.addEventListener('resize', function() {
        updateLanguage(currentLang);
    });
});