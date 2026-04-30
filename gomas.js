/* ============================================================
   GOMAS DE VINAGRE DE MANZANA — JS
   ============================================================ */

// ---- Header scroll effect ----
const gHeader = document.getElementById('gHeader');
window.addEventListener('scroll', () => {
  gHeader.classList.toggle('scrolled', window.scrollY > 20);
});

// ---- Hamburger menu ----
const gHamburger = document.getElementById('gHamburger');
const gNav = document.getElementById('gNav');
gHamburger?.addEventListener('click', () => {
  gNav.classList.toggle('open');
  gHamburger.classList.toggle('open');
});
gNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    gNav.classList.remove('open');
    gHamburger.classList.remove('open');
  });
});

// ---- Pack selector ----
function gSelectPack(el) {
  document.querySelectorAll('.g-pack').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('gCantidad').value = el.dataset.qty;
}

// ---- Countdown timer (15 min) ----
(function () {
  const stored = sessionStorage.getItem('gTimerEnd');
  let end = stored ? parseInt(stored) : Date.now() + 15 * 60 * 1000;
  if (!stored) sessionStorage.setItem('gTimerEnd', end);

  function updateTimer() {
    const remaining = Math.max(0, end - Date.now());
    const m = String(Math.floor(remaining / 60000)).padStart(2, '0');
    const s = String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0');
    const el = document.getElementById('gTimer');
    if (el) el.textContent = `${m}:${s}`;
    if (remaining > 0) requestAnimationFrame(updateTimer);
  }
  updateTimer();
})();

// ---- Reveal on scroll ----
const revealEls = document.querySelectorAll('.g-reveal, .g-reveal-left, .g-reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

// ---- Stock counter animation ----
const stockEl = document.getElementById('stockCount');
if (stockEl) {
  let count = 47;
  setInterval(() => {
    if (Math.random() < 0.15 && count > 10) {
      count--;
      stockEl.textContent = count;
    }
  }, 8000);
}

// ---- Order form submit ----
const gOrderForm = document.getElementById('gOrderForm');
gOrderForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = document.getElementById('gNombre').value.trim();
  const telefono = document.getElementById('gTelefono').value.trim();
  const ciudad = document.getElementById('gCiudad').value.trim();
  const depto = document.getElementById('gDepto').value.trim();
  const direccion = document.getElementById('gDireccion').value.trim();
  const cantidad = document.getElementById('gCantidad').value;

  const packNames = {
    '1': '1 Frasco Gomas Vinagre de Manzana ($49.900)',
    '2': '2 Frascos Gomas Vinagre de Manzana ($89.900)',
    '3': '3 Frascos Gomas Vinagre de Manzana ($129.900)',
  };

  const msg = [
    '🍏 *Pedido — Gomas de Vinagre de Manzana*',
    '━━━━━━━━━━━━━━━━━━━━━━━',
    `📦 *Pack:* ${packNames[cantidad] || packNames['1']}`,
    `👤 *Nombre:* ${nombre}`,
    `📱 *Celular:* ${telefono}`,
    `📍 *Ciudad:* ${ciudad}, ${depto}`,
    `🏠 *Dirección:* ${direccion}`,
    '━━━━━━━━━━━━━━━━━━━━━━━',
    '💳 Pago contraentrega al recibir',
  ].join('\n');

  const btn = document.getElementById('gSubmitBtn');
  btn.querySelector('span').textContent = 'Redirigiendo...';
  btn.disabled = true;

  setTimeout(() => {
    window.open(`https://wa.me/573001234567?text=${encodeURIComponent(msg)}`, '_blank');
    btn.querySelector('span').textContent = '✓ Pedido Enviado';
    btn.style.background = 'linear-gradient(135deg, #2D6A2D, #1A3020)';
  }, 600);
});

// ---- Social Proof Popup ----
const cities = [
  'Bogotá', 'Medellín', 'Cali', 'Barranquilla',
  'Cartagena', 'Bucaramanga', 'Pereira', 'Manizales',
  'Cúcuta', 'Santa Marta', 'Ibagué', 'Villavicencio',
];
const actions = [
  'acaba de hacer su pedido',
  'agregó 2 frascos al carrito',
  'acaba de confirmar su pedido',
  'está viendo este producto',
];
const times = [
  'Hace 1 minuto', 'Hace 2 minutos', 'Hace 3 minutos',
  'Hace 5 minutos', 'Hace 7 minutos', 'Hace 10 minutos',
];

function showGNotif() {
  const city = cities[Math.floor(Math.random() * cities.length)];
  const action = actions[Math.floor(Math.random() * actions.length)];
  const time = times[Math.floor(Math.random() * times.length)];

  const notif = document.getElementById('gNotif');
  const notifText = document.getElementById('gNotifText');
  const notifTime = document.getElementById('gNotifTime');

  if (!notif || !notifText || !notifTime) return;

  notifText.textContent = `Alguien en ${city} ${action}`;
  notifTime.textContent = time;

  notif.classList.add('show');
  setTimeout(() => notif.classList.remove('show'), 4000);
}

setTimeout(showGNotif, 4000);
setInterval(showGNotif, 14000);
