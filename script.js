/**
 * DEV PORTFOLIO — script.js
 * 1. Dark / Light Mode Toggle
 * 2. Navbar scroll efekti
 * 3. Scroll Spy (aktif nav link)
 * 4. Proje filtre sistemi
 * 5. Scroll Reveal (IntersectionObserver)
 * 6. Sayfa başına dön butonu
 * 7. İletişim formu (WhatsApp)
 * 8. Footer yıl güncelleme
 * 9. Mobil navbar kapatma
 */

/* ─── 1. Dark / Light Mode Toggle ──────────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const htmlEl      = document.documentElement;

function applyTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  themeIcon.className = theme === 'light' ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
  localStorage.setItem('portfolio-theme', theme);
}
(function initTheme() {
  applyTheme(localStorage.getItem('portfolio-theme') || 'dark');
})();
themeToggle.addEventListener('click', () => {
  applyTheme(htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ─── 2. Navbar Scroll Efekti ───────────────────────────────────────────── */
const mainNav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  mainNav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ─── 3. Scroll Spy ─────────────────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

window.addEventListener('scroll', () => {
  let currentId = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 90) currentId = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active-link');
    if (link.getAttribute('href') === `#${currentId}`) link.classList.add('active-link');
  });
}, { passive: true });

/* ─── 4. Proje Filtre Sistemi ───────────────────────────────────────────── */
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectItems.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      if (match) {
        item.classList.remove('hidden');
        item.style.display = '';
      } else {
        item.classList.add('hidden');
        setTimeout(() => { if (item.classList.contains('hidden')) item.style.display = 'none'; }, 350);
      }
    });
  });
});

/* ─── 5. Scroll Reveal ──────────────────────────────────────────────────── */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => observer.observe(el));
}

(function addRevealClasses() {
  const items = [
    document.querySelector('.hero-label'),
    document.querySelector('.hero-title'),
    document.querySelector('.hero-desc'),
    document.querySelector('.hero-cta'),
    document.querySelector('.hero-deco-card'),
  ];
  items.forEach((el, i) => {
    if (el) { el.classList.add('reveal'); el.style.transitionDelay = `${i * 0.12}s`; }
  });
  document.querySelectorAll('.project-card').forEach((card, i) => {
    card.classList.add('reveal');
    card.style.transitionDelay = `${(i % 3) * 0.1}s`;
  });
  document.querySelectorAll('.about-img-wrap, .about-text, .tech-stack, .about-section .btn-primary-custom, .about-section .btn-library-custom').forEach((el, i) => {
    if (el) { el.classList.add('reveal'); el.style.transitionDelay = `${i * 0.1}s`; }
  });
  document.querySelectorAll('.contact-section .section-tag, .contact-section .section-title, .contact-section .section-desc, .contact-form').forEach((el, i) => {
    if (el) { el.classList.add('reveal'); el.style.transitionDelay = `${i * 0.1}s`; }
  });
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollReveal);
} else {
  initScrollReveal();
}

/* ─── 6. Sayfa Başına Dön ───────────────────────────────────────────────── */
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTopBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ─── 7. İletişim Formu (WhatsApp) ─────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const WHATSAPP_PHONE = '905300119711';

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    if (!name || !email || !message) {
      contactForm.style.animation = 'shake .4s ease';
      setTimeout(() => contactForm.style.animation = '', 400);
      return;
    }
    const text = `*Yeni İletişim Formu Mesajı*%0A%0A` +
      `👤 *Ad:* ${encodeURIComponent(name)}%0A` +
      `📧 *E-posta:* ${encodeURIComponent(email)}%0A` +
      `📝 *Konu:* ${encodeURIComponent(subject || 'Belirtilmemiş')}%0A%0A` +
      `💬 *Mesaj:*%0A${encodeURIComponent(message)}`;
    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${text}`, '_blank');
    contactForm.classList.add('d-none');
    formSuccess.classList.remove('d-none');
    setTimeout(() => {
      contactForm.reset();
      contactForm.classList.remove('d-none');
      formSuccess.classList.add('d-none');
    }, 5000);
  });
}

/* ─── 8. Footer Yıl ─────────────────────────────────────────────────────── */
const footerYear = document.getElementById('footerYear');
if (footerYear) footerYear.textContent = new Date().getFullYear();

/* ─── 9. Mobil Navbar Kapatma ───────────────────────────────────────────── */
const navbarCollapse = document.getElementById('navMenu');
let bsCollapse = null;

function initNavbar() {
  if (navbarCollapse) {
    try {
      bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse, { toggle: false });
    } catch(e) { console.warn('Collapse instance oluşturulamadı'); }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavbar);
} else {
  initNavbar();
}

document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    try {
      if (bsCollapse && navbarCollapse && navbarCollapse.classList.contains('show')) {
        bsCollapse.hide();
      }
    } catch(e) {}
  });
});

/* ─── Style injections ──────────────────────────────────────────────────── */
const extraStyle = document.createElement('style');
extraStyle.textContent = `
  @keyframes shake {
    0%,100%{transform:translateX(0);}
    20%{transform:translateX(-6px);}
    40%{transform:translateX(6px);}
    60%{transform:translateX(-4px);}
    80%{transform:translateX(4px);}
  }
  .navbar-nav .nav-link.active-link { color: var(--text-primary) !important; }
  .navbar-nav .nav-link.active-link::after { left: .8rem !important; right: .8rem !important; }
`;
document.head.appendChild(extraStyle);

console.log('%c{ dev. } Portfolio yüklendi ✓', 'color:#7c6ff7;font-weight:bold;font-size:14px;');
