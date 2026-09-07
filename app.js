const storageKey = 'americanino-cart';
const cart = JSON.parse(localStorage.getItem(storageKey) || '[]');
const count = document.querySelector('.cart-count');
const toast = document.querySelector('.toast');
const money = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

document.querySelectorAll('.logo').forEach((logo) => { logo.textContent = 'AMERICANINO'; });
if (document.title.includes('AMERICA') && !document.title.includes('AMERICANINO')) document.title = document.title.replace('AMERICA', 'AMERICANINO');
document.querySelectorAll('.nav-links').forEach((nav) => {
  if (!nav.querySelector('a[href*="lluvia"]')) {
    const link = document.createElement('a');
    link.href = nav.closest('header')?.querySelector('.logo')?.getAttribute('href')?.startsWith('../') ? '../lluvia/index.html' : 'lluvia/index.html';
    link.textContent = 'Lluvia';
    nav.insertBefore(link, nav.lastElementChild);
  }
});

function saveCart() {
  localStorage.setItem(storageKey, JSON.stringify(cart));
}

function cartUnits() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function cartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function renderCartCount() {
  if (count) count.textContent = cartUnits();
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2200);
}

function addToCart(button) {
  const priceMap = {
    'Chaqueta Denim Clara': 229900,
    'Camisa Esencial': 149900,
    'Vestido Midi Negro': 219900,
    'Pantalón Cargo Verde': 199900,
    'Top Punto Blanco': 99900,
    'Blazer Textura Beige': 299900,
    'Chaqueta Utility Negra': 279900,
    'Camisa Rayas Azul': 169900,
    'Pantalón Recto Café': 189900,
    'Polo Essential Verde': 119900,
    'Gafas Solar 01': 129900,
    'Collar Cadena Dorado': 89900,
    'Tote Canvas Natural': 119900,
    'Cinturón Cuero Café': 109900,
    'Tenis Court Blanco': 179940,
    'Chaqueta Biker Cuero': 314930,
    'Cargo Utility Gris': 99950,
    'Suéter Soft Beige': 116935
  };
  const image = button.dataset.image || button.closest('.product')?.querySelector('img')?.src || '';
  const product = {
    id: button.dataset.productId || button.dataset.product,
    name: button.dataset.product || 'Prenda AMERICANINO',
    price: Number(button.dataset.price || priceMap[button.dataset.product] || 0),
    image
  };
  const existing = cart.find((item) => item.id === product.id);
  if (existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  saveCart();
  renderCartCount();
  showToast(`${product.name} añadido a tu bolsa`);
}

document.querySelectorAll('.quick-add').forEach((button) => {
  button.addEventListener('click', () => addToCart(button));
});

document.querySelectorAll('[data-cart-action="remove"]').forEach((button) => {
  button.addEventListener('click', () => {
    const index = cart.findIndex((item) => item.id === button.dataset.productId);
    if (index !== -1) cart.splice(index, 1);
    saveCart();
    window.location.reload();
  });
});

document.querySelectorAll('[data-cart-action="increase"], [data-cart-action="decrease"]').forEach((button) => {
  button.addEventListener('click', () => {
    const item = cart.find((entry) => entry.id === button.dataset.productId);
    if (!item) return;
    item.quantity += button.dataset.cartAction === 'increase' ? 1 : -1;
    if (item.quantity <= 0) cart.splice(cart.indexOf(item), 1);
    saveCart();
    window.location.reload();
  });
});

const cartSummary = document.querySelector('[data-cart-summary]');
if (cartSummary) {
  const shipping = cartTotal() >= 199000 || cartTotal() === 0 ? 0 : 12000;
  cartSummary.innerHTML = `<p>Subtotal <strong>${money.format(cartTotal())}</strong></p><p>Envío <strong>${shipping ? money.format(shipping) : 'Gratis'}</strong></p><hr><p class="summary-total">Total <strong>${money.format(cartTotal() + shipping)}</strong></p>`;
}

document.querySelectorAll('.checkout-form').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!cart.length) return showToast('Agrega productos antes de continuar');
    const orderNumber = `AM-${Date.now().toString().slice(-6)}`;
    localStorage.removeItem(storageKey);
    form.classList.add('is-complete');
    form.innerHTML = `<div class="success-state"><p class="kicker">Pedido confirmado</p><h2>Gracias por comprar en AMERICANINO.</h2><p>Tu orden <strong>${orderNumber}</strong> fue registrada en modo demostración. No se realizó ningún cobro real.</p><a class="button" href="../index.html">Volver a la tienda</a></div>`;
    renderCartCount();
  });
});

document.querySelectorAll('.newsletter-form').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    form.reset();
    showToast('Gracias por suscribirte');
  });
});

document.querySelectorAll('.icon-button').forEach((button) => {
  if (button.textContent.includes('♧') && !button.closest('a')) {
    button.addEventListener('click', () => {
      window.location.href = window.location.pathname.includes('/index.html') && !window.location.pathname.endsWith('/AMERICA/index.html') ? '../carrito/index.html' : 'carrito/index.html';
    });
  }
});

renderCartCount();
