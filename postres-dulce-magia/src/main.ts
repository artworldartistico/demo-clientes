// Countdown Timer
function initCountdown() {
    // Set a countdown of 6 hours from now
    const targetTime = new Date().getTime() + 6 * 60 * 60 * 1000;
  
    function updateCountdown() {
      const now = new Date().getTime();
      const distance = targetTime - now;
  
      if (distance < 0) {
        // Reset timer when it reaches zero
        location.reload();
        return;
      }
  
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
      const hoursEl = document.getElementById("hours");
      const minutesEl = document.getElementById("minutes");
      const secondsEl = document.getElementById("seconds");
  
      if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, "0");
      if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, "0");
      if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, "0");
    }
  
    // Initial update
    updateCountdown();
  
    // Update every second
    setInterval(updateCountdown, 1000);
  }
  
  // FAQ Accordion
  function initFAQ() {
    const faqItems = document.querySelectorAll(".faq-item");
  
    for (const item of faqItems) {
      const question = item.querySelector(".faq-question");
  
      if (question) {
        question.addEventListener("click", () => {
          // Close all other items
          for (const otherItem of faqItems) {
            if (otherItem !== item) {
              otherItem.classList.remove("active");
            }
          }
  
          // Toggle current item
          item.classList.toggle("active");
        });
      }
    }
  }
  
  // Testimonial Slider Dots
  function initSliderDots() {
    const slider = document.querySelector(".testimonial-slider");
    const dots = document.querySelectorAll(".dot");
  
    if (slider && dots.length > 0) {
      slider.addEventListener("scroll", () => {
        const scrollPosition = slider.scrollLeft;
        const itemWidth = 295; // 280px + 15px gap
        const activeIndex = Math.round(scrollPosition / itemWidth);
  
        let index = 0;
        for (const dot of dots) {
          if (index === activeIndex) {
            dot.classList.add("active");
          } else {
            dot.classList.remove("active");
          }
          index++;
        }
      });
    }
  }
  
  // Smooth scroll for CTA buttons
  function initSmoothScroll() {
    const ctaButtons = document.querySelectorAll('a[href^="#"]');
  
    for (const button of ctaButtons) {
      button.addEventListener("click", (e) => {
        const href = button.getAttribute("href");
        if (href?.startsWith("#") && href.length > 1) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    }
  }
  
  // Initialize all functionality when DOM is ready
  document.addEventListener("DOMContentLoaded", () => {
    initCountdown();
    initFAQ();
    initSliderDots();
    initSmoothScroll();
  });
  