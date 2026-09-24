/**
 * QUICKCOOL — MASTER APPLICATION JAVASCRIPT
 * Handles header transitions, mobile navigation, hero slideshow (3s timer),
 * booking modals, form submissions, interactive FAQ accordions, and comparisons.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initHeroSlider();
  initBookingModals();
  initFaqAccordions();
  initFaqFilters();
  initBeforeAfterSlider();
  initAnimatedCounters();
});

/* ----------------------------------------------------
   1. STICKY HEADER TRANSITION
   ---------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 15) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
}

/* ----------------------------------------------------
   2. MOBILE NAVIGATION DRAWER
   ---------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.mobile-overlay');
  const closeBtn = document.querySelector('.drawer-close');
  const submenuTriggers = document.querySelectorAll('.mobile-has-submenu > a');

  if (!toggleBtn || !drawer || !overlay) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  submenuTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = trigger.parentElement;
      const submenu = parent.querySelector('.mobile-submenu');
      if (submenu) {
        submenu.classList.toggle('open');
        const arrow = trigger.querySelector('.submenu-arrow');
        if (arrow) arrow.style.transform = submenu.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0)';
      }
    });
  });
}

/* ----------------------------------------------------
   3. HERO SLIDESHOW (3-SECOND AUTO-ROTATION)
   ---------------------------------------------------- */
function initHeroSlider() {
  const bgSlider = document.querySelector('.hero-bg-slider') || document.querySelector('.slider-container');
  if (!bgSlider) return;

  const slides = bgSlider.querySelectorAll('.bg-slide, .slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  const dynamicBadge = document.getElementById('heroDynamicBadge');

  if (!slides.length) return;

  const badgeCaptions = [
    "⚡ India's #1 Rated AC Service Brand",
    "🔬 Advanced Digital Diagnostics & OEM Parts",
    "📐 Precision Spirit-Level AC Installation",
    "💧 Medical-Grade Foam Jet Wash Cleaning",
    "🤝 Background-Verified Certified HVAC Engineers"
  ];

  let currentSlide = 0;
  let slideInterval = null;
  const slideDuration = 3000; // 3 seconds per requirements

  const goToSlide = (index) => {
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');

    if (dynamicBadge && badgeCaptions[currentSlide]) {
      const textSpan = dynamicBadge.querySelector('.badge-text') || dynamicBadge;
      textSpan.textContent = badgeCaptions[currentSlide];
    }
  };

  const nextSlide = () => goToSlide(currentSlide + 1);
  const prevSlide = () => goToSlide(currentSlide - 1);

  const startAutoSlide = () => {
    stopAutoSlide();
    slideInterval = setInterval(nextSlide, slideDuration);
  };

  const stopAutoSlide = () => {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  };

  // Event Listeners for Controls
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); nextSlide(); startAutoSlide(); });
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); prevSlide(); startAutoSlide(); });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      startAutoSlide();
    });
  });

  // Pause on hover
  const heroSection = document.getElementById('heroSection') || bgSlider;
  heroSection.addEventListener('mouseenter', stopAutoSlide);
  heroSection.addEventListener('mouseleave', startAutoSlide);

  // Swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  heroSection.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoSlide();
  }, { passive: true });

  heroSection.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 45) nextSlide();
    if (touchEndX - touchStartX > 45) prevSlide();
    startAutoSlide();
  }, { passive: true });

  // Initial trigger
  goToSlide(0);
  startAutoSlide();
}

/* ----------------------------------------------------
   4. BOOKING MODALS & FORM SUBMISSIONS
   ---------------------------------------------------- */
function initBookingModals() {
  const modal = document.getElementById('bookingModal');
  const openButtons = document.querySelectorAll('[data-open-modal="booking"], .open-booking-modal');
  const closeButtons = document.querySelectorAll('.modal-close, [data-close-modal]');
  const problemCards = document.querySelectorAll('.problem-card');

  if (!modal) return;

  const openModal = (problemName = '') => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (problemName) {
      const problemField = modal.querySelector('select[name="service_type"], select[name="problem_type"]');
      if (problemField) {
        for (let i = 0; i < problemField.options.length; i++) {
          if (problemField.options[i].text.toLowerCase().includes(problemName.toLowerCase())) {
            problemField.selectedIndex = i;
            break;
          }
        }
      }
    }
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  problemCards.forEach(card => {
    card.addEventListener('click', () => {
      const probText = card.querySelector('.problem-name')?.innerText || '';
      openModal(probText);
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Handle all booking forms across site
  const bookingForms = document.querySelectorAll('.booking-form, #bookingForm');
  bookingForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg style="animation: spin 1s linear infinite; width:18px; height:18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
          </svg>
          Processing...
        `;
      }

      // Simulate instantaneous premium verification
      setTimeout(() => {
        const formContent = form.querySelector('.form-fields-container') || form;
        const successBox = form.closest('.modal-card, .booking-container')?.querySelector('.success-message-box') 
                        || document.querySelector('.modal-card .success-message-box');

        if (successBox) {
          form.style.display = 'none';
          successBox.style.display = 'block';
        } else {
          alert('Request Received! Thank you. Our QuickCool team will contact you shortly.');
          form.reset();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
          closeModal();
        }
      }, 700);
    });
  });
}

/* ----------------------------------------------------
   5. ACCORDION (FAQ)
   ---------------------------------------------------- */
function initFaqAccordions() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const isActive = item.classList.contains('active');

      // Optional: close other accordions in the same list
      const parentList = item.closest('.faq-list');
      if (parentList) {
        parentList.querySelectorAll('.faq-item').forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const answer = other.querySelector('.faq-answer');
            if (answer) answer.style.maxHeight = null;
          }
        });
      }

      if (isActive) {
        item.classList.remove('active');
        const answer = item.querySelector('.faq-answer');
        if (answer) answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        const answer = item.querySelector('.faq-answer');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ----------------------------------------------------
   6. FAQ CATEGORY FILTERS & SEARCH
   ---------------------------------------------------- */
function initFaqFilters() {
  const filterBtns = document.querySelectorAll('.faq-filter-btn');
  const faqItems = document.querySelectorAll('.faq-item');
  const searchInput = document.getElementById('faqSearchInput');

  if (!filterBtns.length && !searchInput) return;

  let currentCategory = 'all';
  let searchTerm = '';

  const applyFilters = () => {
    faqItems.forEach(item => {
      const cat = item.getAttribute('data-category') || '';
      const text = item.textContent.toLowerCase();

      const matchesCat = currentCategory === 'all' || cat.toLowerCase().includes(currentCategory.toLowerCase());
      const matchesSearch = !searchTerm || text.includes(searchTerm);

      if (matchesCat && matchesSearch) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }
}

/* ----------------------------------------------------
   7. BEFORE & AFTER SLIDER (AC CLEANING)
   ---------------------------------------------------- */
function initBeforeAfterSlider() {
  const container = document.querySelector('.comparison-container');
  if (!container) return;

  const overlayLayer = container.querySelector('.comp-overlay-layer');
  const handle = container.querySelector('.comp-slider-handle');

  if (!overlayLayer || !handle) return;

  let isDragging = false;

  const updatePosition = (clientX) => {
    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left;
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;

    const percentage = (x / rect.width) * 100;
    overlayLayer.style.width = percentage + '%';
    handle.style.left = percentage + '%';
  };

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    updatePosition(e.clientX);
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  });

  // Touch Support
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    updatePosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => { isDragging = false; });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    updatePosition(e.touches[0].clientX);
  }, { passive: true });
}

/* ----------------------------------------------------
   8. ANIMATED COUNTERS
   ---------------------------------------------------- */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const suffix = counter.getAttribute('data-suffix') || '';
        let start = 0;
        const duration = 1500;
        const stepTime = 20;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;

        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            counter.innerText = target + suffix;
            clearInterval(timer);
          } else {
            counter.innerText = Math.floor(start) + suffix;
          }
        }, stepTime);

        obs.unobserve(counter);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(counter => observer.observe(counter));
}
