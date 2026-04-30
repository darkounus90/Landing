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

function initForm() {
  const form = document.getElementById('orderForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const btn   = document.getElementById('submitBtn');
    const [line1, line2] = btn.querySelectorAll('span');

    const order = {
      nombre:   document.getElementById('nombre').value.trim(),
      email:    document.getElementById('email').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      cantidad: document.getElementById('cantidad').value,
    };

    btn.disabled = true;
    btn.style.opacity = '0.75';
    line1.textContent = 'Procesando...';
    line2.textContent = 'Un momento por favor';

    const packDesc = CONFIG.packs[order.cantidad] || 'Reto 21 Días VIP';
    const msg = [
      `🚀 *NUEVO REGISTRO — RETO 21 DÍAS*`,
      ``,
      `👤 *Nombre:* ${order.nombre}`,
      `📧 *Email:* ${order.email}`,
      `📱 *WhatsApp:* ${order.telefono}`,
      `📦 *Plan Seleccionado:* ${packDesc}`,
      ``,
      `✅ *Quiero recibir el enlace de pago seguro para unirme al reto*`,
    ].join('\n');

    const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;

    setTimeout(() => {
      btn.style.opacity = '1';
      btn.style.background = 'var(--leaf)';
      line1.textContent = '¡Registro Exitoso! ✓';
      line2.textContent = 'Abriendo WhatsApp…';

      window.open(waUrl, '_blank');
      openSuccessModal(order.nombre);

      setTimeout(() => {
        btn.disabled = false;
        btn.style.background = '';
        line1.textContent = 'Acceder al Reto Ahora';
        line2.textContent = 'Pago seguro e inmediato';
        form.reset();
        document.querySelectorAll('.promo-pill').forEach((p, i) => p.classList.toggle('active', i === 1)); // VIP is default
        document.getElementById('cantidad').value = '2';
      }, 5500);

    }, 1200);
  });
}

function openSuccessModal(nombre) {
  const existing = document.getElementById('vsModal');
  if (existing) existing.remove();

  const m = document.createElement('div');
  m.id = 'vsModal';
  m.innerHTML = `
    <style>
      #vsModal {
        position: fixed; inset: 0; z-index: 99999;
        background: rgba(16,16,16,0.8);
        backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: center;
        padding: 20px;
        animation: mFadeIn 0.35s ease;
      }
      @keyframes mFadeIn { from { opacity: 0; } to { opacity: 1; } }

      #vsModal .box {
        background: var(--off-white);
        border: 1.5px solid var(--border);
        border-radius: 28px;
        padding: clamp(32px, 6vw, 60px);
        max-width: 460px;
        width: 100%;
        text-align: center;
        box-shadow: 0 40px 80px rgba(0,0,0,0.3);
        animation: mSlideUp 0.45s cubic-bezier(0.34,1.4,0.64,1) 0.1s both;
      }
      @keyframes mSlideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

      #vsModal .emoji { font-size: 3.5rem; display: block; margin-bottom: 16px; }
      #vsModal h3 {
        font-family: 'Syne', sans-serif;
        font-size: 1.6rem;
        font-weight: 800;
        color: var(--forest);
        margin-bottom: 14px;
        letter-spacing: -0.5px;
      }
      #vsModal p { font-size: 0.93rem; color: var(--muted); line-height: 1.75; margin-bottom: 28px; }
      #vsModal strong { color: var(--terra); }

      #vsModal .close-btn {
        background: var(--terra);
        color: var(--cream);
        border: none;
        border-radius: 50px;
        padding: 14px 32px;
        font-family: 'Syne', sans-serif;
        font-size: 0.9rem;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.25s;
      }
      #vsModal .close-btn:hover { opacity: 0.9; }
    </style>
    <div class="box">
      <span class="emoji">🎉</span>
      <h3>¡Felicidades, ${nombre ? nombre.split(' ')[0] : 'futura alumna'}!</h3>
      <p>
        Tu lugar está casi asegurado.<br>
        Te estamos redirigiendo a <strong>WhatsApp</strong> para enviarte el enlace de pago seguro.<br><br>
        <strong>Recibirás el acceso en tu correo (${document.getElementById('email').value}) inmediatamente después de realizar tu pago.</strong>
      </p>
      <button class="close-btn" onclick="document.getElementById('vsModal').remove()">Cerrar</button>
    </div>
  `;

  document.body.appendChild(m);
  m.addEventListener('click', e => { if (e.target === m) m.remove(); });
}

window.addEventListener('DOMContentLoaded', () => {
  const timerEl = document.getElementById('timer');
  if (timerEl) startTimer(15 * 60, timerEl);

  initHeader();
  initHamburger();
  initReveal();
  initForm();

  setTimeout(showNotif, 4000);
  setInterval(showNotif, Math.random() * 12000 + 18000);
});
