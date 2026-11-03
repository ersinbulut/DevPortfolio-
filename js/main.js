/* =========================================================
   Ersin Bulut — Portfolio scripts
   ========================================================= */
(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const formatDate = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return `${String(d).padStart(2, "0")} ${MONTHS[m - 1]} ${y}`;
  };

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const themeBtn = $("#themeToggle");
  const applyTheme = (theme) => {
    root.setAttribute("data-bs-theme", theme);
    themeBtn.innerHTML = theme === "dark" ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>';
    $('meta[name="theme-color"]').setAttribute("content", theme === "dark" ? "#0b1020" : "#f6f8fc");
  };
  applyTheme(localStorage.getItem("theme") || "dark");
  themeBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme(next);
  });

  /* ---------- Render: Skills ---------- */
  $("#skillsGrid").innerHTML = SKILLS.map((g, i) => `
    <div class="col-md-6 col-lg-4 reveal" style="--d:${i * 0.1}s">
      <div class="skill-card">
        <div class="skill-icon"><i class="bi ${g.icon}"></i></div>
        <h3>${esc(g.title)}</h3>
        <div class="chip-list">${g.items.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div>
      </div>
    </div>`).join("");

  /* ---------- Render: Experience ---------- */
  $("#timeline").innerHTML = EXPERIENCE.map((e) => `
    <div class="tl-item reveal ${e.current ? "current" : ""}">
      <span class="tl-dot"></span>
      <div class="tl-card">
        <span class="tl-period"><i class="bi bi-calendar3 me-1"></i>${esc(e.period)}</span>
        <h3 class="tl-role">${esc(e.role)}${e.current ? '<span class="badge-current">Şu an</span>' : ""}</h3>
        <div class="tl-company"><i class="bi bi-building"></i>${esc(e.company)}</div>
        <ul>${e.items.map((it) => `<li>${esc(it)}</li>`).join("")}</ul>
        <div class="tag-list mb-0">${e.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
      </div>
    </div>`).join("");

  $("#educationList").innerHTML = EDUCATION.map((ed, i) => `
    <div class="edu-card reveal" style="--d:${i * 0.1}s">
      <div class="edu-icon"><i class="bi ${ed.icon}"></i></div>
      <div>
        <h4>${esc(ed.degree)}</h4>
        <p>${esc(ed.school)}</p>
        <small>${esc(ed.period)}</small>
      </div>
    </div>`).join("");

  /* ---------- Render: Projects ---------- */
  const PROJECT_CAT = { web: "Web", desktop: "Masaüstü", ai: "AI / ML" };
  $("#projectsGrid").innerHTML = PROJECTS.map((p, i) => `
    <div class="col-md-6 col-lg-4 project-col reveal" data-cat="${p.category}" style="--d:${(i % 3) * 0.1}s">
      <article class="project-card">
        <div class="project-cover" style="background:${p.gradient}">
          <span class="project-cat">${PROJECT_CAT[p.category]}</span>
          <i class="bi ${p.icon}"></i>
        </div>
        <div class="project-body">
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.description)}</p>
          <div class="tag-list">${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
          <a href="${p.github}" target="_blank" rel="noopener" class="project-link">
            <i class="bi bi-github"></i> GitHub'da İncele <i class="bi bi-arrow-up-right"></i>
          </a>
        </div>
      </article>
    </div>`).join("");

  $$("#projectFilters .filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$("#projectFilters .filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      $$("#projectsGrid .project-col").forEach((col) => {
        col.classList.toggle("is-hidden", f !== "all" && col.dataset.cat !== f);
      });
    });
  });

  /* ---------- Render: Certificates ---------- */
  const certs = [...CERTIFICATES].sort((a, b) => b.date.localeCompare(a.date));
  const issuerClass = (iss) => (/btk/i.test(iss) ? "btk" : /udemy/i.test(iss) ? "udemy" : "");

  const certFilters = $("#certFilters");
  const catCounts = certs.reduce((acc, c) => ((acc[c.category] = (acc[c.category] || 0) + 1), acc), {});
  certFilters.innerHTML =
    `<button class="filter-btn active" data-filter="all">Tümü<span class="count">${certs.length}</span></button>` +
    Object.entries(CERT_CATEGORIES)
      .filter(([k]) => catCounts[k])
      .map(([k, v]) => `<button class="filter-btn" data-filter="${k}">${v}<span class="count">${catCounts[k]}</span></button>`)
      .join("");

  $("#certGrid").innerHTML = certs.map((c, i) => `
    <div class="col-sm-6 col-lg-4 cert-col reveal" data-cat="${c.category}" data-title="${esc(c.title.toLocaleLowerCase("tr"))}" style="--d:${(i % 3) * 0.08}s">
      <div class="cert-card" tabindex="0" role="button" data-index="${CERTIFICATES.indexOf(c)}" aria-label="${esc(c.title)} sertifikasını görüntüle">
        <div class="cert-top">
          <span class="cert-icon"><i class="bi ${c.icon}"></i></span>
          <span class="cert-issuer ${issuerClass(c.issuer)}">${esc(c.issuer)}</span>
        </div>
        <h3>${esc(c.title)}</h3>
        <div class="cert-bottom">
          <span class="cert-date"><i class="bi bi-calendar-check me-1"></i>${formatDate(c.date)}</span>
          <span class="cert-view">Görüntüle <i class="bi bi-eye"></i></span>
        </div>
      </div>
    </div>`).join("");

  let certFilter = "all";
  let certQuery = "";
  const applyCertFilter = () => {
    let shown = 0;
    $$("#certGrid .cert-col").forEach((col) => {
      const ok = (certFilter === "all" || col.dataset.cat === certFilter) && col.dataset.title.includes(certQuery);
      col.classList.toggle("d-none", !ok);
      if (ok) { shown++; col.classList.add("visible"); }
    });
    $("#certEmpty").classList.toggle("d-none", shown > 0);
  };
  certFilters.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    $$(".filter-btn", certFilters).forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    certFilter = btn.dataset.filter;
    applyCertFilter();
  });
  $("#certSearch").addEventListener("input", (e) => {
    certQuery = e.target.value.trim().toLocaleLowerCase("tr");
    applyCertFilter();
  });

  /* Certificate modal */
  const certModalEl = $("#certModal");
  const certModal = new bootstrap.Modal(certModalEl);
  const openCert = (idx) => {
    const c = CERTIFICATES[idx];
    const url = CERT_DIR + c.file;
    $("#certModalTitle").textContent = c.title;
    $("#certModalMeta").textContent = `${c.issuer} · ${formatDate(c.date)}`;
    $("#certFrame").src = url + "#view=FitH&toolbar=0";
    $("#certOpen").href = url;
    $("#certDownload").href = url;
    $("#certDownload").setAttribute("download", c.file);
    certModal.show();
  };
  $("#certGrid").addEventListener("click", (e) => {
    const card = e.target.closest(".cert-card");
    if (card) openCert(+card.dataset.index);
  });
  $("#certGrid").addEventListener("keydown", (e) => {
    const card = e.target.closest(".cert-card");
    if (card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openCert(+card.dataset.index); }
  });
  certModalEl.addEventListener("hidden.bs.modal", () => { $("#certFrame").src = "about:blank"; });

  /* ---------- Typing effect ---------- */
  const typedEl = $("#typed");
  const roles = PROFILE.roles;
  let roleIdx = 0, charIdx = 0, deleting = false;
  const type = () => {
    const word = roles[roleIdx];
    typedEl.textContent = word.slice(0, charIdx);
    let delay = deleting ? 35 : 70;
    if (!deleting && charIdx === word.length) { deleting = true; delay = 1800; }
    else if (deleting && charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; delay = 400; }
    charIdx += deleting ? -1 : 1;
    setTimeout(type, delay);
  };
  type();

  /* ---------- Reveal on scroll + counters ---------- */
  const animateCounter = (el) => {
    const target = +el.dataset.target;
    const dur = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      $$(".counter", entry.target).forEach((c) => { if (!c.dataset.done) { c.dataset.done = 1; animateCounter(c); } });
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el) => io.observe(el));

  /* ---------- Navbar / progress / back-to-top ---------- */
  const nav = $("#mainNav");
  const progress = $("#scrollProgress");
  const toTop = $("#backToTop");
  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    nav.classList.toggle("scrolled", y > 30);
    toTop.classList.toggle("show", y > 600);
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobilde menü linkine tıklanınca menüyü kapat
  const navMenu = $("#navMenu");
  $$("#navMenu .nav-link").forEach((link) =>
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
    })
  );

  /* ---------- Contact form (mailto) ---------- */
  const toast = new bootstrap.Toast($("#appToast"), { delay: 4000 });
  const showToast = (msg) => { $("#appToastBody").innerHTML = msg; toast.show(); };

  $("#contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) { form.classList.add("was-validated"); return; }
    const name = $("#cfName").value.trim();
    const email = $("#cfEmail").value.trim();
    const subject = $("#cfSubject").value.trim();
    const message = $("#cfMessage").value.trim();
    const body = `${message}\n\n---\nGönderen: ${name}\nE-posta: ${email}`;
    window.location.href = `mailto:${PROFILE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    showToast('<i class="bi bi-check-circle-fill text-success me-2"></i>E-posta uygulamanız açılıyor. Teşekkürler!');
    form.reset();
    form.classList.remove("was-validated");
  });

  /* ---------- Misc ---------- */
  $("#year").textContent = new Date().getFullYear();

  window.addEventListener("load", () => {
    setTimeout(() => $("#preloader").classList.add("hide"), 300);
  });
  // Yedek: load olayı gecikirse preloader'ı yine de kaldır
  setTimeout(() => $("#preloader").classList.add("hide"), 3000);
})();

