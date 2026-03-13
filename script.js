/**
 * DEV PORTFOLIO — script.js
 * İçerik:
 *  1. Dark / Light Mode Toggle
 *  2. Navbar scroll efekti
 *  3. Smooth scroll (HTML'de zaten var, yedek)
 *  4. Proje filtre sistemi
 *  5. Scroll Reveal animasyonları (IntersectionObserver)
 *  6. Sayfa başına dön butonu
 *  7. İletişim formu gönderimi (demo)
 *  8. Footer yıl otomatik güncelleme
 */

/* ─── 1. Dark / Light Mode Toggle ──────────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const htmlEl      = document.documentElement;

/**
 * Tema değişkenini uygular ve ikonu günceller.
 * @param {string} theme - 'dark' | 'light'
 */
function applyTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);

  // İkonu değiştir
  if (theme === 'light') {
    themeIcon.className = 'bi bi-moon-fill';
  } else {
    themeIcon.className = 'bi bi-sun-fill';
  }

  // localStorage'a kaydet
  localStorage.setItem('portfolio-theme', theme);
}

// Sayfa yüklenince kaydedilmiş temayı uygula
(function initTheme() {
  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(saved);
})();

// Toggle tıklaması
themeToggle.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});


/* ─── 2. Navbar Scroll Efekti ───────────────────────────────────────────── */
const mainNav = document.getElementById('mainNav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    mainNav.classList.add('scrolled');
  } else {
    mainNav.classList.remove('scrolled');
  }
}, { passive: true });


/* ─── 3. Aktif Nav Link Vurgulama (Scroll Spy basit) ───────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.navbar-nav .nav-link');

window.addEventListener('scroll', () => {
  let currentId = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 90;
    if (window.scrollY >= sectionTop) {
      currentId = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active-link');
    if (link.getAttribute('href') === `#${currentId}`) {
      link.classList.add('active-link');
    }
  });
}, { passive: true });


/* ─── 4. Proje Filtre Sistemi ───────────────────────────────────────────── */
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Aktif buton stilini güncelle
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectItems.forEach(item => {
      const category = item.dataset.category;

      if (filter === 'all' || category === filter) {
        // Göster
        item.classList.remove('hidden');
        // display'i sıfırlıyoruz (d-none yerine kendi sınıfımızı kullanıyoruz)
        item.style.display = '';
      } else {
        // Gizle — önce opacity, sonra display: none
        item.classList.add('hidden');
        // Geçiş bitince display: none yap
        setTimeout(() => {
          if (item.classList.contains('hidden')) {
            item.style.display = 'none';
          }
        }, 350);
      }
    });
  });
});


/* ─── 5. Scroll Reveal (IntersectionObserver) ───────────────────────────── */

/**
 * .reveal sınıflı elemanlara IntersectionObserver ile
 * görünürlük gelince .visible ekler.
 */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Bir kez gözlemle, sonra bırak
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => observer.observe(el));
}

// Dinamik olarak hero elementlerine reveal sınıfı ekle
(function addRevealClasses() {
  const heroLabel   = document.querySelector('.hero-label');
  const heroTitle   = document.querySelector('.hero-title');
  const heroDesc    = document.querySelector('.hero-desc');
  const heroCta     = document.querySelector('.hero-cta');
  const decoCard    = document.querySelector('.hero-deco-card');

  [heroLabel, heroTitle, heroDesc, heroCta].forEach((el, i) => {
    if (el) {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.12}s`;
    }
  });
  if (decoCard) {
    decoCard.classList.add('reveal');
    decoCard.style.transitionDelay = '0.4s';
  }

  // Proje kartları
  document.querySelectorAll('.project-card').forEach((card, i) => {
    card.classList.add('reveal');
    card.style.transitionDelay = `${(i % 3) * 0.1}s`;
  });

  // Hakkımda bölümü
  document.querySelectorAll('.about-img-wrap, .about-text, .tech-stack, .about-section .btn-primary-custom').forEach((el, i) => {
    if (el) {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.1}s`;
    }
  });

  // İletişim form
  document.querySelectorAll('.contact-section .section-tag, .contact-section .section-title, .contact-section .section-desc, .contact-form').forEach((el, i) => {
    if (el) {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.1}s`;
    }
  });
})();

// Observer'ı başlat
document.addEventListener('DOMContentLoaded', initScrollReveal);


/* ─── 6. Sayfa Başına Dön Butonu ────────────────────────────────────────── */
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}, { passive: true });

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ─── 7. İletişim Formu (Demo Gönderim) ─────────────────────────────────── */
const contactForm   = document.getElementById('contactForm');
const formSuccess   = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basit doğrulama
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      // Boş alan varsa hafifçe salla
      contactForm.style.animation = 'shake 0.4s ease';
      setTimeout(() => { contactForm.style.animation = ''; }, 400);
      return;
    }

    // Demo: form gizle, başarı mesajı göster
    contactForm.classList.add('d-none');
    formSuccess.classList.remove('d-none');

    // 3 saniye sonra formu sıfırla (isteğe bağlı)
    setTimeout(() => {
      contactForm.reset();
      contactForm.classList.remove('d-none');
      formSuccess.classList.add('d-none');
    }, 5000);
  });
}

// Shake animasyonu (CSS içinde yoksa buradan ekle)
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-6px); }
    40%       { transform: translateX(6px); }
    60%       { transform: translateX(-4px); }
    80%       { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);


/* ─── 8. Footer Yıl Güncelleme ──────────────────────────────────────────── */
const footerYear = document.getElementById('footerYear');
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}


/* ─── 9. Navbar mobil menü — linke tıklanınca kapat ─────────────────────── */
const navbarCollapse = document.getElementById('navMenu');
const bsCollapse     = navbarCollapse
  ? new bootstrap.Collapse(navbarCollapse, { toggle: false })
  : null;

document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (bsCollapse && navbarCollapse.classList.contains('show')) {
      bsCollapse.hide();
    }
  });
});


/* ─── 10. Active nav link stili (CSS'e eklenemeyen dinamik kısım) ──────── */
// Aktif link için stil injection
const activeStyle = document.createElement('style');
activeStyle.textContent = `
  .navbar-nav .nav-link.active-link {
    color: var(--text-primary) !important;
  }
  .navbar-nav .nav-link.active-link::after {
    left: 0.75rem !important;
    right: 0.75rem !important;
  }
`;
document.head.appendChild(activeStyle);

console.log('%c{ dev. } Portfolio yüklendi ✓', 'color: #6ee7b7; font-weight: bold; font-size: 14px;');
