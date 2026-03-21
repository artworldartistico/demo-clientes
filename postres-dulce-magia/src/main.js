// ============================================
// COUNTDOWN CON FECHA LÍMITE GLOBAL
// ============================================

function initCountdown() {
  // ⚙️ CONFIGURACIÓN - Cambia esta fecha según tu oferta
  // Formato: Año, Mes (0-11), Día, Hora (24h), Minuto, Segundo
  
  // OPCIÓN 1: Fecha límite específica (RECOMENDADO)
  const fechaLimite = new Date(2026, 1, 25, 16, 59, 59); // 28 de Febrero 2026, 23:59:59
  
  // OPCIÓN 2: O puedes usar 48 horas desde una fecha específica
  // const fechaInicio = new Date(2026, 1, 20, 12, 0, 0); // 20 de Febrero 2026, 12:00:00
  // const fechaLimite = new Date(fechaInicio.getTime() + (48 * 60 * 60 * 1000)); // +48 horas

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = fechaLimite.getTime() - now;

    // Si la oferta ya expiró
    if (distance < 0) {
      // Mostrar mensaje de oferta expirada
      const hoursEl = document.getElementById("hours");
      const minutesEl = document.getElementById("minutes");
      const secondsEl = document.getElementById("seconds");

      if (hoursEl) hoursEl.textContent = "00";
      if (minutesEl) minutesEl.textContent = "00";
      if (secondsEl) secondsEl.textContent = "00";

      // Opcional: Mostrar mensaje
      const countdownSection = document.querySelector('.countdown');
      if (countdownSection) {
        countdownSection.style.opacity = "0.5";
        // countdownSection.innerHTML = '<p style="color: red; font-size: 1.5rem;">¡Oferta Expirada!</p>';
      }

      return;
    }

    // Calcular el tiempo restante
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Convertir días a horas totales para mostrar formato "48 horas"
    const totalHours = (days * 24) + hours;

    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (hoursEl) hoursEl.textContent = totalHours.toString().padStart(2, "0");
    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, "0");
    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, "0");
  }

  // Actualizar inmediatamente
  updateCountdown();

  // Actualizar cada segundo
  setInterval(updateCountdown, 1000);

  // 📊 Mostrar información en consola (para verificar)
  console.log('⏰ Countdown configurado:');
  console.log('   Fecha límite:', fechaLimite.toLocaleString('es-ES'));
  console.log('   Tiempo restante:', Math.floor((fechaLimite.getTime() - new Date().getTime()) / (1000 * 60 * 60)), 'horas');
}

// ============================================
// VERSIÓN ALTERNATIVA: CONFIGURAR DURACIÓN
// ============================================

function initCountdownConDuracion() {
  // ⚙️ CONFIGURACIÓN - Define la duración de tu oferta
  const DURACION_OFERTA_HORAS = 48; // 48 horas de oferta

  // Fecha de inicio de la campaña (cámbiala a tu fecha real)
  const fechaInicio = new Date(2026, 1, 20, 12, 0, 0); // 20 de Febrero 2026, 12:00:00
  
  // Calcular fecha límite
  const fechaLimite = new Date(fechaInicio.getTime() + (DURACION_OFERTA_HORAS * 60 * 60 * 1000));

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = fechaLimite.getTime() - now;

    if (distance < 0) {
      const hoursEl = document.getElementById("hours");
      const minutesEl = document.getElementById("minutes");
      const secondsEl = document.getElementById("seconds");

      if (hoursEl) hoursEl.textContent = "00";
      if (minutesEl) minutesEl.textContent = "00";
      if (secondsEl) secondsEl.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const totalHours = (days * 24) + hours;

    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (hoursEl) hoursEl.textContent = totalHours.toString().padStart(2, "0");
    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, "0");
    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  console.log('⏰ Countdown configurado:');
  console.log('   Inicio:', fechaInicio.toLocaleString('es-ES'));
  console.log('   Duración:', DURACION_OFERTA_HORAS, 'horas');
  console.log('   Límite:', fechaLimite.toLocaleString('es-ES'));
  console.log('   Tiempo restante:', Math.floor((fechaLimite.getTime() - new Date().getTime()) / (1000 * 60 * 60)), 'horas');
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

  const originalItems = Array.from(track.children);
  const visibleCount = getVisibleCount();
  let currentIndex = visibleCount;

  let autoInterval;
  let pauseTimeout;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID;

  const AUTO_DELAY = 6000;
  const PAUSE_AFTER_INTERACTION = 10000;

  // ================================
  // CLONAR ELEMENTOS PARA LOOP REAL
  // ================================
  function cloneSlides() {
    const items = Array.from(track.children);
    items.forEach(item => item.remove());

    const clonesBefore = originalItems
      .slice(-visibleCount)
      .map(el => el.cloneNode(true));

    const clonesAfter = originalItems
      .slice(0, visibleCount)
      .map(el => el.cloneNode(true));

    clonesBefore.forEach(clone => track.appendChild(clone));
    originalItems.forEach(item => track.appendChild(item));
    clonesAfter.forEach(clone => track.appendChild(clone));
  }

  function getVisibleCount() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function getItemWidth() {
    return track.children[0].offsetWidth + 15;
  }

  function setPosition(animate = true) {
    const itemWidth = getItemWidth();
  
    if (!animate) {
      track.style.transition = "none";
    } else {
      track.style.transition = "transform 0.5s ease";
    }
  
    currentTranslate = -currentIndex * itemWidth;   // 🔥 SINCRONIZAMOS
    track.style.transform = `translateX(${currentTranslate}px)`;
  }

  function nextSlide() {
    currentIndex++;
    setPosition();
  }

  function prevSlide() {
    currentIndex--;
    setPosition();
  }

  function checkLoop() {
    const total = track.children.length;
    const originalLength = originalItems.length;
  
    // Pasó el último original (hacia adelante)
    if (currentIndex >= originalLength + visibleCount) {
      currentIndex = visibleCount;
      setPosition(false);
    }
  
    // Pasó antes del primer original (hacia atrás)
    if (currentIndex <= visibleCount - 1) {
      currentIndex = originalLength + visibleCount - 1;
      setPosition(false);
    }
  }

  track.addEventListener("transitionend", checkLoop);

  // ================================
  // AUTO PLAY
  // ================================
  function startAuto() {
    stopAuto();
    autoInterval = setInterval(nextSlide, AUTO_DELAY);
  }

  function stopAuto() {
    clearInterval(autoInterval);
  }

  function pauseAuto() {
    stopAuto();
    clearTimeout(pauseTimeout);
    pauseTimeout = setTimeout(startAuto, PAUSE_AFTER_INTERACTION);
  }

  // ================================
  // DRAG NATURAL
  // ================================
  function getPositionX(event) {
    return event.type.includes("mouse")
      ? event.pageX
      : event.touches[0].clientX;
  }

  function touchStart(event) {
    isDragging = true;
    startX = getPositionX(event);
    prevTranslate = -currentIndex * getItemWidth();
    animationID = requestAnimationFrame(animation);
    track.style.transition = "none";
    pauseAuto();
  }

  function touchMove(event) {
    if (!isDragging) return;
  
    const currentPosition = getPositionX(event);
    const diff = currentPosition - startX;
  
    currentTranslate = prevTranslate + diff;
  }

  function touchEnd() {
    cancelAnimationFrame(animationID);
    isDragging = false;
  
    const itemWidth = getItemWidth();
  
    // 🔥 Calcular índice basado en la posición real actual
    currentIndex = Math.round(Math.abs(currentTranslate) / itemWidth);
  
    setPosition(true);
  
    setTimeout(() => {
      checkLoop();
      updateDots();
    }, 510);
  
    pauseAuto();
  }

  function animation() {
    track.style.transform = `translateX(${currentTranslate}px)`;
    if (isDragging) requestAnimationFrame(animation);
  }

  // ================================
  // DOTS
  // ================================
  function createDots() {
    dotsContainer.innerHTML = "";
    originalItems.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active");

      dot.addEventListener("click", () => {
        currentIndex = i + visibleCount;
        setPosition();
        pauseAuto();
        updateDots();
      });

      dotsContainer.appendChild(dot);
    });
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll(".dot");
    dots.forEach(dot => dot.classList.remove("active"));

    const realIndex =
      (currentIndex - visibleCount + originalItems.length) %
      originalItems.length;

    if (dots[realIndex]) dots[realIndex].classList.add("active");
  }

  track.addEventListener("transitionend", updateDots);

  // ================================
  // INIT
  // ================================
  cloneSlides();
  createDots();
  setPosition(false);
  startAuto();

  track.addEventListener("mousedown", touchStart);
  track.addEventListener("touchstart", touchStart, { passive: true });

  window.addEventListener("mouseup", touchEnd);
  window.addEventListener("touchend", touchEnd);

  window.addEventListener("mousemove", touchMove);
  window.addEventListener("touchmove", touchMove, { passive: true });

  window.addEventListener("resize", () => {
    location.reload();
  });
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

