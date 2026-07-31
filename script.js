/* =========================================================
   ANIMATED PARTICLE / MESH BACKGROUND (Canvas)
   ========================================================= */
(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, particles, animId;
  const ACCENT = { r: 48, g: 169, b: 133 };
  const PARTICLE_COUNT = 60;
  const CONNECTION_DIST = 140;

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.8 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.12;
          ctx.strokeStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${p.opacity})`;
      ctx.fill();
    }
  }

  function update() {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }
  }

  function loop() {
    update();
    draw();
    animId = requestAnimationFrame(loop);
  }

  // Respect reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  resize();
  createParticles();
  if (!prefersReducedMotion) {
    loop();
  } else {
    draw(); // static snapshot
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      createParticles();
      if (prefersReducedMotion) draw();
    }, 200);
  });
})();

/* =========================================================
   HERO ENTRANCE ANIMATIONS
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  // Trigger hero animate-in elements
  const heroAnimElements = document.querySelectorAll('.hero .animate-in');
  // Small delay to ensure paint has happened
  requestAnimationFrame(() => {
    heroAnimElements.forEach((el) => {
      el.classList.add('visible');
    });
  });
});

/* =========================================================
   SCROLL-TRIGGERED ANIMATIONS (Intersection Observer)
   ========================================================= */
(function initScrollAnimations() {
  // Section header
  const sectionHeaders = document.querySelectorAll('.section-header');
  const headerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          headerObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  sectionHeaders.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    headerObserver.observe(el);
  });

  // Override visible for section headers
  const style = document.createElement('style');
  style.textContent = `.section-header.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
  document.head.appendChild(style);

  // Link cards — staggered
  const cards = document.querySelectorAll('.link-card');
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index, 10) || 0;
          const delay = index * 80; // stagger 80ms per card
          entry.target.style.transition = `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}ms, background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease`;
          entry.target.classList.add('visible');
          cardObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  cards.forEach((card) => cardObserver.observe(card));
})();
