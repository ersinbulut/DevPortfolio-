/**
 * kutuphane.js — Kütüphane Sayfası
 * Kitap ekleme / silme / filtreleme / arama
 * Veriler localStorage'da saklanır.
 */

/* ─── Modal instances initialization ───────────────────────────────────── */
let addBookModal   = null;
let deleteModal    = null;

function initModals() {
  try {
    const addBookEl = document.getElementById('addBookModal');
    const deleteEl  = document.getElementById('deleteModal');
    if (addBookEl) addBookModal = bootstrap.Modal.getOrCreateInstance(addBookEl);
    if (deleteEl)  deleteModal  = bootstrap.Modal.getOrCreateInstance(deleteEl);
  } catch (err) {
    console.error('Modal başlatma hatası:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initModals);
} else {
  initModals();
}

/* ─── Tema Toggle ───────────────────────────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const htmlEl      = document.documentElement;

function applyTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  if (themeIcon) themeIcon.className = theme === 'light' ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
  localStorage.setItem('portfolio-theme', theme);
}
(function initTheme() {
  applyTheme(localStorage.getItem('portfolio-theme') || 'dark');
})();
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    applyTheme(htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
}

/* ─── Navbar scroll ─────────────────────────────────────────────────────── */
const mainNav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  if (mainNav) mainNav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ─── Back to top ───────────────────────────────────────────────────────── */
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ─── Footer yıl ────────────────────────────────────────────────────────── */
const footerYear = document.getElementById('footerYear');
if (footerYear) footerYear.textContent = new Date().getFullYear();

/* ─── Varsayılan Kitaplar ───────────────────────────────────────────────── */
const DEFAULT_BOOKS = [
  {
    id: 1,
    title: 'Sapiens: İnsan Türünün Kısa Bir Tarihi',
    author: 'Yuval Noah Harari',
    genre: 'Tarih',
    rating: 5,
    status: 'read',
    pages: 512,
    cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&q=80',
    desc: 'İnsanlığın geçmişini, bugününü ve geleceğini anlatan muazzam bir eser. Bilişsel devrim, tarım devrimi ve insanlığın dünyayı nasıl şekillendirdiğini keskin bir anlatımla sunuyor.',
    date: '2024-03'
  },
  {
    id: 2,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    genre: 'Yazılım',
    rating: 5,
    status: 'read',
    pages: 431,
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14431b9?w=400&q=80',
    desc: 'Yazılım geliştirmenin kutsal kitabı. Temiz, okunabilir ve sürdürülebilir kod yazmanın temel prensiplerini öğreten vazgeçilmez bir kaynak.',
    date: '2024-01'
  },
  {
    id: 3,
    title: 'Atomik Alışkanlıklar',
    author: 'James Clear',
    genre: 'Kişisel Gelişim',
    rating: 5,
    status: 'read',
    pages: 320,
    cover: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&q=80',
    desc: 'Küçük değişimlerin büyük sonuçlar doğurduğunu kanıtlayan bilimsel bir yaklaşım. Alışkanlık döngüsünü anlayıp hayatına uygulamak için mükemmel bir rehber.',
    date: '2023-11'
  },
  {
    id: 4,
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt & David Thomas',
    genre: 'Yazılım',
    rating: 4,
    status: 'read',
    pages: 352,
    cover: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80',
    desc: 'Yazılım mühendisliği kariyerine yön verecek pratik tavsiyeler, ilkeler ve düşünce biçimleri. Her seviyeden geliştirici için okunması gereken bir klasik.',
    date: '2023-09'
  },
  {
    id: 5,
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Bilim Kurgu',
    rating: 5,
    status: 'read',
    pages: 688,
    cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80',
    desc: 'Bilim kurgu edebiyatının başyapıtı. Arrakis gezegeninde geçen bu epik hikaye, siyaset, din ve insanlığın geleceğini işliyor. Sizi başka bir evrene çekip götürüyor.',
    date: '2023-07'
  },
  {
    id: 6,
    title: 'Design Patterns',
    author: 'Gang of Four',
    genre: 'Yazılım',
    rating: 4,
    status: 'reading',
    pages: 395,
    cover: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&q=80',
    desc: 'Nesne yönelimli programlamada tekrar eden problemlere elegant çözümler sunan tasarım kalıpları. Yazılım mimarisi anlayışını derinleştiriyor.',
    date: '2024-05'
  }
];

/* ─── State ─────────────────────────────────────────────────────────────── */
let books         = [];
let activeFilter  = 'all';
let deleteTargetId = null;

/* ─── localStorage ──────────────────────────────────────────────────────── */
function loadBooks() {
  try {
    const saved = localStorage.getItem('kutuphane-books');
    if (saved) {
      const parsed = JSON.parse(saved);
      books = Array.isArray(parsed) ? parsed : DEFAULT_BOOKS;
    } else {
      books = [...DEFAULT_BOOKS];
      saveBooks();
    }
  } catch (err) {
    console.error('Yükleme hatası:', err);
    books = [...DEFAULT_BOOKS];
  }
}
function saveBooks() {
  try {
    localStorage.setItem('kutuphane-books', JSON.stringify(books));
  } catch (err) {
    console.error('Kaydetme hatası:', err);
  }
}

/* ─── Render ─────────────────────────────────────────────────────────────── */
function renderBooks() {
  const grid       = document.getElementById('booksGrid');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('searchInput');
  
  if (!grid || !emptyState) return;

  const searchVal = searchInput ? searchInput.value.trim().toLowerCase() : '';

  let filtered = books.filter(b => {
    const matchCat  = activeFilter === 'all' || b.genre.toLowerCase() === activeFilter.toLowerCase();
    const matchSearch = !searchVal ||
      (b.title && b.title.toLowerCase().includes(searchVal)) ||
      (b.author && b.author.toLowerCase().includes(searchVal));
    return matchCat && matchSearch;
  });

  grid.innerHTML = '';

  if (!filtered.length) {
    emptyState.classList.remove('d-none');
    return;
  }
  emptyState.classList.add('d-none');

  filtered.forEach(book => {
    const stars = '★'.repeat(book.rating || 0) + '☆'.repeat(5 - (book.rating || 0));
    const statusLabel = book.status === 'read' ? 'Okundu' : 'Okunuyor';
    const statusClass = book.status === 'read' ? 'status-read' : 'status-reading';
    const coverFallback = `https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80`;

    const col = document.createElement('div');
    col.className = 'col-sm-6 col-lg-4 col-xl-3';
    col.innerHTML = `
      <div class="book-card reveal">
        <div class="book-cover-wrap">
          <img src="${book.cover || coverFallback}" alt="${book.title}"
               loading="lazy"
               onerror="this.src='${coverFallback}'" />
          <span class="book-genre-badge">${book.genre || 'Genel'}</span>
          ${book.rating ? `<span class="book-rating"><i class="bi bi-star-fill"></i> ${book.rating}/5</span>` : ''}
        </div>
        <div class="book-body">
          <div class="book-title">${book.title || 'İsimsiz'}</div>
          <div class="book-author">${book.author || 'Belirsiz'}</div>
          ${book.desc ? `<p class="book-desc">${book.desc}</p>` : ''}
        </div>
        <div class="book-footer">
          <span class="book-date">${book.date || ''}${book.pages ? ` · ${book.pages} sf.` : ''}</span>
          <div class="d-flex align-items-center gap-2">
            <span class="book-status ${statusClass}">${statusLabel}</span>
            <button class="delete-book-btn" data-id="${book.id}" title="Sil"
              style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:.9rem;transition:var(--transition);"
              onmouseover="this.style.color='#f87171'" onmouseout="this.style.color='var(--text-muted)'">
              <i class="bi bi-trash3"></i>
            </button>
          </div>
        </div>
      </div>`;
    grid.appendChild(col);
  });

  // Scroll reveal
  requestAnimationFrame(() => {
    grid.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.05}s`;
      setTimeout(() => el.classList.add('visible'), 50);
    });
  });

  // Delete buttons listeners
  grid.querySelectorAll('.delete-book-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      deleteTargetId = btn.dataset.id;
      const dm = deleteModal || bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteModal'));
      if (dm) dm.show();
    });
  });
}

/* ─── Stats ──────────────────────────────────────────────────────────────── */
function updateStats() {
  try {
    const total   = books.length;
    const read    = books.filter(b => b.status === 'read').length;
    const reading = books.filter(b => b.status === 'reading').length;
    const totalPages = books.reduce((s, b) => s + (parseInt(b.pages) || 0), 0);
    const avgRating  = books.length
      ? (books.reduce((s, b) => s + (parseInt(b.rating) || 0), 0) / books.length).toFixed(1)
      : '—';

    const elTotal = document.getElementById('totalBooks');
    const elRead = document.getElementById('readBooks');
    const elReading = document.getElementById('readingBooks');
    const elPages = document.getElementById('decoPages');
    const elAvg = document.getElementById('decoAvgRating');

    if (elTotal) elTotal.textContent = total;
    if (elRead) elRead.textContent = read;
    if (elReading) elReading.textContent = reading;
    if (elPages) elPages.textContent = totalPages ? totalPages.toLocaleString('tr-TR') : '—';
    if (elAvg) elAvg.textContent = avgRating;
  } catch (err) {
    console.error('Stats güncelleme hatası:', err);
  }
}

/* ─── Category Filter ────────────────────────────────────────────────────── */
function buildCategoryFilter() {
  const bar = document.getElementById('catFilterBar');
  if (!bar) return;

  const genres = [...new Set(books.map(b => b.genre).filter(Boolean))].sort();

  bar.innerHTML = `<button class="cat-btn ${activeFilter === 'all' ? 'active' : ''}" data-cat="all">Tümü</button>`;
  genres.forEach(g => {
    bar.innerHTML += `<button class="cat-btn ${activeFilter === g ? 'active' : ''}" data-cat="${g}">${g}</button>`;
  });

  bar.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.cat;
      bar.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderBooks();
    });
  });
}

function refresh() {
  updateStats();
  buildCategoryFilter();
  renderBooks();
}

/* ─── Add Book Form ──────────────────────────────────────────────────────── */
const addBookForm = document.getElementById('addBookForm');
if (addBookForm) {
  addBookForm.addEventListener('submit', e => {
    e.preventDefault();

    const title  = document.getElementById('bookTitle').value.trim();
    const author = document.getElementById('bookAuthor').value.trim();
    const genre  = document.getElementById('bookGenre').value.trim();
    
    if (!title || !author || !genre) {
      addBookForm.style.animation = 'shake .4s ease';
      setTimeout(() => addBookForm.style.animation = '', 400);
      return;
    }

    const newBook = {
      id:     Date.now().toString(),
      title,
      author,
      genre,
      rating: parseInt(document.getElementById('bookRating').value) || 0,
      status: document.getElementById('bookStatus').value,
      pages:  parseInt(document.getElementById('bookPages').value) || 0,
      cover:  document.getElementById('bookCover').value.trim(),
      desc:   document.getElementById('bookDesc').value.trim(),
      date:   new Date().toISOString().slice(0,7)
    };

    books.unshift(newBook);
    saveBooks();
    addBookForm.reset();

    try {
      const mi = addBookModal || bootstrap.Modal.getOrCreateInstance(document.getElementById('addBookModal'));
      if (mi) mi.hide();
    } catch(err) {
      console.error('Modal kapatılamadı:', err);
    }

    setTimeout(() => {
      refresh();
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }, 150);
  });
}

/* ─── Delete Confirm ─────────────────────────────────────────────────────── */
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
if (confirmDeleteBtn) {
  confirmDeleteBtn.addEventListener('click', () => {
    books = books.filter(b => String(b.id) !== String(deleteTargetId));
    saveBooks();
    try {
      const mi = deleteModal || bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteModal'));
      if (mi) mi.hide();
    } catch(err) {
      console.error('Modal kapatılamadı:', err);
    }
    
    setTimeout(() => {
      refresh();
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }, 150);
    deleteTargetId = null;
  });
}

/* ─── Search ─────────────────────────────────────────────────────────────── */
const searchInputEl = document.getElementById('searchInput');
if (searchInputEl) {
  let searchTimeout;
  searchInputEl.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(renderBooks, 250);
  });
}

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

/* ─── Shake animation ────────────────────────────────────────────────────── */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100%{transform:translateX(0);}
    20%{transform:translateX(-6px);}
    40%{transform:translateX(6px);}
    60%{transform:translateX(-4px);}
    80%{transform:translateX(4px);}
  }
`;
document.head.appendChild(shakeStyle);

/* ─── Init ───────────────────────────────────────────────────────────────── */
loadBooks();
refresh();

console.log('%c{ dev. } Kütüphane yüklendi ✓', 'color:#7c6ff7;font-weight:bold;font-size:14px;');
