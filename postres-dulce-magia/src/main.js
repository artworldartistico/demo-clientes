// Countdown Timer
function initCountdown() {
  // Set a countdown of 6 hours from now
  const targetTime = new Date().getTime() + 96 * 60 * 60 * 1000;

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetTime - now;

    if (distance < 0) {
      // Reset timer when it reaches zero
      location.reload();
      return;
    }

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
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

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    if (question) {
      question.addEventListener("click", () => {
        // Close all other items
        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.classList.remove("active");
          }
        });

        // Toggle current item
        item.classList.toggle("active");
      });
    }
  });
}

// Testimonial Slider - Infinito Verdadero
function initTestimonialSlider() {
  const slider = document.querySelector(".testimonial-slider");
  const track = document.querySelector(".testimonial-track");
  const dotsContainer = document.querySelector(".slider-dots");
  
  if (!slider || !track) return;

  // Obtener items originales
  const originalItems = Array.from(track.querySelectorAll(".testimonial-item"));
  const totalOriginalItems = originalItems.length;

  // Clonar items al inicio y al final para crear efecto infinito
  function cloneItems() {
    // Limpiar track
    track.innerHTML = '';
    
    // Clonar últimos items al inicio
    originalItems.slice(-3).forEach(item => {
      const clone = item.cloneNode(true);
      clone.classList.add('clone');
      track.appendChild(clone);
    });
    
    // Agregar items originales
    originalItems.forEach(item => {
      track.appendChild(item.cloneNode(true));
    });
    
    // Clonar primeros items al final
    originalItems.slice(0, 3).forEach(item => {
      const clone = item.cloneNode(true);
      clone.classList.add('clone');
      track.appendChild(clone);
    });
  }

  cloneItems();

  let currentIndex = 0;
  let autoScrollInterval = null;
  let isPaused = false;
  let pauseTimeout = null;
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;
  let isTransitioning = false;

  // Generar dots dinámicamente
  function generateDots() {
    if (!dotsContainer) return;
    
    dotsContainer.innerHTML = '';
    
    for (let i = 0; i < totalOriginalItems; i++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      
      dot.addEventListener('click', () => {
        scrollToIndex(i);
        pauseAndResume();
      });
      
      dotsContainer.appendChild(dot);
    }
  }

  // Función para obtener el ancho de un item
  function getItemWidth() {
    const items = track.querySelectorAll(".testimonial-item");
    if (items.length === 0) return 0;
    
    const item = items[0];
    const style = window.getComputedStyle(item);
    const marginRight = parseFloat(style.marginRight) || 0;
    return item.offsetWidth + marginRight;
  }

  // Función para hacer scroll a un índice específico
  function scrollToIndex(index, instant = false) {
    if (isTransitioning) return;
    
    const itemWidth = getItemWidth();
    // Agregar offset de 3 items clonados al inicio
    const scrollPosition = itemWidth * (index + 3);
    
    slider.scrollTo({
      left: scrollPosition,
      behavior: instant ? 'auto' : 'smooth'
    });
    
    currentIndex = index;
    updateDots();
  }

  // Función para avanzar al siguiente
  function scrollNext() {
    const itemWidth = getItemWidth();
    const currentScrollPosition = slider.scrollLeft;
    const targetScrollPosition = currentScrollPosition + itemWidth;  // ✅ SUMA
    
    slider.scrollTo({
      left: targetScrollPosition,  // Avanza hacia la DERECHA →
      behavior: 'smooth'
    });
  }

  // Función para ir al anterior
  function scrollPrev() {
    const itemWidth = getItemWidth();
    const currentScrollPosition = slider.scrollLeft;
    const targetScrollPosition = currentScrollPosition - itemWidth;  // ✅ RESTA
    
    slider.scrollTo({
      left: targetScrollPosition,  // Retrocede hacia la IZQUIERDA ←
      behavior: 'smooth'
    });
  }

  // Función para actualizar dots
  function updateDots() {
    const dots = document.querySelectorAll(".slider-dots .dot");
    if (dots.length === 0) return;
    
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  // Función para manejar el loop infinito
  function handleInfiniteLoop() {
    if (isTransitioning || isDragging) return;
    
    const itemWidth = getItemWidth();
    const scrollPosition = slider.scrollLeft;
    const totalItems = track.querySelectorAll(".testimonial-item").length;
    
    // Calcular índice actual incluyendo clones
    const absoluteIndex = Math.round(scrollPosition / itemWidth);
    
    // Si está en los clones del inicio (primeros 3)
    if (absoluteIndex < 3) {
      isTransitioning = true;
      const newPosition = itemWidth * (totalOriginalItems + absoluteIndex);
      slider.scrollTo({ left: newPosition, behavior: 'auto' });
      currentIndex = absoluteIndex;
      setTimeout(() => { isTransitioning = false; }, 50);
    }
    // Si está en los clones del final (últimos 3)
    else if (absoluteIndex >= totalOriginalItems + 3) {
      isTransitioning = true;
      const newPosition = itemWidth * (absoluteIndex - totalOriginalItems);
      slider.scrollTo({ left: newPosition, behavior: 'auto' });
      currentIndex = absoluteIndex - totalOriginalItems - 3;
      setTimeout(() => { isTransitioning = false; }, 50);
    }
    // En items normales
    else {
      currentIndex = absoluteIndex - 3;
    }
    
    updateDots();
  }

  // Auto-scroll
  function startAutoScroll() {
    stopAutoScroll();
    autoScrollInterval = setInterval(() => {
      scrollNext();
    }, 6000);
  }

  function stopAutoScroll() {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
    }
  }

  function pauseAndResume() {
    isPaused = true;
    stopAutoScroll();
    
    if (pauseTimeout) {
      clearTimeout(pauseTimeout);
    }
    
    pauseTimeout = setTimeout(() => {
      isPaused = false;
      startAutoScroll();
    }, 10000);
  }

  // Event listener para scroll
  let scrollTimeout;
  slider.addEventListener("scroll", () => {
    if (!isDragging) {
      pauseAndResume();
    }
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      handleInfiniteLoop();
    }, 150);
  });

  // Click en mitad izquierda/derecha
  slider.addEventListener("click", (e) => {
    if (isDragging) return;
    
    const clickX = e.clientX;
    const sliderRect = slider.getBoundingClientRect();
    const sliderMiddle = sliderRect.left + sliderRect.width / 2;
    
    if (clickX < sliderMiddle) {
      scrollPrev();
    } else {
      scrollNext();
      pauseAndResume();
    }
  });

  // DRAG - Mouse
  slider.addEventListener("mousedown", (e) => {
    isDragging = true;
    slider.style.cursor = "grabbing";
    slider.style.userSelect = "none";
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    pauseAndResume();
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 0.8; // ULTRA SUAVE
    slider.scrollLeft = scrollLeft + walk;
  });

  slider.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      slider.style.cursor = "grab";
      handleInfiniteLoop();
    }
  });

  slider.addEventListener("mouseleave", () => {
    if (isDragging) {
      isDragging = false;
      slider.style.cursor = "grab";
      handleInfiniteLoop();
    }
  });

  // DRAG - Touch
  let touchStartX = 0;
  let touchScrollLeft = 0;

  slider.addEventListener("touchstart", (e) => {
    isDragging = true;
    touchStartX = e.touches[0].pageX - slider.offsetLeft;
    touchScrollLeft = slider.scrollLeft;
    pauseAndResume();
  }, { passive: true });

  slider.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - slider.offsetLeft;
    const walk = (x - touchStartX) * 0.8; // ULTRA SUAVE
    slider.scrollLeft = touchScrollLeft + walk;
  }, { passive: true });

  slider.addEventListener("touchend", () => {
    if (isDragging) {
      isDragging = false;
      handleInfiniteLoop();
    }
  }, { passive: true });

  // Resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      scrollToIndex(currentIndex, true);
      generateDots();
    }, 200);
  });

  // Cursor
  slider.style.cursor = "grab";

  // Visibility change
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoScroll();
    } else if (!isPaused) {
      startAutoScroll();
    }
  });

  // Inicializar
  generateDots();
  scrollToIndex(0, true); // Posicionar en el primer item real
  updateDots();
  startAutoScroll();

  return {
    next: scrollNext,
    prev: scrollPrev,
    goTo: scrollToIndex,
    start: startAutoScroll,
    stop: stopAutoScroll,
    pause: pauseAndResume,
    regenerateDots: generateDots
  };
}

// Smooth scroll for CTA buttons
function initSmoothScroll() {
  const ctaButtons = document.querySelectorAll('a[href^="#"]');

  ctaButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const href = button.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });
}

// Mobile Menu Toggle
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const navLinksItems = document.querySelectorAll('.nav-links a');

  if (!mobileMenuBtn || !navLinks) return;

  // Toggle menu al hacer click en el botón
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Prevenir scroll cuando el menú está abierto (solo en móvil)
    if (navLinks.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Cerrar menú al hacer click en un link
  navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Cerrar menú al hacer click fuera
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      mobileMenuBtn.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Cerrar menú al redimensionar la ventana (si se cambia a desktop)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      mobileMenuBtn.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}


// Initialize all functionality when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  initFAQ();
  initTestimonialSlider();
  initSmoothScroll();
  initMobileMenu();  // ← DEBE ESTAR AQUÍ
});

