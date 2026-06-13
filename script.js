b/* ═══════════════════════════════════════════════════════════════
   LUCAS & ANA — SCRIPT.JS
   Clean Code | Performance | Accessible
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────────────────────
   ★  CONFIGURAÇÃO — ALTERE AQUI A DATA DO RELACIONAMENTO
   ────────────────────────────────────────────────────────────── */
const RELATIONSHIP_START = new Date('2024-06-15'); // Ano-Mês-Dia

/* ──────────────────────────────────────────────────────────────
   GALERIA — IMAGENS (substitua pelos caminhos reais)
   ────────────────────────────────────────────────────────────── */
const GALLERY_IMAGES = [
  { src: 'images/galeria-01.svg', alt: 'Momento especial 1' },
  { src: 'images/galeria-02.svg', alt: 'Momento especial 2' },
  { src: 'images/galeria-03.svg', alt: 'Momento especial 3' },
  { src: 'images/galeria-04.svg', alt: 'Momento especial 4' },
  { src: 'images/galeria-05.svg', alt: 'Momento especial 5' },
  { src: 'images/galeria-06.svg', alt: 'Momento especial 6' },
];

/* ═══════════════════════════════════════════════════════════════
   MÓDULO: NAVEGAÇÃO
   ═══════════════════════════════════════════════════════════════ */
const Nav = (() => {
  const header   = document.querySelector('.nav-header');
  const toggle   = document.querySelector('.nav-toggle');
  const menu     = document.querySelector('.nav-menu');
  const links    = document.querySelectorAll('.nav-link');

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
    highlightActive();
  }

  function highlightActive() {
    const scrollY = window.scrollY + 100;

    links.forEach(link => {
      const id = link.getAttribute('data-section');
      if (!id) return;
      const section = document.getElementById(id);
      if (!section) return;

      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;

      link.classList.toggle('active', scrollY >= top && scrollY < bottom);
    });
  }

  function toggleMenu() {
    const isOpen = menu.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function init() {
    if (!header) return;

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    toggle?.addEventListener('click', toggleMenu);

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          closeMenu();
          const target = document.querySelector(href);
          if (target) {
            const offset = parseInt(getComputedStyle(document.documentElement)
              .getPropertyValue('--nav-h'), 10) || 68;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }
      });
    });

    // Close menu on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (menu.classList.contains('is-open') &&
          !menu.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
      }
    });
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════════════════
   MÓDULO: PARALLAX HERO
   ═══════════════════════════════════════════════════════════════ */
const HeroParallax = (() => {
  const heroImg = document.querySelector('.hero-img');
  let ticking = false;

  function update() {
    if (!heroImg) return;
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight * 1.2) {
      heroImg.style.transform = `translateY(${scrollY * 0.28}px) scale(1.05)`;
    }
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  function init() {
    if (!heroImg) return;
    const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!motionOk) return;

    heroImg.style.transform = 'translateY(0) scale(1.05)';
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════════════════
   MÓDULO: INTERSECTION OBSERVER — ANIMAÇÕES
   ═══════════════════════════════════════════════════════════════ */
const AnimObserver = (() => {
  const SELECTORS = [
    '.animate-fade-up',
    '.animate-fade-left',
    '.animate-fade-right',
  ].join(', ');

  function init() {
    const elements = document.querySelectorAll(SELECTORS);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    );

    elements.forEach(el => observer.observe(el));
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════════════════
   MÓDULO: CONTADOR DE TEMPO JUNTOS
   ═══════════════════════════════════════════════════════════════ */
const Counter = (() => {
  const elYears  = document.getElementById('counter-years');
  const elMonths = document.getElementById('counter-months');
  const elDays   = document.getElementById('counter-days');
  const elPhrase = document.getElementById('counter-phrase');

  function calcTime() {
    const now   = new Date();
    const start = new Date(RELATIONSHIP_START);

    let years  = now.getFullYear() - start.getFullYear();
    let months = now.getMonth()    - start.getMonth();
    let days   = now.getDate()     - start.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years  -= 1;
      months += 12;
    }

    return { years, months, days };
  }

  function animCount(el, target, duration = 1600) {
    if (!el) return;
    const start    = performance.now();
    const startVal = 0;

    function step(ts) {
      const elapsed  = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(startVal + (target - startVal) * ease);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function buildPhrase(y, m, d) {
    const parts = [];
    if (y > 0) parts.push(`${y} ${y === 1 ? 'ano' : 'anos'}`);
    if (m > 0) parts.push(`${m} ${m === 1 ? 'mês' : 'meses'}`);
    if (d > 0) parts.push(`${d} ${d === 1 ? 'dia' : 'dias'}`);

    if (!parts.length) return 'Juntos desde hoje ❤️';
    if (parts.length === 1) return `Juntos há ${parts[0]} ❤️`;
    const last = parts.pop();
    return `Juntos há ${parts.join(', ')} e ${last} ❤️`;
  }

  function init() {
    const section = document.getElementById('contador');
    if (!section || !elYears) return;

    let animated = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animated) {
          animated = true;
          const { years, months, days } = calcTime();
          animCount(elYears,  years,  1400);
          animCount(elMonths, months, 1600);
          animCount(elDays,   days,   1800);
          if (elPhrase) elPhrase.textContent = buildPhrase(years, months, days);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════════════════
   MÓDULO: GALERIA MODAL
   ═══════════════════════════════════════════════════════════════ */
const GalleryModal = (() => {
  const modal      = document.getElementById('gallery-modal');
  const modalImg   = document.getElementById('modal-img');
  const modalCount = document.getElementById('modal-counter');
  const btnClose   = modal?.querySelector('.modal-close');
  const btnPrev    = modal?.querySelector('.modal-prev');
  const btnNext    = modal?.querySelector('.modal-next');
  const items      = document.querySelectorAll('.gallery-item');

  let current = 0;
  let startX  = 0;

  function open(index) {
    if (!modal || !GALLERY_IMAGES[index]) return;
    current = index;
    show(current);
    modal.removeAttribute('hidden');
    modal.focus();
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (!modal) return;
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    if (items[current]) items[current].focus();
  }

  function show(index) {
    const img = GALLERY_IMAGES[index];
    if (!img || !modalImg) return;
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    if (modalCount) {
      modalCount.textContent = `${index + 1} / ${GALLERY_IMAGES.length}`;
    }
  }

  function prev() {
    current = (current - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
    show(current);
  }

  function next() {
    current = (current + 1) % GALLERY_IMAGES.length;
    show(current);
  }

  function init() {
    if (!modal) return;

    items.forEach((item, i) => {
      item.addEventListener('click', () => open(i));
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(i);
        }
      });
    });

    btnClose?.addEventListener('click', close);
    btnPrev?.addEventListener('click', prev);
    btnNext?.addEventListener('click', next);

    modal.addEventListener('click', e => {
      if (e.target === modal) close();
    });

    document.addEventListener('keydown', e => {
      if (modal.hasAttribute('hidden')) return;
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    });

    // Touch / swipe
    modal.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    modal.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? next() : prev();
      }
    });
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════════════════
   MÓDULO: CARROSSEL
   ═══════════════════════════════════════════════════════════════ */
const Carousel = (() => {
  const track   = document.getElementById('carousel-track');
  const btnPrev = document.getElementById('carousel-prev');
  const btnNext = document.getElementById('carousel-next');
  const dotsEl  = document.getElementById('carousel-dots');

  let current  = 0;
  let total    = 0;
  let startX   = 0;
  let isDrag   = false;
  let autoId   = null;

  function goto(index) {
    if (!track) return;
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
  }

  function updateDots() {
    if (!dotsEl) return;
    dotsEl.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
      dot.setAttribute('aria-selected', String(i === current));
    });
  }

  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className   = 'carousel-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Foto ${i + 1} de ${total}`);
      dot.setAttribute('aria-selected', String(i === 0));
      dot.addEventListener('click', () => {
        goto(i);
        resetAuto();
      });
      dotsEl.appendChild(dot);
    }
    updateDots();
  }

  function resetAuto() {
    clearInterval(autoId);
    autoId = setInterval(() => goto(current + 1), 5000);
  }

  function init() {
    if (!track) return;

    const slides = track.querySelectorAll('.carousel-slide');
    total = slides.length;
    if (total < 2) return;

    buildDots();

    btnPrev?.addEventListener('click', () => {
      goto(current - 1);
      resetAuto();
    });

    btnNext?.addEventListener('click', () => {
      goto(current + 1);
      resetAuto();
    });

    // Keyboard
    document.addEventListener('keydown', e => {
      const carousel = document.querySelector('.carousel');
      if (!carousel) return;
      const rect = carousel.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowLeft')  { goto(current - 1); resetAuto(); }
      if (e.key === 'ArrowRight') { goto(current + 1); resetAuto(); }
    });

    // Touch swipe
    track.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      isDrag = true;
    }, { passive: true });

    track.addEventListener('touchend', e => {
      if (!isDrag) return;
      isDrag = false;
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? goto(current + 1) : goto(current - 1);
        resetAuto();
      }
    });

    // Mouse drag
    track.addEventListener('mousedown', e => {
      startX = e.clientX;
      isDrag = true;
    });

    track.addEventListener('mouseup', e => {
      if (!isDrag) return;
      isDrag = false;
      const diff = startX - e.clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? goto(current + 1) : goto(current - 1);
        resetAuto();
      }
    });

    track.addEventListener('mouseleave', () => { isDrag = false; });
    track.addEventListener('dragstart', e => e.preventDefault());

    resetAuto();

    // Pause on hover
    const wrapper = document.querySelector('.carousel-wrapper');
    wrapper?.addEventListener('mouseenter', () => clearInterval(autoId));
    wrapper?.addEventListener('mouseleave', resetAuto);

    // Pause when page hidden
    document.addEventListener('visibilitychange', () => {
      document.hidden ? clearInterval(autoId) : resetAuto();
    });
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════════════════
   MÓDULO: LAZY LOADING FALLBACK
   ═══════════════════════════════════════════════════════════════ */
const LazyLoad = (() => {
  function init() {
    // Native loading="lazy" is supported by all modern browsers
    // This fallback handles very old environments gracefully
    if ('loading' in HTMLImageElement.prototype) return;

    const images = document.querySelectorAll('img[loading="lazy"]');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '300px' });

    images.forEach(img => observer.observe(img));
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════════════════
   INICIALIZAÇÃO
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  Nav.init();
  HeroParallax.init();
  AnimObserver.init();
  Counter.init();
  GalleryModal.init();
  Carousel.init();
  LazyLoad.init();
});
