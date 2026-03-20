/* =============================================
   VIDA SANA — script.js v3.0
   ============================================= */

// ══════════════════════════════════════════════
//  ⚙️  CONFIGURACIÓN — cambia solo estos datos
// ══════════════════════════════════════════════
const CONFIG = {
  // Número de WhatsApp donde recibirás los pedidos
  // Formato: código de país + número, SIN + ni espacios
  // Ejemplo Colombia: 573001234567
  whatsappNumber: '573001234567',   // ← CAMBIA ESTO por tu número real

  // 📦 CONFIGURACIÓN DROPI
  dropiToken: 'PEGA_AQUI_EL_TOKEN_QUE_COPIASTE',
  dropiProductId: 1815410, // ID del L-Treonato en Dropi

  // Texto del pack según el valor seleccionado
  packs: {
    '1': '1 Frasco (100 Softgels) — $89.900',
    '2': '2 Frascos — $169.900',
    '3': '3 Frascos — $239.900',
  }
};
// ══════════════════════════════════════════════

// ── Pack selector ─────────────────────────────
function selectPack(el) {
  document.querySelectorAll('.promo-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('cantidad').value = el.dataset.val;
}

// ── Countdown Timer (Persistent) ─────────────────
function startTimer(durationSeconds, el) {
  const storageKey = 'vida_sana_timer_end';
  let endTime = localStorage.getItem(storageKey);

  const now = Math.floor(Date.now() / 1000);

  if (!endTime || now > parseInt(endTime)) {
    endTime = now + durationSeconds;
    localStorage.setItem(storageKey, endTime);
  } else {
    endTime = parseInt(endTime);
  }

  const tick = () => {
    const currentNow = Math.floor(Date.now() / 1000);
    let remaining = endTime - currentNow;

    if (remaining < 0) {
      // Reiniciar si llega a cero (opcional, o detenerlo)
      endTime = Math.floor(Date.now() / 1000) + durationSeconds;
      localStorage.setItem(storageKey, endTime);
      remaining = durationSeconds;
    }

    const m = String(Math.floor(remaining / 60)).padStart(2, '0');
    const s = String(remaining % 60).padStart(2, '0');
    el.textContent = `${m}:${s}`;
  };

  tick();
  setInterval(tick, 1000);
}

// ── Header scroll effect ──────────────────────
function initHeader() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

// ── Hamburger menu ────────────────────────────
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

  // Close when a link is clicked
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => { links.style.display = 'none'; });
  });
}

// ── Scroll Reveal ─────────────────────────────
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

// ── Social Proof Notification ─────────────────
const CITIES = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga', 'Cartagena', 'Pereira', 'Manizales', 'Ibagué', 'Cúcuta'];
const NAMES  = ['Andrés M.', 'Claudia R.', 'Martha B.', 'Julián C.', 'Patricia G.', 'Roberto H.', 'Sandra L.', 'Felipe T.', 'Natalia P.', 'Laura F.'];

function showNotif() {
  const popup    = document.getElementById('notifPopup');
  const textEl   = document.getElementById('notifText');
  const timeEl   = document.getElementById('notifTime');
  if (!popup) return;

  const city = CITIES[Math.floor(Math.random() * CITIES.length)];
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  const mins = Math.floor(Math.random() * 10) + 1;

  textEl.innerHTML = `<strong>${name}</strong> en ${city} acaba de pedir`;
  timeEl.textContent = `Hace ${mins} minuto${mins > 1 ? 's' : ''}`;

  popup.classList.add('show');
  setTimeout(() => popup.classList.remove('show'), 5500);
}

// ── Form logic (Dropi + WhatsApp) ─────────────
function initForm() {
  const form = document.getElementById('orderForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const btn = document.getElementById('submitBtn');
    const [line1, line2] = btn.querySelectorAll('span');

    // Collect order data
    const order = {
      nombre:    document.getElementById('nombre').value.trim(),
      telefono:  document.getElementById('telefono').value.trim(),
      ciudad:    document.getElementById('ciudad').value.trim(),
      depto:     document.getElementById('depto').value.trim(),
      direccion: document.getElementById('direccion').value.trim(),
      cantidad:  parseInt(document.getElementById('cantidad').value) || 1,
    };

    // Split name and lastname
    const nameParts = order.nombre.split(' ');
    const firstName = nameParts[0] || '';
    const lastName  = nameParts.slice(1).join(' ') || '.';

    // Prices mapping
    const prices = { 1: 89900, 2: 169900, 3: 239900 };
    const totalPrice = prices[order.cantidad] || 89900;

    // Loading state
    btn.disabled = true;
    btn.style.opacity = '0.75';
    line1.textContent = 'Enviando pedido…';
    line2.textContent = 'Un momento por favor';

    // 📦 Dropi API Payload
    const payload = {
      first_name: firstName,
      last_name: lastName,
      phone: order.telefono,
      city: order.ciudad,
      department: order.depto,
      address: order.direccion,
      total: totalPrice,
      products: [
        {
          id: CONFIG.dropiProductId,
          quantity: order.cantidad,
          price: 89900 // Precio base por unidad para Dropi
        }
      ],
      payment_method: "contraentrega",
      note: `Pedido desde Web - Pack x${order.cantidad}`
    };

    try {
      const response = await fetch('https://api.dropi.co/api/integrations/woocomerce/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.dropiToken}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        // SUCCESS — Order created on Dropi
        btn.style.opacity = '1';
        btn.style.background = '#28a745'; // Green
        line1.textContent = '¡Pedido Recibido! ✓';
        line2.textContent = 'Procesando confirmación…';

        // Prepare WhatsApp message (Keep this as fallback/secondary)
        const packDesc = CONFIG.packs[order.cantidad] || order.cantidad + ' frasco(s)';
        const msg = [
          `🛒 *NUEVO PEDIDO — Vida Sana*`,
          ``,
          `🆔 *ID Dropi:* ${data.id || data.order_id || 'N/A'}`,
          `👤 *Nombre:* ${order.nombre}`,
          `📱 *Celular:* ${order.telefono}`,
          `📦 *Pedido:* ${packDesc}`,
          ``,
          `📍 *Dirección de entrega:*`,
          `${order.direccion}`,
          `${order.ciudad}, ${order.depto}`,
          ``,
          `💳 *Pago:* Contraentrega al recibir`,
          `✅ *Pedido registrado en Dropi*`,
        ].join('\n');

        const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;

        setTimeout(() => {
          // Open WhatsApp if you want specific confirmation
          window.open(waUrl, '_blank');
          
          // Show success modal
          openSuccessModal(order.nombre);

          // Reset everything after modal
          setTimeout(() => {
            btn.disabled = false;
            btn.style.background = '';
            line1.textContent = 'Confirmar Pedido';
            line2.textContent = 'Pago en casa al recibir';
            form.reset();
            document.querySelectorAll('.promo-pill').forEach((p, i) => p.classList.toggle('active', i === 0));
            document.getElementById('cantidad').value = '1';
          }, 4000);
        }, 1500);

      } else {
        throw new Error(data.message || 'Error en respuesta de servidor');
      }

    } catch (error) {
      console.error('Error Dropi:', error);
      btn.disabled = false;
      btn.style.opacity = '1';
      line1.textContent = 'Error al enviar';
      line2.textContent = 'Intenta de nuevo';
      alert('Hubo un problema al procesar tu pedido. Por favor intenta de nuevo o contáctanos por WhatsApp.');
    }
  });
}

// ── Success Modal ─────────────────────────────
function openSuccessModal(nombre) {
  const existing = document.getElementById('vsModal');
  if (existing) existing.remove();

  const m = document.createElement('div');
  m.id = 'vsModal';
  m.innerHTML = `
    <style>
      #vsModal {
        position: fixed; inset: 0; z-index: 99999;
        background: rgba(14,34,24,0.8);
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
        box-shadow: 0 40px 80px rgba(14,34,24,0.3);
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
        background: var(--forest);
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
      #vsModal .close-btn:hover { background: var(--terra); }
    </style>
    <div class="box">
      <span class="emoji">🎉</span>
      <h3>¡Listo, ${nombre ? nombre.split(' ')[0] : 'amigo/a'}!</h3>
      <p>
        Tu pedido en <strong>Vida Sana</strong> ha sido registrado.<br>
        Te contactaremos por <strong>WhatsApp</strong> para confirmar los detalles del envío.<br><br>
        <strong>Recuerda: pagas solo cuando recibes tu pedido en casa. 🏠</strong>
      </p>
      <button class="close-btn" onclick="document.getElementById('vsModal').remove()">¡Entendido!</button>
    </div>
  `;

  document.body.appendChild(m);
  m.addEventListener('click', e => { if (e.target === m) m.remove(); });
}

// ── FAQ Accordion ─────────────────────────────
function initFaq() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all others
      items.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        const ans = item.querySelector('.faq-answer');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });
}

// ── Init ──────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  // Timer
  const timerEl = document.getElementById('timer');
  if (timerEl) startTimer(15 * 60, timerEl);

  initHeader();
  initHamburger();
  initReveal();
  initForm();
  initFaq();

  // First notification after 4s, then random 18–30s
  setTimeout(showNotif, 4000);
  setInterval(showNotif, Math.random() * 12000 + 18000);
});
