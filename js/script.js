// ==========================================================
// CONSULTORÍA JURÍDICA — Interacciones
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loading screen ---------- */
  const loader = document.getElementById('loading-screen');
  const ringProgress = document.querySelector('.loader-ring-progress');
  const pctEl = document.querySelector('.loader-pct');
  const RING_CIRCUMFERENCE = 2 * Math.PI * 62;
  if (ringProgress) {
    ringProgress.style.strokeDasharray = String(RING_CIRCUMFERENCE);
    ringProgress.style.strokeDashoffset = String(RING_CIRCUMFERENCE);
  }

  const MIN_LOAD_MS = 2200;
  const start = performance.now();
  document.body.classList.add('lock-scroll');

  let pageLoaded = false;
  window.addEventListener('load', () => { pageLoaded = true; });

  const tickLoader = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / MIN_LOAD_MS, 1);
    const eased = 1 - Math.pow(1 - progress, 2);

    if (ringProgress) ringProgress.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - eased));
    if (pctEl) pctEl.textContent = Math.round(eased * 100) + '%';

    if (progress < 1 || !pageLoaded) {
      requestAnimationFrame(tickLoader);
    } else {
      loader.classList.add('hidden');
      document.body.classList.remove('lock-scroll');
    }
  };
  requestAnimationFrame(tickLoader);

  /* ---------- Header on scroll ---------- */
  const header = document.getElementById('siteHeader');
  const toggleHeader = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  toggleHeader();
  window.addEventListener('scroll', toggleHeader, { passive: true });

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  const closeMobileNav = () => {
    navToggle.classList.remove('active');
    mobileNav.classList.remove('open');
    document.body.classList.remove('lock-scroll');
  };
  navToggle.addEventListener('click', () => {
    const willOpen = !mobileNav.classList.contains('open');
    navToggle.classList.toggle('active', willOpen);
    mobileNav.classList.toggle('open', willOpen);
    document.body.classList.toggle('lock-scroll', willOpen);
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (Number.isInteger(target) ? Math.round(value) : value.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(el => counterIO.observe(el));

  /* ---------- Floating WhatsApp menu ---------- */
  const waToggle = document.getElementById('waToggle');
  const waMenu = document.getElementById('waMenu');
  waToggle.addEventListener('click', () => {
    waToggle.classList.toggle('active');
    waMenu.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.wa-float')) {
      waToggle.classList.remove('active');
      waMenu.classList.remove('open');
    }
  });

  /* ---------- Back to top ---------- */
  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', () => {
    toTop.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Contact form -> WhatsApp ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.nombre.value.trim();
      const phone = form.telefono.value.trim();
      const area = form.area.value;
      const message = form.mensaje.value.trim();

      if (!name || !phone || !area) {
        form.reportValidity();
        return;
      }

      const text =
        `Hola, soy ${name}.%0A` +
        `Área legal: ${area}.%0A` +
        `Teléfono de contacto: ${phone}.%0A` +
        (message ? `Mensaje: ${message}%0A` : '') +
        `Solicito una consulta confidencial.`;

      const isPenal = area.toLowerCase().includes('penal') || area.toLowerCase().includes('amparo');
      const number = isPenal ? '522295227860' : '522293383693';

      window.open(`https://wa.me/${number}?text=${text}`, '_blank');
      form.reset();
    });
  }

  /* ---------- Hero particle network ---------- */
  (() => {
    const canvas = document.getElementById('heroParticles');
    const hero = canvas ? canvas.closest('.hero') : null;
    if (!canvas || !hero) return;

    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const LINK_DIST = 130;
    let particles = [];
    let w = 0, h = 0, dpr = 1;
    let rafId = null;

    const makeParticle = () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.6,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -Math.random() * 0.22 - 0.04,
      o: Math.random() * 0.5 + 0.25
    });

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = hero.offsetWidth;
      h = hero.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(75, Math.round((w * h) / 17000));
      particles = Array.from({ length: count }, makeParticle);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(217,182,86,${p.o})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(201,162,39,${0.16 * (1 - dist / LINK_DIST)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    };

    const step = () => {
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
      });
      draw();
      rafId = requestAnimationFrame(step);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    if (reduceMotion) {
      draw();
    } else {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (rafId) cancelAnimationFrame(rafId);
          rafId = null;
        } else if (!rafId) {
          step();
        }
      });
      step();
    }
  })();

  /* ---------- Hero title typewriter cycle ---------- */
  (() => {
    const el = document.querySelector('.tw-cycle');
    if (!el) return;

    const words = (el.dataset.words || el.textContent).split(',').map(w => w.trim()).filter(Boolean);
    if (words.length < 2) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = words[0];
      return;
    }

    const TYPE_MS = 90, DELETE_MS = 45, HOLD_MS = 1900, SWITCH_MS = 350;
    let wordIndex = 0, charIndex = 0, deleting = false;

    const tick = () => {
      const current = words[wordIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, HOLD_MS);
          return;
        }
        setTimeout(tick, TYPE_MS);
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(tick, SWITCH_MS);
          return;
        }
        setTimeout(tick, DELETE_MS);
      }
    };

    setTimeout(tick, HOLD_MS);
  })();

});
