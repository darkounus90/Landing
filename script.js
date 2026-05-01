/* =============================================
   RETO 21 DIAS — script.js
   ============================================= */

// ══════════════════════════════════════════════
//  ⚙️  CONFIGURACIÓN — cambia solo estos datos
// ══════════════════════════════════════════════
const CONFIG = {
  whatsappNumber: '573001234567', // Tu número real

  packs: {
    '1': 'Reto 21 Días Básico — $27.00 USD',
    '2': 'Reto 21 Días VIP — $37.00 USD',
  }
};
// ══════════════════════════════════════════════

function selectPack(el) {
  document.querySelectorAll('.promo-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('cantidad').value = el.dataset.val;
}

function startTimer(seconds, el) {
  let t = seconds;
  const tick = () => {
    const m = String(Math.floor(t / 60)).padStart(2, '0');
    const s = String(t % 60).padStart(2, '0');
    el.textContent = `${m}:${s}`;
    if (--t < 0) t = seconds;
  };
  tick();
  setInterval(tick, 1000);
}

function initHeader() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = links.style.display === 'flex';
    links.style.display = open ? '' : 'flex';
    links.style.flexDirection = 'column';
    links.style.position = 'absolute';
    links.style.top = '100%';
    links.style.left = '0';
    links.style.right = '0';
    links.style.background = 'var(--cream)';
    links.style.padding = '16px 24px 24px';
    links.style.borderBottom = '1.5px solid var(--border)';
    links.style.gap = '20px';
    links.style.zIndex = '800';
    if (open) links.style.display = 'none';
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => { links.style.display = 'none'; });
  });
}

function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

const COUNTRIES = ['México', 'Colombia', 'España', 'Estados Unidos', 'Perú', 'Chile', 'Ecuador', 'Argentina'];
const NAMES  = ['Andrea M.', 'Claudia R.', 'Marta B.', 'Julia C.', 'Patricia G.', 'Roberta H.', 'Sandra L.', 'Fernanda T.', 'Natalia P.', 'Laura F.'];

function showNotif() {
  const popup    = document.getElementById('notifPopup');
  const textEl   = document.getElementById('notifText');
  const timeEl   = document.getElementById('notifTime');
  if (!popup) return;

  const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  const mins = Math.floor(Math.random() * 10) + 1;

  textEl.innerHTML = `<strong>${name}</strong> en ${country} acaba de unirse`;
  timeEl.textContent = `Hace ${mins} minuto${mins > 1 ? 's' : ''}`;

  popup.classList.add('show');
  setTimeout(() => popup.classList.remove('show'), 5500);
}

// Removed initForm and openSuccessModal as they are no longer needed.

window.addEventListener('DOMContentLoaded', () => {
  const timerEl = document.getElementById('timer');
  if (timerEl) startTimer(15 * 60, timerEl);

  initHeader();
  initHamburger();
  initReveal();

  setTimeout(showNotif, 4000);
  setInterval(showNotif, Math.random() * 12000 + 18000);
});
