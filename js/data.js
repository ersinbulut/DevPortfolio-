/* =========================================================
   Portfolio içerik verileri
   Yeni proje / sertifika eklemek için ilgili diziye bir nesne eklemeniz yeterli.
   ========================================================= */

const PROFILE = {
  name: "Ersin Bulut",
  title: "Mid-Level .NET Developer",
  email: "ersinblt61@gmail.com",
  location: "İstanbul (Avr.), Bağcılar",
  github: "https://github.com/ersinbulut",
  linkedin: "https://linkedin.com/in/ersin-bulut-2a45371a7",
  roles: [
    "Mid-Level .NET Developer",
    "C# & ASP.NET Core Geliştirici",
    "WPF & DevExpress Masaüstü Uygulamaları",
    "REST API & SignalR Entegrasyonları",
    "Yapay Zekâ Entegrasyonları"
  ]
};

/* ---------- Projeler (https://ersinbulut.github.io/DevPortfolio-/ adresinden) ---------- */
const PROJECTS = [
  {
    title: "FlightBooking",
    category: "ai",
    icon: "bi-airplane-engines",
    gradient: "linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%)",
    description: "AI destekli uçak bileti rezervasyon sistemi. Kullanıcı tercihlerine göre en uygun uçuşları öneren akıllı platform.",
    tags: ["AI / ML", "Booking", "REST API"],
    github: "https://github.com/ersinbulut/FlightBooking"
  },
  {
    title: "DatabaseMastery",
    category: "web",
    icon: "bi-database-gear",
    gradient: "linear-gradient(135deg,#10b981 0%,#0d9488 100%)",
    description: "Farklı veritabanı sistemleri ile geliştirilmiş projeler koleksiyonu. ASP.NET Core + MongoDB, PostgreSQL ve MSSQL örnekleri.",
    tags: ["ASP.NET Core", "MongoDB", "PostgreSQL", "MSSQL"],
    github: "https://github.com/ersinbulut/DatabaseMastery"
  },
  {
    title: "DevEMagicline Desktop",
    category: "desktop",
    icon: "bi-truck-front",
    gradient: "linear-gradient(135deg,#f59e0b 0%,#ef4444 100%)",
    description: "DevExpress ile geliştirilmiş masaüstü araç takip programı. Turkcell Koopilot filo entegrasyonu ile REST API desteği.",
    tags: ["WPF", "DevExpress", "REST API"],
    github: "https://github.com/ersinbulut/Projegorselleri"
  },
  {
    title: "MovieApi",
    category: "web",
    icon: "bi-film",
    gradient: "linear-gradient(135deg,#ec4899 0%,#8b5cf6 100%)",
    description: "YouTube API destekli web tabanlı film ve dizi yönetim sistemi. Video incelemeleri ve fragmanlar ile zengin içerik.",
    tags: ["ASP.NET Core API", "YouTube API", "Full-Stack"],
    github: "https://github.com/ersinbulut/MovieApi"
  },
  {
    title: "ApiProjeKampi",
    category: "web",
    icon: "bi-egg-fried",
    gradient: "linear-gradient(135deg,#f97316 0%,#eab308 100%)",
    description: "Web tabanlı yemek tarifi yönetim sistemi. Kullanıcılar tarif ekleyebilir, kategorize edebilir ve paylaşabilir.",
    tags: ["Web API", "Recipe", "Full-Stack"],
    github: "https://github.com/ersinbulut/ApiProjeKampi"
  },
  {
    title: "MvcKutuphane",
    category: "web",
    icon: "bi-book-half",
    gradient: "linear-gradient(135deg,#6366f1 0%,#14b8a6 100%)",
    description: "MVC5 ile geliştirilmiş 3 panelli kütüphane yönetim sistemi. Admin, kullanıcı ve üye paneli ile tam kapsamlı.",
    tags: ["ASP.NET MVC5", "Entity Framework", "3 Panel"],
    github: "https://github.com/ersinbulut/MvcKutuphane"
  }
];

/* ---------- Sertifikalar (Sertfikalarım klasörü + CV) ---------- */
const CERT_DIR = "assets/certificates/";
const CERTIFICATES = [
  { title: "ASP.NET ile Web Programlama", issuer: "BTK Akademi", date: "2026-10-25", category: "web", icon: "bi-globe2", file: "aspnet-web-programlama.pdf" },
  { title: "C# Programlama", issuer: "BTK Akademi", date: "2026-10-23", category: "core", icon: "bi-code-slash", file: "csharp-programlama.pdf" },
  { title: "Yapay Zekâ ile Web ve Mobil Uygulama Geliştirme", issuer: "BTK Akademi", date: "2026-10-22", category: "ai", icon: "bi-stars", file: "yapay-zeka-web-mobil.pdf" },
  { title: "Asp.Net MVC5 ile Online Ticari Otomasyon", issuer: "Udemy", date: "2026-10-02", category: "web", icon: "bi-shop", file: "mvc5-online-ticari-otomasyon.pdf" },
  { title: ".NET MAUI ile Android ve iOS Uygulama Geliştirme", issuer: "Udemy", date: "2026-09-09", category: "mobile", icon: "bi-phone", file: "net-maui-mobil.pdf" },
  { title: "Database Mastery: ASP.NET Core ile MongoDB - PostgreSQL - MSSQL", issuer: "Online Kurs", date: "2026-03-12", category: "data", icon: "bi-database", file: "database-mastery.pdf" },
  { title: "C# ile DevExpress'te Teknik Servis ve Ürün Takip Sistemi", issuer: "Online Kurs", date: "2025-12-01", category: "mobile", icon: "bi-tools", file: "devexpress-teknik-servis.pdf" },
  { title: "MVC5 ile 3 Panelli Kütüphane Yönetim Sistemi", issuer: "Online Kurs", date: "2025-11-19", category: "web", icon: "bi-book", file: "mvc5-kutuphane-yonetim.pdf" },
  { title: "Entity Framework Core Masterclass (70+ LINQ & EF Core Metodu)", issuer: "Online Kurs", date: "2025-10-01", category: "data", icon: "bi-diagram-3", file: "ef-core-masterclass.pdf" },
  { title: "AI Masterclass: C# ile 20 Yapay Zekâ Entegrasyonu Part 2", issuer: "Online Kurs", date: "2025-09-01", category: "ai", icon: "bi-robot", file: "ai-masterclass-part2.pdf" },
  { title: "C# - .NET ile Yapay Zekâ Entegrasyonları", issuer: "Online Kurs", date: "2025-08-22", category: "ai", icon: "bi-cpu", file: "csharp-yapay-zeka-entegrasyonlari.pdf" },
  { title: "Asp.Net Core API 8.0 Onion Architecture ile BookCar Projesi", issuer: "Online Kurs", date: "2025-07-10", category: "web", icon: "bi-car-front", file: "aspnetcore-api-bookcar.pdf" },
  { title: "Asp.Net Core API - RapidAPI ve API Consume", issuer: "Online Kurs", date: "2025-05-13", category: "web", icon: "bi-plug", file: "aspnetcore-api-rapidapi.pdf" },
  { title: "Asp.Net Core API SignalR ile QR Kodlu Sipariş Yönetimi", issuer: "Online Kurs", date: "2024-04-25", category: "web", icon: "bi-qr-code", file: "aspnetcore-signalr-qr-siparis.pdf" },
  { title: "Kurumsal Mimaride MVC5 ile Blog Projesi Geliştirelim", issuer: "Online Kurs", date: "2023-02-19", category: "web", icon: "bi-journal-richtext", file: "mvc5-kurumsal-blog.pdf" }
];

const CERT_CATEGORIES = {
  web: "Web & API",
  ai: "Yapay Zekâ",
  data: "Veritabanı",
  mobile: "Masaüstü & Mobil",
  core: "Temel"
};

/* ---------- İş deneyimi (CV) ---------- */
const EXPERIENCE = [
  {
    role: "Mid-Level .NET Developer",
    company: "Magicline Enerji",
    period: "Tem. 2023 – Devam Ediyor",
    current: true,
    items: [
      "Şirket içi araç, personel ve operasyon takip süreçlerini dijitalleştirmek amacıyla C#, WPF, .NET, SQL Server ve Entity Framework kullanarak kurumsal masaüstü uygulamaları geliştirdim.",
      "Araç seçimi, şoför atama, rota kaydı ve iş emri oluşturma süreçlerini tek sistem üzerinden yönetilebilir hâle getirerek operasyonel hız kazandırdım.",
      "Manuel iş emri hazırlama sürecini otomatikleştirerek kâğıt kullanımını ve manuel işlem yükünü azalttım.",
      "Yakıt takibi modülü ile araç bazlı yakıt tüketiminin izlenmesini ve maliyet kontrolü için raporlanabilir veri analizini sağladım.",
      "REST API entegrasyonlarıyla veriye dayalı dinamik operasyonel raporlama yapıları kurdum."
    ],
    tags: ["C#", "WPF", "DevExpress", "SQL Server", "EF", "REST API"]
  },
  {
    role: "Yazılım Uzman Yardımcısı",
    company: "İstanbul Arel Üniversitesi",
    period: "May. 2022 – Haz. 2022",
    items: [
      "PostgreSQL kullanarak gişe işlemleri ve öğrenci sistemleri için karmaşık veritabanı sorguları yazdım.",
      "Operasyonel işlemler için veri çekme, sorgu optimizasyonu ve teknik destek süreçlerinde aktif rol aldım."
    ],
    tags: ["PostgreSQL", "SQL", "Optimizasyon"]
  },
  {
    role: "Android Geliştirici",
    company: "MXB Interactive",
    period: "Oca. 2022 – May. 2022",
    items: [
      "Görüntü işleme cihazları ve mobil uygulama entegrasyonlarıyla ilgili teknik mimarilere katkı sağladım.",
      "REST API entegrasyonları ile mobil kullanıcı arayüzü (UI) geliştirme süreçlerinde ekiplerle koordineli çalıştım."
    ],
    tags: ["Android", "REST API", "UI"]
  },
  {
    role: "Bilgi İşlem / Web Yöneticisi",
    company: "Taksim Turizm",
    period: "Eyl. 2017 – Haz. 2018",
    items: [
      "Bilgi işlem departmanında web sitesi içerik yönetimi, sistem güncellemeleri ve teknik destek süreçlerini yürüttüm."
    ],
    tags: ["Web", "CMS", "Teknik Destek"]
  }
];

/* ---------- Eğitim (CV) ---------- */
const EDUCATION = [
  { degree: "Lisans Eğitimi– İşletme", school: "İstanbul Üniversitesi (İÜ)", period: "Eyl. 2024 – Devam Ediyor", icon: "bi-briefcase" },
  { degree: "Önlisans – Bilgisayar Programcılığı", school: "İstanbul Arel Üniversitesi", period: "Oca. 2018 – Haz. 2020", icon: "bi-pc-display" }
];

/* ---------- Teknik yetenekler (CV) ---------- */
const SKILLS = [
  {
    title: "Backend & Frameworks",
    icon: "bi-braces-asterisk",
    items: ["C#", ".NET", ".NET Framework", "ASP.NET Core", "ASP.NET MVC", "ASP.NET Web API", "REST API", "SignalR", "LINQ", "OOP", "Entity Framework (Core)"]
  },
  {
    title: "Masaüstü, Mobil & Veritabanı",
    icon: "bi-window-stack",
    items: ["WPF", "Web Forms", "XAML", "DevExpress", ".NET MAUI", "MSSQL Server (T-SQL)", "PostgreSQL", "MongoDB", "Database Design"]
  },
  {
    title: "Frontend & Araçlar",
    icon: "bi-palette2",
    items: ["HTML5", "CSS3", "Bootstrap", "JavaScript", "Git & GitHub", "Visual Studio"]
  }
];
