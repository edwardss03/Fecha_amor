/* =====================================================================
   APP.JS — Álbum Digital Jesús ❤️ Viviana
   Lógica pública: carga de capítulos, renderizado, lightbox, contador
   ===================================================================== */

'use strict';

// =====================================================================
// ESTADO GLOBAL
// =====================================================================
const App = {
  supabase: null,
  useSupabase: false,
  chapters: [],           // Lista ordenada (más reciente primero)
  currentChapterId: null, // ID del capítulo abierto en el detalle
  lightbox: {
    photos: [],
    index: 0,
  },
  counterAnimated: false,
};

// =====================================================================
// MESES EN ESPAÑOL
// =====================================================================
const MESES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// =====================================================================
// INICIALIZACIÓN
// =====================================================================
document.addEventListener('DOMContentLoaded', () => {
  setBackgrounds();
  loadChapters();
  renderChapters();
  initNavbar();
  initCounter();
  initScrollAnimations();
  initHeroButton();
  initDetailPanel();
  initLightbox();
  initHashRouting();
});

// =====================================================================
// CARGAR CAPÍTULOS
// =====================================================================
function loadChapters() {
  App.chapters = FALLBACK_CHAPTERS.filter(c => c.estado === 'publicado');
  App.chapters.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

// =====================================================================
// FONDOS DEL HERO Y FINAL
// =====================================================================
function setBackgrounds() {
  const heroBg = document.getElementById('hero-bg');
  const finalBg = document.getElementById('final-bg');
  const hero = CONFIG?.HERO_PHOTO || 'fotovivi_1.jpg';
  const final_ = CONFIG?.FINAL_PHOTO || 'fotovivi_33.jpg';
  if (heroBg) heroBg.style.backgroundImage = `url('${hero}')`;
  if (finalBg) finalBg.style.backgroundImage = `url('${final_}')`;
}

// =====================================================================
// RENDERIZAR GRID DE CAPÍTULOS
// =====================================================================
function renderChapters() {
  const container = document.getElementById('chapters-container');
  if (!container) return;

  if (App.chapters.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📖</div>
        <p class="empty-state-text">Aún no hay capítulos publicados.</p>
      </div>`;
    return;
  }

  // Agrupar capítulos por año
  const chaptersByYear = {};
  App.chapters.forEach(chapter => {
    const year = new Date(chapter.fecha).getFullYear();
    if (!chaptersByYear[year]) {
      chaptersByYear[year] = [];
    }
    chaptersByYear[year].push(chapter);
  });

  // Ordenar los años de forma descendente (más reciente primero)
  const years = Object.keys(chaptersByYear).sort((a, b) => b - a);

  // Renderizar bloques por año
  let html = '';
  years.forEach(year => {
    html += `
      <div class="year-block" id="year-${year}">
        <h3 class="year-title-divider">${year}</h3>
        <div class="chapters-grid">
    `;

    chaptersByYear[year].forEach((chapter) => {
      // Encontrar índice absoluto en la lista global para los handlers de click
      const globalIdx = App.chapters.findIndex(c => c.id === chapter.id);
      const monthNum = calcMonthNumber(chapter.fecha);
      const dateStr = formatDate(chapter.fecha);
      const isDraft = chapter.estado === 'borrador';
      const portadaUrl = chapter.portada || (chapter.fotos?.[0]?.url) || '';

      html += `
        <article
          class="chapter-card${isDraft ? ' chapter-card--draft' : ''}"
          role="listitem"
          data-id="${chapter.id}"
          data-index="${globalIdx}"
          style="transition-delay: 0.1s;"
          tabindex="0"
          aria-label="Capítulo ${monthNum}: ${chapter.titulo}"
        >
          <div class="chapter-card__img-wrap">
            ${portadaUrl
              ? `<img
                  class="chapter-card__img"
                  src="${portadaUrl}"
                  alt="Portada del capítulo ${monthNum}"
                  loading="lazy"
                 >`
              : `<div class="chapter-card__img-placeholder">📷</div>`
            }
            <span class="chapter-card__badge">Mes ${monthNum}</span>
          </div>
          <div class="chapter-card__body">
            <p class="chapter-card__number">Capítulo ${monthNum}</p>
            <h3 class="chapter-card__title">${escapeHtml(chapter.titulo)}</h3>
            <p class="chapter-card__date">${dateStr}</p>
            <span class="chapter-card__btn">
              Ver capítulo
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </div>
        </article>`;
    });

    html += `
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  // Poblar dropdown de años en el navbar
  const dropdown = document.getElementById('navbar-years-dropdown');
  if (dropdown) {
    dropdown.innerHTML = years.map(year => `
      <a href="#year-${year}" class="navbar-dropdown-link" data-year="${year}">${year}</a>
    `).join('');

    // Smooth scroll para los links de los años en el dropdown
    dropdown.querySelectorAll('.navbar-dropdown-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const year = link.dataset.year;
        const target = document.getElementById(`year-${year}`);
        if (target) {
          const navbarHeight = document.getElementById('navbar').offsetHeight || 80;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Click handlers para cada tarjeta
  container.querySelectorAll('.chapter-card').forEach(card => {
    const open = () => openChapter(card.dataset.id);
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });
}

// =====================================================================
// ABRIR DETALLE DEL CAPÍTULO
// =====================================================================
function openChapter(id) {
  const chapter = App.chapters.find(c => String(c.id) === String(id));
  if (!chapter) return;

  App.currentChapterId = id;
  const chapterIndex = App.chapters.findIndex(c => String(c.id) === String(id));
  const monthNum = calcMonthNumber(chapter.fecha);

  // Header
  document.getElementById('detail-header-info').textContent =
    `Capítulo ${monthNum} — ${formatDate(chapter.fecha)}`;

  // Portada
  const coverEl = document.getElementById('detail-cover');
  const portadaUrl = chapter.portada || chapter.fotos?.[0]?.url || '';
  coverEl.innerHTML = portadaUrl
    ? `<img src="${portadaUrl}" alt="Portada del capítulo ${monthNum}" loading="lazy">`
    : '';

  // Mes y título
  document.getElementById('detail-month').textContent = `Capítulo ${monthNum}`;
  document.getElementById('detail-title').textContent = chapter.titulo;
  document.getElementById('detail-date').textContent = formatDate(chapter.fecha, true);

  // Carta
  const letterEl = document.getElementById('detail-letter');
  letterEl.innerHTML = renderLetter(chapter.mensaje);

  // Galería
  const galleryEl = document.getElementById('detail-gallery');
  const fotos = chapter.fotos || [];
  if (fotos.length > 0) {
    galleryEl.innerHTML = fotos.map((foto, idx) => `
      <div class="detail-gallery__item" data-index="${idx}" tabindex="0" role="button" aria-label="Abrir foto ${idx + 1}">
        <img src="${foto.url}" alt="Foto ${idx + 1}" loading="lazy">
      </div>`).join('');

    galleryEl.querySelectorAll('.detail-gallery__item').forEach(item => {
      const open = () => openLightbox(fotos.map(f => f.url), parseInt(item.dataset.index));
      item.addEventListener('click', open);
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
    });
  } else {
    galleryEl.innerHTML = '';
  }

  // Navegación prev/next (el orden es: más reciente [0] al más antiguo [n-1])
  const prevChapter = App.chapters[chapterIndex - 1]; // más reciente
  const nextChapter = App.chapters[chapterIndex + 1]; // más antiguo

  const prevBtn = document.getElementById('detail-prev');
  const nextBtn = document.getElementById('detail-next');
  const prevTitle = document.getElementById('detail-prev-title');
  const nextTitle = document.getElementById('detail-next-title');

  if (prevChapter) {
    prevBtn.style.visibility = 'visible';
    prevTitle.textContent = prevChapter.titulo;
    prevBtn.onclick = () => { scrollDetailToTop(); openChapter(prevChapter.id); };
  } else {
    prevBtn.style.visibility = 'hidden';
  }

  if (nextChapter) {
    nextBtn.style.visibility = 'visible';
    nextTitle.textContent = nextChapter.titulo;
    nextBtn.onclick = () => { scrollDetailToTop(); openChapter(nextChapter.id); };
  } else {
    nextBtn.style.visibility = 'hidden';
  }

  // Abrir el overlay
  const overlay = document.getElementById('chapter-detail');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Actualizar hash de URL
  history.pushState({ chapterId: id }, '', `#chapter-${id}`);

  // Scroll al top del panel
  scrollDetailToTop();
}

function scrollDetailToTop() {
  const panel = document.getElementById('detail-panel');
  if (panel) panel.scrollTop = 0;
}

function closeChapter() {
  const overlay = document.getElementById('chapter-detail');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  App.currentChapterId = null;

  // Limpiar hash
  history.pushState({}, '', window.location.pathname + window.location.search);
}

// =====================================================================
// RENDERIZAR CARTA (texto con párrafos y posdata)
// =====================================================================
function renderLetter(texto) {
  if (!texto) return '';

  const lineas = texto.split('\n');
  const parrafos = [];
  let current = '';
  let psLines = [];
  let inPs = false;

  lineas.forEach(linea => {
    const trimmed = linea.trim();
    const isPs = /^(psdt?|p\.s\.?|pd\.|posdata):/i.test(trimmed);

    if (isPs || inPs) {
      inPs = true;
      if (current.trim()) {
        parrafos.push(current.trim());
        current = '';
      }
      psLines.push(trimmed);
    } else if (trimmed === '') {
      if (current.trim()) {
        parrafos.push(current.trim());
        current = '';
      }
    } else {
      current += (current ? ' ' : '') + trimmed;
    }
  });

  if (current.trim()) parrafos.push(current.trim());

  let html = parrafos.map(p => `<p>${escapeHtml(p)}</p>`).join('');

  if (psLines.length > 0) {
    html += `<p class="letter-ps">${escapeHtml(psLines.join(' '))}</p>`;
  }

  return html;
}

// =====================================================================
// INICIALIZAR PANEL DE DETALLE
// =====================================================================
function initDetailPanel() {
  // Cerrar con el botón X
  document.getElementById('detail-close').addEventListener('click', closeChapter);

  // Cerrar al hacer clic en el backdrop
  document.getElementById('detail-backdrop').addEventListener('click', closeChapter);

  // Cerrar con Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (App.lightbox.photos.length > 0 && document.getElementById('lightbox').classList.contains('open')) {
        closeLightbox();
      } else if (App.currentChapterId) {
        closeChapter();
      }
    }
  });
}

// =====================================================================
// LIGHTBOX
// =====================================================================
function initLightbox() {
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
  document.getElementById('lightbox-next').addEventListener('click', () => navigateLightbox(1));

  // Clic en el fondo para cerrar
  document.getElementById('lightbox').addEventListener('click', e => {
    if (e.target === document.getElementById('lightbox')) closeLightbox();
  });

  // Teclado
  document.addEventListener('keydown', e => {
    const lb = document.getElementById('lightbox');
    if (!lb.classList.contains('open')) return;
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
    if (e.key === 'Escape') closeLightbox();
  });

  // Touch/swipe en el lightbox
  let touchStartX = 0;
  const lb = document.getElementById('lightbox');
  lb.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    const delta = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(delta) > 50) navigateLightbox(delta < 0 ? 1 : -1);
  }, { passive: true });
}

function openLightbox(photos, startIndex = 0) {
  App.lightbox.photos = photos;
  App.lightbox.index = startIndex;
  updateLightboxImage();
  document.getElementById('lightbox').classList.add('open');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  App.lightbox.photos = [];
  App.lightbox.index = 0;
}

function navigateLightbox(dir) {
  const total = App.lightbox.photos.length;
  App.lightbox.index = (App.lightbox.index + dir + total) % total;
  updateLightboxImage();
}

function updateLightboxImage() {
  const img = document.getElementById('lightbox-img');
  const counter = document.getElementById('lightbox-counter');
  const url = App.lightbox.photos[App.lightbox.index];

  img.style.opacity = '0';
  img.src = url;
  img.onload = () => { img.style.opacity = '1'; };

  const total = App.lightbox.photos.length;
  counter.textContent = `${App.lightbox.index + 1} / ${total}`;

  // Ocultar flechas si solo hay 1 foto
  document.getElementById('lightbox-prev').style.visibility = total > 1 ? 'visible' : 'hidden';
  document.getElementById('lightbox-next').style.visibility = total > 1 ? 'visible' : 'hidden';
}

// =====================================================================
// CONTADOR DE TIEMPO
// =====================================================================
function initCounter() {
  updateCounter();
  // Actualizar cada hora (no necesita tick en tiempo real)
  setInterval(updateCounter, 3600000);
}

function updateCounter() {
  const startDate = new Date(CONFIG?.START_DATE || '2025-07-05');
  const now = new Date();

  const msTotal = now - startDate;
  const dias = Math.floor(msTotal / (1000 * 60 * 60 * 24));

  // Meses y años (ajustando por el día del mes)
  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  
  if (now.getDate() < startDate.getDate()) {
    months--;
  }
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  const meses = years * 12 + months;

  // Almacenar los valores finales para animar
  App._counterTargets = { dias, meses, anos: years };

  // Si el counter ya está visible, actualizar directo
  const counterSection = document.getElementById('counter');
  if (counterSection && App.counterAnimated) {
    setCounterValues(dias, meses, years);
  }
}

function setCounterValues(dias, meses, anos) {
  document.getElementById('cnt-dias').textContent = dias.toLocaleString('es');
  document.getElementById('cnt-meses').textContent = meses;
  document.getElementById('cnt-anos').textContent = anos;
}

function animateCounter(el, target, duration = 1200) {
  const start = performance.now();
  const startVal = 0;

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Easing: ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startVal + (target - startVal) * eased);
    el.textContent = current.toLocaleString('es');
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function triggerCounterAnimation() {
  if (App.counterAnimated) return;
  App.counterAnimated = true;

  const targets = App._counterTargets || { dias: 0, meses: 0, anos: 0 };
  animateCounter(document.getElementById('cnt-dias'), targets.dias, 1500);
  animateCounter(document.getElementById('cnt-meses'), targets.meses, 1000);
  animateCounter(document.getElementById('cnt-anos'), targets.anos, 800);
}

// =====================================================================
// ANIMACIONES DE SCROLL (Intersection Observer)
// =====================================================================
function initScrollAnimations() {
  const fadeEls = document.querySelectorAll('.fade-up');
  const cardEls = document.querySelectorAll('.chapter-card');

  // Observer para elementos fade-up
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  fadeEls.forEach(el => fadeObserver.observe(el));

  // Observer para las tarjetas (con delay escalonado)
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  cardEls.forEach(el => cardObserver.observe(el));

  // Observer para el contador
  const counterSection = document.getElementById('counter');
  if (counterSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        triggerCounterAnimation();
        counterObserver.disconnect();
      }
    }, { threshold: 0.3 });
    counterObserver.observe(counterSection);
  }
}

// =====================================================================
// REINICIALIZAR ANIMACIONES (se llama tras renderizar tarjetas)
// =====================================================================
function reinitCardAnimations() {
  const cardEls = document.querySelectorAll('.chapter-card:not(.visible)');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  cardEls.forEach(el => cardObserver.observe(el));
}

// =====================================================================
// BOTÓN HERO
// =====================================================================
function initHeroButton() {
  const btn = document.getElementById('btn-enter');
  if (btn) {
    btn.addEventListener('click', () => {
      document.getElementById('chapters')?.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

// =====================================================================
// NAVBAR
// =====================================================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navInicio = document.getElementById('nav-inicio');
  const navCapitulos = document.getElementById('nav-capitulos');
  const toggleBtn = document.getElementById('navbar-dropdown-toggle');
  const dropdownContent = document.getElementById('navbar-years-dropdown');

  if (!navbar) return;

  const handleScroll = () => {
    const scrollPos = window.scrollY;
    const hero = document.getElementById('hero');
    const heroHeight = hero ? hero.offsetHeight : window.innerHeight;

    if (scrollPos > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Activar estados en la navegación
    if (scrollPos < heroHeight - 120) {
      navInicio?.classList.add('active');
      navCapitulos?.classList.remove('active');
    } else {
      navInicio?.classList.remove('active');
      navCapitulos?.classList.add('active');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  navInicio?.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  navCapitulos?.addEventListener('click', e => {
    e.preventDefault();
    const target = document.getElementById('chapters');
    if (target) {
      const navbarHeight = navbar.offsetHeight || 80;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });

  // Toggle dropdown de años al hacer click en la flechita
  toggleBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropdownContent?.classList.toggle('show');
    toggleBtn?.classList.toggle('active');
  });

  // Cerrar dropdown al hacer click en cualquier parte fuera del menu
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar-dropdown')) {
      dropdownContent?.classList.remove('show');
      toggleBtn?.classList.remove('active');
    }
  });

  // Cerrar al seleccionar un año
  dropdownContent?.addEventListener('click', () => {
    dropdownContent?.classList.remove('show');
    toggleBtn?.classList.remove('active');
  });
}

// =====================================================================
// ROUTING POR HASH (para links directos a capítulos)
// =====================================================================
function initHashRouting() {
  const hash = window.location.hash;
  if (hash.startsWith('#chapter-')) {
    const id = hash.replace('#chapter-', '');
    // Esperar a que el contenido esté listo
    setTimeout(() => openChapter(id), 100);
  }

  window.addEventListener('popstate', (e) => {
    if (e.state?.chapterId) {
      openChapter(e.state.chapterId);
    } else {
      closeChapter();
    }
  });
}

// =====================================================================
// HELPERS
// =====================================================================

/**
 * Calcula el número de mes desde el inicio de la relación.
 * Mes 1 = 1 mes después del inicio (e.g. agosto 2025 si empezaron en julio 2025)
 */
function calcMonthNumber(fechaStr) {
  const start = new Date(CONFIG?.START_DATE || '2025-07-05');
  const fecha = new Date(fechaStr);
  const diffMonths =
    (fecha.getFullYear() - start.getFullYear()) * 12 +
    (fecha.getMonth() - start.getMonth());
  return Math.max(1, diffMonths);
}

/**
 * Formatea una fecha: "5 de Agosto, 2025" o "Agosto 2025"
 */
function formatDate(fechaStr, long = false) {
  const [year, month, day] = fechaStr.split('-').map(Number);
  const mesNombre = MESES_ES[month - 1];
  return long
    ? `${day} de ${mesNombre}, ${year}`
    : `${mesNombre} ${year}`;
}

/**
 * Escapa HTML para prevenir XSS
 */
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


