/* ═══════════════════════════════════════════════════════
   Kütüphane Sayfası — Kitap Yönetimi
   Veriler localStorage'da saklanır
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Modal Instances ── */
  let addBookModal = null;
  let deleteModal  = null;
  let deleteTargetId = null;

  function initModals() {
    try {
      const addEl = document.getElementById('addBookModal');
      const delEl = document.getElementById('deleteModal');
      if (addEl && window.bootstrap) {
        addBookModal = bootstrap.Modal.getOrCreateInstance(addEl);
      }
      if (delEl && window.bootstrap) {
        deleteModal = bootstrap.Modal.getOrCreateInstance(delEl);
      }
    } catch (err) {
      console.warn('Modal init error:', err);
    }
  }

  /* ── Default Books ── */
  const DEFAULT_BOOKS = [
    {
      id: 1,
      title: 'Sapiens: İnsan Türünün Kısa Bir Tarihi',
      author: 'Yuval Noah Harari',
      genre: 'Tarih',
      rating: 5, status: 'read', pages: 512,
      cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&q=80',
      desc: 'İnsanlığın geçmişini, bugününü ve geleceğini anlatan muazzam bir eser. Bilişsel devrim, tarım devrimi ve insanlığın dünyayı nasıl şekillendirdiği keskin bir anlatımla sunuluyor.',
      date: '2024-03'
    },
    {
      id: 2,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      genre: 'Yazılım',
      rating: 5, status: 'read', pages: 431,
      cover: 'https://images.unsplash.com/photo-1555066931-4365d14431b9?w=400&q=80',
      desc: 'Yazılım geliştirmenin kutsal kitabı. Temiz, okunabilir ve sürdürülebilir kod yazmanın temel prensiplerini öğreten vazgeçilmez bir kaynak.',
      date: '2024-01'
    },
    {
      id: 3,
      title: 'Atomik Alışkanlıklar',
      author: 'James Clear',
      genre: 'Kişisel Gelişim',
      rating: 5, status: 'read', pages: 320,
      cover: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&q=80',
      desc: 'Küçük değişimlerin büyük sonuçlar doğurduğunu kanıtlayan bilimsel bir yaklaşım. Alışkanlık döngüsünü anlayıp hayatına uygulamak için mükemmel bir rehber.',
      date: '2023-11'
    },
    {
      id: 4,
      title: 'The Pragmatic Programmer',
      author: 'Andrew Hunt & David Thomas',
      genre: 'Yazılım',
      rating: 4, status: 'read', pages: 352,
      cover: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80',
      desc: 'Yazılım mühendisliği kariyerine yön verecek pratik tavsiyeler, ilkeler ve düşünce biçimleri. Her seviyeden geliştirici için okunması gereken bir klasik.',
      date: '2023-09'
    },
    {
      id: 5,
      title: 'Dune',
      author: 'Frank Herbert',
      genre: 'Bilim Kurgu',
      rating: 5, status: 'read', pages: 688,
      cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80',
      desc: 'Bilim kurgu edebiyatının başyapıtı. Arrakis gezegeninde geçen bu epik hikaye, siyaset, din ve insanlığın geleceğini işliyor. Sizi başka bir evrene çekip götürüyor.',
      date: '2023-07'
    },
    {
      id: 6,
      title: 'Design Patterns',
      author: 'Gang of Four',
      genre: 'Yazılım',
      rating: 4, status: 'reading', pages: 395,
      cover: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&q=80',
      desc: 'Nesne yönelimli programlamada tekrar eden problemlere elegant çözümler sunan tasarım kalıpları. Yazılım mimarisi anlayışını derinleştiriyor.',
      date: '2024-05'
    }
  ];

  /* ── State ── */
  let books = [];
  let activeFilter = 'all';

  /* ── Storage ── */
  function loadBooks() {
    try {
      const saved = localStorage.getItem('kutuphane-books-v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        books = Array.isArray(parsed) ? parsed : DEFAULT_BOOKS;
      } else {
        books = DEFAULT_BOOKS.slice();
        saveBooks();
      }
    } catch (err) {
      console.error('Yükleme hatası:', err);
      books = DEFAULT_BOOKS.slice();
    }
  }
  function saveBooks() {
    try {
      localStorage.setItem('kutuphane-books-v2', JSON.stringify(books));
    } catch (err) {
      console.error('Kaydetme hatası:', err);
    }
  }

  /* ── Counter Animation (sayfa için) ── */
  function animateCounter(el, target) {
    const duration = 1200;
    const start = performance.now();
    const startVal = parseInt(el.textContent) || 0;
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(startVal + (target - startVal) * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  /* ── Render ── */
  function renderBooks() {
    const grid = document.getElementById('booksGrid');
    const empty = document.getElementById('emptyState');
    const search = document.getElementById('searchInput');
    if (!grid || !empty) return;

    const q = search ? search.value.trim().toLowerCase() : '';

    const filtered = books.filter(b => {
      const catOk = activeFilter === 'all' ||
                    (b.genre && b.genre.toLowerCase() === activeFilter.toLowerCase());
      const sOk = !q ||
                  (b.title  && b.title.toLowerCase().includes(q)) ||
                  (b.author && b.author.toLowerCase().includes(q));
      return catOk && sOk;
    });

    grid.innerHTML = '';
    if (!filtered.length) {
      empty.classList.remove('d-none');
      return;
    }
    empty.classList.add('d-none');

    const fallbackCover = 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80';

    filtered.forEach((book, i) => {
      const statusLabel = book.status === 'read' ? 'Okundu' : 'Okunuyor';
      const statusClass = book.status === 'read' ? 'status-read' : 'status-reading';

      const col = document.createElement('div');
      col.className = 'col-sm-6 col-lg-4 col-xl-3';
      col.innerHTML = `
        <div class="book-card">
          <div class="book-cover-wrap">
            <img src="${book.cover || fallbackCover}" alt="${escapeHtml(book.title || '')}"
                 loading="lazy"
                 onerror="this.src='${fallbackCover}'" />
            ${book.genre ? `<span class="book-genre-badge">${escapeHtml(book.genre)}</span>` : ''}
            ${book.rating ? `<span class="book-rating"><i class="bi bi-star-fill"></i> ${book.rating}/5</span>` : ''}
          </div>
          <div class="book-body">
            <div class="book-title">${escapeHtml(book.title || 'İsimsiz')}</div>
            <div class="book-author">${escapeHtml(book.author || 'Belirsiz')}</div>
            ${book.desc ? `<p class="book-desc">${escapeHtml(book.desc)}</p>` : ''}
          </div>
          <div class="book-footer">
            <span class="book-date">${escapeHtml(book.date || '')}${book.pages ? ` · ${book.pages} sf.` : ''}</span>
            <div class="d-flex align-items-center gap-2">
              <span class="book-status ${statusClass}">${statusLabel}</span>
              <button class="delete-book-btn" data-id="${book.id}" title="Sil">
                <i class="bi bi-trash3"></i>
              </button>
            </div>
          </div>
        </div>`;
      grid.appendChild(col);

      // staggered reveal
      const card = col.querySelector('.book-card');
      setTimeout(() => card.classList.add('visible'), 50 + i * 40);
    });

    // delete listeners
    grid.querySelectorAll('.delete-book-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        deleteTargetId = btn.dataset.id;
        const dm = deleteModal || (window.bootstrap &&
          bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteModal')));
        if (dm) dm.show();
      });
    });
  }

  /* ── Stats ── */
  function updateStats() {
    const total   = books.length;
    const read    = books.filter(b => b.status === 'read').length;
    const reading = books.filter(b => b.status === 'reading').length;
    const totalPages = books.reduce((s, b) => s + (parseInt(b.pages) || 0), 0);
    const avgRating  = books.length
      ? (books.reduce((s, b) => s + (parseInt(b.rating) || 0), 0) / books.length).toFixed(1)
      : '—';

    const elTotal   = document.getElementById('totalBooks');
    const elRead    = document.getElementById('readBooks');
    const elReading = document.getElementById('readingBooks');
    const elPages   = document.getElementById('decoPages');
    const elAvg     = document.getElementById('decoAvgRating');

    if (elTotal)   animateCounter(elTotal, total);
    if (elRead)    animateCounter(elRead, read);
    if (elReading) animateCounter(elReading, reading);
    if (elPages)   elPages.textContent = totalPages ? totalPages.toLocaleString('tr-TR') : '—';
    if (elAvg)     elAvg.textContent = avgRating;
  }

  /* ── Category Filter ── */
  function buildCategoryFilter() {
    const bar = document.getElementById('catFilterBar');
    if (!bar) return;
    const genres = [...new Set(books.map(b => b.genre).filter(Boolean))].sort();
    bar.innerHTML = `<button class="filter-btn ${activeFilter === 'all' ? 'active' : ''}" data-cat="all">Tümü</button>`;
    genres.forEach(g => {
      bar.innerHTML += `<button class="filter-btn ${activeFilter === g ? 'active' : ''}" data-cat="${escapeHtml(g)}">${escapeHtml(g)}</button>`;
    });
    bar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.cat;
        bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
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

  /* ── Modal Cleanup Helper ── */
  function cleanupBackdrop() {
    setTimeout(() => {
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }, 200);
  }

  /* ── Add Book Form ── */
  function initAddBookForm() {
    const form = document.getElementById('addBookForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title  = document.getElementById('bookTitle').value.trim();
      const author = document.getElementById('bookAuthor').value.trim();
      const genre  = document.getElementById('bookGenre').value.trim();
      if (!title || !author || !genre) {
        form.style.animation = 'shake .4s';
        setTimeout(() => form.style.animation = '', 400);
        return;
      }
      const newBook = {
        id: Date.now().toString(),
        title, author, genre,
        rating: parseInt(document.getElementById('bookRating').value) || 0,
        status: document.getElementById('bookStatus').value,
        pages:  parseInt(document.getElementById('bookPages').value) || 0,
        cover:  document.getElementById('bookCover').value.trim(),
        desc:   document.getElementById('bookDesc').value.trim(),
        date:   new Date().toISOString().slice(0, 7)
      };
      books.unshift(newBook);
      saveBooks();
      form.reset();
      try {
        const mi = addBookModal || (window.bootstrap &&
          bootstrap.Modal.getOrCreateInstance(document.getElementById('addBookModal')));
        if (mi) mi.hide();
      } catch (err) {}
      cleanupBackdrop();
      setTimeout(refresh, 250);
    });
  }

  /* ── Delete Confirm ── */
  function initDeleteConfirm() {
    const btn = document.getElementById('confirmDeleteBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      books = books.filter(b => String(b.id) !== String(deleteTargetId));
      saveBooks();
      try {
        const mi = deleteModal || (window.bootstrap &&
          bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteModal')));
        if (mi) mi.hide();
      } catch (err) {}
      cleanupBackdrop();
      setTimeout(refresh, 250);
      deleteTargetId = null;
    });
  }

  /* ── Search ── */
  function initSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    let to;
    input.addEventListener('input', () => {
      clearTimeout(to);
      to = setTimeout(renderBooks, 220);
    });
  }

  /* ── HTML Escape ── */
  function escapeHtml(str) {
    if (str === undefined || str === null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ── Init ── */
  function init() {
    initModals();
    initAddBookForm();
    initDeleteConfirm();
    initSearch();
    loadBooks();
    refresh();
    console.log('%c{ ersin.dev } Kütüphane yüklendi ✓',
                'color:#7c6ff7;font-weight:bold;font-size:13px;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
