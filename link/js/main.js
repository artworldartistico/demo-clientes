document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Sticky Header ---
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 2. Count-Up Animation (Intersection Observer) ---
    const counters = document.querySelectorAll('.counter');
    const animationDuration = 1800; // Duration in ms for all counters

    const animateCounter = (counter) => {
        const targetAttr = counter.getAttribute('data-target') || '0';
        const target = parseFloat(targetAttr);
        const hasDecimals = targetAttr.includes('.') || (target % 1 !== 0);
        const decimals = hasDecimals ? (targetAttr.split('.')[1]?.length || 1) : 0;
        
        let startTime = null;

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / animationDuration, 1);
            
            // Cubic ease-out for natural deceleration
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = target * easeProgress;

            if (decimals > 0) {
                counter.innerText = currentVal.toFixed(decimals);
            } else {
                counter.innerText = Math.floor(currentVal);
            }

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                counter.innerText = decimals > 0 ? target.toFixed(decimals) : target;
            }
        };

        requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // --- 3. FAQ Accordion ---
    const faqBtns = document.querySelectorAll('.faq-btn');

    faqBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Toggle active class on button
            this.classList.toggle('active');
            
            // Toggle content visibility
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
            
            // Optional: Close other open accordions
            faqBtns.forEach(otherBtn => {
                if (otherBtn !== this && otherBtn.classList.contains('active')) {
                    otherBtn.classList.remove('active');
                    otherBtn.nextElementSibling.style.maxHeight = null;
                }
            });
        });
    });

    // --- 4. Navigation: Internal Page Detection vs Scrollspy ---
    const headerEl = document.getElementById('main-header');
    const pathname = window.location.pathname;
    const currentPage = pathname.split('/').pop().toLowerCase();
    const isHomePage = !currentPage || currentPage === 'index.html' || currentPage === 'index.php';

    if (!isHomePage) {
        // En páginas internas (industrias.html, soluciones.html, nosotros.html, etc.):
        // Asignar y mantener fija la clase .active en el enlace del menú correspondiente
        const allNavLinks = document.querySelectorAll('.main-nav a');
        allNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            const linkFile = href.split('#')[0].split('?')[0].split('/').pop().toLowerCase();
            if (linkFile === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        // NOTA: No se inicializa ni se añade el listener del Scrollspy en páginas internas,
        // evitando que se borre el estado .active al cargar o hacer scroll.
    } else {
        // Únicamente en index.html o / (One Page): activar Scrollspy por anclas (#)
        const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
        const sections = Array.from(document.querySelectorAll('section[id], footer[id]'));

        const updateScrollspy = () => {
            const headerHeight = headerEl ? headerEl.offsetHeight : 80;
            const scrollPosition = window.scrollY + headerHeight + 50;

            let currentSectionId = '';

            // Detect if at the bottom of the page
            const isBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);

            if (isBottom) {
                const lastSection = sections[sections.length - 1];
                if (lastSection) {
                    currentSectionId = lastSection.getAttribute('id');
                }
            } else {
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    const sectionId = section.getAttribute('id');

                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        currentSectionId = sectionId;
                    }
                });
            }

            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                // If the section is 'contacto' or doesn't map to a main-nav link, remove active from all
                if (currentSectionId && currentSectionId !== 'contacto' && href === `#${currentSectionId}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        };

        window.addEventListener('scroll', () => {
            requestAnimationFrame(updateScrollspy);
        }, { passive: true });

        // Initial check on homepage
        updateScrollspy();
    }

    // Smooth Scrolling for anchor links (e.g. #hero, #contacto)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = headerEl ? headerEl.offsetHeight : 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight + 2;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Solo actualizar .active en el menú si estamos en index.html
                if (isHomePage) {
                    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
                    if (this.closest('.main-nav') && targetId !== '#contacto') {
                        navLinks.forEach(link => link.classList.remove('active'));
                        this.classList.add('active');
                    } else if (targetId === '#contacto') {
                        navLinks.forEach(link => link.classList.remove('active'));
                    }
                }
            }
        });
    });

    // --- 5. Mobile Menu Toggle ---
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const menuIcon = mobileMenuToggle ? mobileMenuToggle.querySelector('i') : null;

    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            
            // Icon swap logic
            if (mainNav.classList.contains('active')) {
                menuIcon.classList.remove('ph-list');
                menuIcon.classList.add('ph-x');
            } else {
                menuIcon.classList.remove('ph-x');
                menuIcon.classList.add('ph-list');
            }
        });

        // Close menu when a link is clicked
        const allNavLinks = document.querySelectorAll('.main-nav a');
        allNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    mainNav.classList.remove('active');
                    if (menuIcon) {
                        menuIcon.classList.remove('ph-x');
                        menuIcon.classList.add('ph-list');
                    }
                }
            });
        });
    }

    // =====================================================
    // --- 6. Industry Tabs Switcher ---
    // =====================================================
    const industryTabsBar = document.querySelector('.industry-tabs-bar');
    if (!industryTabsBar) return; // Only run on industrias.html

    const tabBtns = document.querySelectorAll('.industry-tab-btn');
    const industryPanels = document.querySelectorAll('.industry-panel');

    /**
     * Activates the tab and panel matching the given industryId.
     * @param {string} industryId - e.g. 'electronica', 'manufactura'
     * @param {boolean} scrollTop - whether to scroll to the tabs bar
     */
    const activateTab = (industryId, scrollTop = false) => {
        // Update button states
        tabBtns.forEach(btn => {
            const isTarget = btn.dataset.industryTarget === industryId;
            btn.classList.toggle('active', isTarget);
            btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
        });

        // Show / hide panels with fade animation
        industryPanels.forEach(panel => {
            if (panel.dataset.industryId === industryId) {
                panel.classList.remove('panel-hidden');
                // Trigger reflow for animation restart
                void panel.offsetWidth;
                panel.classList.add('panel-visible');
            } else {
                panel.classList.remove('panel-visible');
                panel.classList.add('panel-hidden');
            }
        });

        // Scroll active tab button into view (horizontal) within the bar
        const activeBtn = industryTabsBar.querySelector(`.industry-tab-btn[data-industry-target="${industryId}"]`);
        if (activeBtn) {
            activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }

        // Optionally scroll to tabs bar top
        if (scrollTop) {
            const headerHeight = headerEl ? headerEl.offsetHeight : 80;
            const barTop = industryTabsBar.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;
            window.scrollTo({ top: barTop, behavior: 'smooth' });
        }
    };

    // Click handlers for tab buttons
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.industryTarget;
            // Update URL hash without triggering a scroll
            history.pushState(null, '', `#${target}`);
            activateTab(target, false);
        });
    });

    // Read hash from URL on load (or default to first)
    const getHashTarget = () => {
        const hash = window.location.hash.replace('#', '');
        const validIds = Array.from(tabBtns).map(b => b.dataset.industryTarget);
        return validIds.includes(hash) ? hash : (validIds[0] || 'electronica');
    };

    // Handle hash changes (back/forward navigation)
    window.addEventListener('hashchange', () => {
        activateTab(getHashTarget(), false);
    });

    // Initial activation
    activateTab(getHashTarget(), false);
});
