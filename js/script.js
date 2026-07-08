// ==========================================================
// CONSULTORÍA JURÍDICA — Interacciones
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loading screen ---------- */
  const loader = document.getElementById('loading-screen');
  const MIN_LOAD_MS = 1400;
  const start = Date.now();
  document.body.classList.add('lock-scroll');

  window.addEventListener('load', () => {
    const elapsed = Date.now() - start;
    const wait = Math.max(MIN_LOAD_MS - elapsed, 0);
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('lock-scroll');
    }, wait);
  });

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

});
