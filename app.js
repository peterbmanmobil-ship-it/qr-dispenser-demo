// Minimal, vanilla JS – easy to expand.

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

async function loadConfig() {
  const res = await fetch('config.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Could not load config.json');
  return await res.json();
}

function preferredMarket(availableCodes) {
  const lang = (navigator.language || 'en-US').toUpperCase();
  const parts = lang.split('-');
  const country = parts.length > 1 ? parts[1] : null;
  if (country && availableCodes.includes(country)) return country;
  return null;
}

function normalizeMarket(code) {
  if (code === 'UK') return 'GB';
  return code;
}

function renderSelect(product, productId, supportedMarkets) {
  const select = document.getElementById('marketSelect');
  const goBtn = document.getElementById('goBtn');

  const items = supportedMarkets
    .map(c => normalizeMarket(c))
    .filter(code => product.markets[code])
    .map(code => ({ code, label: product.markets[code].label, url: product.markets[code].url }));

  items.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));

  select.innerHTML = '';

  // Placeholder
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Choose country';
  placeholder.disabled = true;
  placeholder.selected = true;
  select.appendChild(placeholder);

  items.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.code;
    opt.textContent = m.label;
    select.appendChild(opt);
  });

  function setGoEnabled(enabled) {
    if (enabled) {
      goBtn.classList.remove('disabled');
      goBtn.setAttribute('aria-disabled', 'false');
      goBtn.style.pointerEvents = 'auto';
    } else {
      goBtn.classList.add('disabled');
      goBtn.setAttribute('aria-disabled', 'true');
      goBtn.href = '#';
      goBtn.style.pointerEvents = 'none';
    }
  }

  // OPTIONAL: auto-preselect based on saved/guess/default.
  // Uncomment if you want faster repeat scans.
  /*
  const saved = localStorage.getItem('qr_demo_market');
  const guess = preferredMarket(items.map(x => x.code));
  const defaultMarket = normalizeMarket(product.defaultMarket || 'US');

  let chosen = null;
  if (saved && product.markets[saved]) chosen = saved;
  else if (guess && product.markets[guess]) chosen = guess;
  else if (product.markets[defaultMarket]) chosen = defaultMarket;

  if (chosen) {
    select.value = chosen;
  }
  */

  setGoEnabled(select.value !== '');

  function syncGoLink() {
    const code = select.value;
    const url = product.markets[code]?.url;
    if (url) {
      goBtn.href = url;
      setGoEnabled(true);
    } else {
      setGoEnabled(false);
    }
  }

  select.addEventListener('change', syncGoLink);
  syncGoLink();

  goBtn.addEventListener('click', () => {
    if (!select.value) return;
    localStorage.setItem('qr_demo_market', select.value);
    localStorage.setItem('qr_demo_product', productId);
  });
}

(async function init() {
  const cfg = await loadConfig();

  const productId = getQueryParam('p') || '564500';
  const product = cfg.products[productId] || cfg.products['564500'];

  document.getElementById('title').textContent = cfg.ui.title || 'Choose country';
  document.getElementById('productPill').textContent = `Product: ${productId}`;

  document.getElementById('faqLink').href = cfg.ui.faqLink + `?p=${encodeURIComponent(productId)}`;
  document.getElementById('feedbackLink').href = cfg.ui.feedbackLink + `?p=${encodeURIComponent(productId)}`;

  renderSelect(product, productId, cfg.ui.supportedMarkets || []);
})();
