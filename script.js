/* ═══════════════════════════════════════════════════════════
   Ersin Bulut — Premium 3D Portfolio
   Three.js · GSAP · Vanilla JS
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Helpers ─────────────────────────────────────────── */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const isMobile = () => window.innerWidth < 1024;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Custom Cursor ────────────────────────────────── */
  const cursorDot  = $('#cursor-dot');
  const cursorRing = $('#cursor-ring');

  if (cursorDot && cursorRing && !isMobile()) {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursorDot.style.left = mx + 'px';
      cursorDot.style.top  = my + 'px';
    });

    function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      requestAnimationFrame(loop);
    }
    loop();

    // Hover detection (delegate)
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, input, textarea, .tilt-card, .project-card, .skill-card')) {
        document.body.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button, input, textarea, .tilt-card, .project-card, .skill-card')) {
        document.body.classList.remove('cursor-hover');
      }
    });
  }

  /* ── 2. Three.js Background Scene ────────────────────── */
  let scene, camera, renderer, particles, geometry1, geometry2, animationId;
  let mouseXNorm = 0, mouseYNorm = 0;
  let scrollY = 0;

  function initThreeScene() {
    const canvas = $('#bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030014, 0.025);

    camera = new THREE.PerspectiveCamera(
      70, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    camera.position.z = 8;

    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: window.devicePixelRatio < 2
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /* ─── Particle Field ─── */
    const count = isMobile() ? 800 : 1800;
    const positions = new Float32Array(count * 3);
    const colors    = new Float32Array(count * 3);
    const c1 = new THREE.Color(0x7c6ff7);
    const c2 = new THREE.Color(0x00f2fe);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3]     = (Math.random() - 0.5) * 22;
      positions[i3 + 1] = (Math.random() - 0.5) * 22;
      positions[i3 + 2] = (Math.random() - 0.5) * 22;

      const mix = Math.random();
      const col = c1.clone().lerp(c2, mix);
      colors[i3]     = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;
    }

    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    partGeo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

    const partMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });
    particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    /* ─── Wireframe Torus Knot ─── */
    const torusGeo = new THREE.TorusKnotGeometry(1.2, 0.35, 120, 14);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x7c6ff7,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    geometry1 = new THREE.Mesh(torusGeo, torusMat);
    geometry1.position.set(5.5, 2, -4);
    scene.add(geometry1);

    /* ─── Wireframe Icosahedron ─── */
    const icoGeo = new THREE.IcosahedronGeometry(1.4, 0);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });
    geometry2 = new THREE.Mesh(icoGeo, icoMat);
    geometry2.position.set(-5, -3, -3);
    scene.add(geometry2);

    /* ─── Mouse + Scroll Tracking ─── */
    document.addEventListener('mousemove', (e) => {
      mouseXNorm = (e.clientX / window.innerWidth) - 0.5;
      mouseYNorm = (e.clientY / window.innerHeight) - 0.5;
    });
    window.addEventListener('scroll', () => {
      scrollY = window.scrollY;
    }, { passive: true });

    window.addEventListener('resize', onWindowResize);

    animate();
  }

  function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    animationId = requestAnimationFrame(animate);

    const t = Date.now() * 0.0001;

    if (particles) {
      particles.rotation.y = t * 1.5;
      particles.rotation.x = t * 0.8;
      // Mouse parallax (very subtle)
      particles.rotation.y += mouseXNorm * 0.05 - particles.rotation.y * 0.0;
    }

    if (geometry1) {
      geometry1.rotation.x += 0.003;
      geometry1.rotation.y += 0.005;
      geometry1.position.y = 2 + Math.sin(t * 8) * 0.5 - scrollY * 0.001;
    }
    if (geometry2) {
      geometry2.rotation.x -= 0.004;
      geometry2.rotation.z += 0.003;
      geometry2.position.x = -5 + Math.cos(t * 6) * 0.4;
      geometry2.position.y = -3 + scrollY * 0.0008;
    }

    if (camera) {
      // Smooth camera follow
      camera.position.x += (mouseXNorm * 0.5 - camera.position.x) * 0.03;
      camera.position.y += (-mouseYNorm * 0.5 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  /* ── 3. Loader ───────────────────────────────────────── */
  const loader = $('#loader');
  function hideLoader() {
    if (!loader) return;
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 900);
    }, 600);
  }
  window.addEventListener('load', hideLoader);
  // Fallback in case load doesn't fire
  setTimeout(hideLoader, 3500);

  /* ── 4. Navbar Scroll ────────────────────────────────── */
  const navbar = $('#navbar');
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── 5. Hamburger Menu ───────────────────────────────── */
  const hamburger = $('#hamburger');
  const navLinks  = $('#navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
    // close on link click
    $$('.nav-link', navLinks).forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
  }

  /* ── 6. GSAP Scroll Reveal ───────────────────────────── */
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
    $$('.reveal').forEach((el) => {
      const delay = parseFloat(getComputedStyle(el).getPropertyValue('--delay')) || 0;
      gsap.fromTo(el,
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          delay: delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  } else {
    // Fallback IntersectionObserver
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    $$('.reveal').forEach(el => io.observe(el));
  }

  /* ── 7. Counter Animation ────────────────────────────── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.count || '0', 10);
    const duration = 1400;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        statsObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  $$('.stat-num').forEach(el => statsObserver.observe(el));

  /* ── 8. Tilt Cards (3D hover) ────────────────────────── */
  if (!isMobile() && !reduceMotion) {
    $$('.tilt-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        const rotY = x * 8;
        const rotX = -y * 8;
        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ── 9. Magnetic Buttons ─────────────────────────────── */
  if (!isMobile() && !reduceMotion) {
    $$('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width  / 2;
        const y = e.clientY - rect.top  - rect.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ── 10. Project Filter ──────────────────────────────── */
  const filterBtns = $$('.filter-btn');
  const projectCards = $$('.project-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      projectCards.forEach((card) => {
        const cat = card.dataset.cat;
        const show = filter === 'all' || cat === filter;
        if (show) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity .5s ease, transform .5s ease';
            card.style.opacity = '1';
            card.style.transform = '';
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ── 11. Contact Form ────────────────────────────────── */
  const contactForm = $('#contactForm');
  const formSuccess = $('#form-success');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simulate sending
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const original = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Gönderiliyor...';
      submitBtn.disabled = true;
      setTimeout(() => {
        if (formSuccess) {
          formSuccess.classList.remove('hidden');
          setTimeout(() => formSuccess.classList.add('hidden'), 5000);
        }
        contactForm.reset();
        submitBtn.innerHTML = original;
        submitBtn.disabled = false;
      }, 900);
    });
  }

  /* ── 12. Back to Top ─────────────────────────────────── */
  const backBtn = $('#backToTop');
  if (backBtn) {
    window.addEventListener('scroll', () => {
      backBtn.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 13. Footer Year ─────────────────────────────────── */
  const fy = $('#footerYear');
  if (fy) fy.textContent = new Date().getFullYear();

  /* ── 14. Init Three.js ───────────────────────────────── */
  if (!reduceMotion) {
    initThreeScene();
  }

  /* ── 15. Smooth scroll for anchor links ──────────────── */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      const target = $(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  console.log('%c{ ersin.dev } 3D Portfolio Initialized ✓', 'color:#7c6ff7;font-weight:bold;font-size:14px;');

})();
