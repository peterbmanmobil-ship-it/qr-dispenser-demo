// Minimal, vanilla JS – lätt att bygga vidare på.

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

async function loadConfig() {
  const res = await fetch('config.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Kunde inte läsa config.json');
  return await res.json();
}

function preferredMarket(supported) {
  // Försök gissa land via browser-språk. Ex: 'sv-SE' → 'SE'
  const lang = (navigator.language || 'en-US').toUpperCase();
  const parts = lang.split('-');
  const country = parts.length > 1 ? parts[1] : null;
  if (country && supported.includes(country)) return country;
  return null;
}

function renderButtons(product, productId, supportedMarkets) {
  const el = document.getElementById('marketButtons');
  el.innerHTML = '';

  supportedMarkets.forEach(code => {
    const m = product.markets[code];
    if (!m) return;

    const a = document.createElement('a');
    a.className = 'btn';
    a.href = m.url;
    a.setAttribute('data-market', code);
    a.innerHTML = `<div class="btnTitle">${m.label}</div><div class="btnMeta">${code}</div>`;

    // Spara val i localStorage så nästa scan går snabbare
    a.addEventListener('click', () => {
      localStorage.setItem('qr_demo_market', code);
      localStorage.setItem('qr_demo_product', productId);
    });

    el.appendChild(a);
  });
}

(async function init() {
  const cfg = await loadConfig();

  const productId = getQueryParam('p') || 'demo';
  const product = cfg.products[productId] || cfg.products['demo'];

  document.getElementById('title').textContent = cfg.ui.title;
  document.getElementById('subtitle').textContent = cfg.ui.subtitle;
  document.getElementById('productPill').textContent = `Produkt: ${productId}`;

  // Länkar
  document.getElementById('faqLink').href = cfg.ui.faqLink + `?p=${encodeURIComponent(productId)}`;
  document.getElementById('feedbackLink').href = cfg.ui.feedbackLink + `?p=${encodeURIComponent(productId)}`;

  const supported = cfg.ui.supportedMarkets;

  // Om användaren redan valt land tidigare → auto-redirect efter 0.8s
  const saved = localStorage.getItem('qr_demo_market');
  if (saved && supported.includes(saved) && product.markets[saved]) {
    // Visa knappar ändå, men gör en mjuk redirect
    renderButtons(product, productId, supported);
    setTimeout(() => {
      window.location.href = product.markets[saved].url;
    }, 800);
    return;
  }

  renderButtons(product, productId, supported);

  // Markera föreslaget land (om vi kan gissa)
  const guess = preferredMarket(supported);
  if (guess) {
    const btn = document.querySelector(`[data-market="${guess}"]`);
    if (btn) btn.classList.add('recommended');
  }
})();
