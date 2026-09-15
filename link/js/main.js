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

    // --- 4. Scrollspy & Smooth Scrolling for Nav Links ---
    const headerEl = document.getElementById('main-header');
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

    // Initial check
    updateScrollspy();

    // Smooth Scrolling for anchor links
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

                // Update active class immediately on click
                if (this.closest('.main-nav') && targetId !== '#contacto') {
                    navLinks.forEach(link => link.classList.remove('active'));
                    this.classList.add('active');
                } else if (targetId === '#contacto') {
                    navLinks.forEach(link => link.classList.remove('active'));
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
});
