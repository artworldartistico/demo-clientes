document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
  
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const ariaExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', !ariaExpanded);
      });
    }
  
    // Accordion Logic
    const accordions = document.querySelectorAll('.accordion-header');
  
    accordions.forEach(acc => {
      acc.addEventListener('click', function() {
        const content = this.nextElementSibling;
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
  
        // Close other open accordion items (Optional: remove if you want multiple open)
        document.querySelectorAll('.accordion-header').forEach(item => {
          if (item !== this) {
            item.setAttribute('aria-expanded', 'false');
            item.nextElementSibling.style.maxHeight = null;
          }
        });
  
        // Toggle current
        this.setAttribute('aria-expanded', !isExpanded);
        if (!isExpanded) {
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          content.style.maxHeight = null;
        }
      });
    });
  
    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        // Close mobile menu if open
        if(navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
        }
  
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  });