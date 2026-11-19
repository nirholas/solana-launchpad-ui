/* ================================================================
   Page behaviour for the launchpad template.
   Everything shown is mock data; nothing talks to a wallet or chain.
   Markup is built with DOM APIs and textContent, never innerHTML.
   ================================================================ */

import {
  TOKENS, CREATORS, CREATOR_COLORS, FEATURED, WALLET, MOCK_SOL_USD, rand, randItem, shuffle,
} from './mock-data.js';
import { TOKEN_DECIMALS, initialCurve, curveAtProgress, marketCapSol, quoteBuy } from './curve.js';
import { parseUnits, formatUnits, toUnits, formatUsdCompact, formatTokens } from './format.js';
import { SOL_DECIMALS, tradeQuote } from './trade-quote.js';

// ── DOM helpers ──

/** Create an element. Strings in `children` become text nodes. */
function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value == null || value === false) continue;
    if (key === 'class') el.className = value;
    else if (key === 'style') Object.assign(el.style, value);
    else el.setAttribute(key, value === true ? '' : value);
  }
  el.append(...children.flat().filter(c => c != null && c !== false));
  return el;
}

function gradient(colors) {
  return { background: `linear-gradient(135deg, ${colors})` };
}

// ── Status messages ──

let toastTimer;
function notify(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 4000);
}

function initStatus() {
  document.body.append(h('div', { id: 'toast', class: 'toast', role: 'status', 'aria-live': 'polite' }));
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-demo]');
    if (trigger) notify(trigger.dataset.demo);
  });
}

// ── Mobile nav ──

function initMobileNav() {
  const toggle = document.getElementById('mobileToggle');
  const nav = document.getElementById('mobileNav');
  if (!toggle || !nav) return;
  const setOpen = open => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      setOpen(false);
      toggle.focus();
    }
  });
}

// ── Tabs (WAI-ARIA tabs pattern) ──

function initTablist(list) {
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const select = (tab, focus) => {
    for (const t of tabs) {
      const selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !selected;
    }
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab, false));
    tab.addEventListener('keydown', e => {
      const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      select(tabs[(next + tabs.length) % tabs.length], true);
    });
  });
}

/** A group of toggle buttons where exactly one is pressed. */
function initPressedGroup(group, onChange) {
  const buttons = [...group.querySelectorAll('button[aria-pressed]')];
  group.addEventListener('click', e => {
    const btn = e.target.closest('button[aria-pressed]');
    if (!btn || !buttons.includes(btn) || btn.getAttribute('aria-pressed') === 'true') return;
    for (const b of buttons) b.setAttribute('aria-pressed', String(b === btn));
    if (onChange) onChange(btn);
  });
}

/** Static progress bars carry their width in data-fill so markup needs no style attribute. */
function applyFills(root = document) {
  for (const el of root.querySelectorAll('[data-fill]')) el.style.width = `${el.dataset.fill}%`;
}

// ── Activity ticker ──

function randomActivity() {
  return {
    token: randItem(TOKENS),
    user: randItem(CREATORS),
    action: randItem(['bought', 'sold', 'created']),
    sol: (Math.random() * 19.9 + 0.1).toFixed(2),
    age: rand(1, 59),
  };
}

function tickerItem({ token, user, action, sol, age }) {
  const cls = action === 'bought' ? 'green' : action === 'sold' ? 'red' : 'gradient-text';
  return h('div', { class: 'ticker-item' },
    h('span', { class: 'ticker-avatar', style: gradient(token.color), 'aria-hidden': 'true' }, token.emoji),
    h('span', { class: 'ticker-user' }, user),
    h('span', { class: cls }, action),
    action !== 'created' && h('span', {}, `${sol} SOL of`),
    h('span', { class: 'ticker-token' }, token.name),
    h('span', { class: 'ticker-age' }, `${age}s ago`),
  );
}

function renderTicker(track) {
  const activity = Array.from({ length: 30 }, randomActivity);
  // The second copy only exists so the scroll loops seamlessly. It is built
  // afresh rather than cloned: a cloned style attribute can trip the CSP.
  const copies = activity.map(item => {
    const copy = tickerItem(item);
    copy.setAttribute('aria-hidden', 'true');
    return copy;
  });
  track.replaceChildren(...activity.map(tickerItem), ...copies);
}

// ── Token cards ──

function tokenCard(token, { index, king = false, creator = randItem(CREATORS) }) {
  // Market cap is whatever the curve gives at the card's progress.
  const progress = king ? Math.round(FEATURED.progress * 100) : rand(5, 98);
  const mcap = marketCapSol(curveAtProgress(progress / 100)) * MOCK_SOL_USD;
  const change = king ? FEATURED.change24h : rand(-30, 500);
  const badge = king
    ? h('span', { class: 'token-card-badge king' }, '👑 King')
    : rand(0, 5) === 0 && h('span', { class: 'token-card-badge' }, '✨ New');

  return h('article', {
    class: 'token-card fade-in',
    style: { animationDelay: `${index * 50}ms` },
    'data-search': `${token.name} ${token.ticker}`.toLowerCase(),
  },
    badge,
    h('div', { class: 'token-card-img', style: gradient(token.color), 'aria-hidden': 'true' }, token.emoji),
    h('div', { class: 'token-card-body' },
      h('div', { class: 'token-card-header' },
        h('span', { class: 'token-card-avatar', style: gradient(randItem(CREATOR_COLORS)), 'aria-hidden': 'true' }, '👤'),
        h('span', { class: 'token-card-creator' }, creator),
        h('span', { class: 'token-card-age' }, `${rand(1, 59)}m ago`),
      ),
      h('h3', { class: 'token-card-name' },
        h('a', { class: 'token-card-link', href: 'token.html' }, token.name),
        h('span', { class: 'token-card-ticker' }, token.ticker),
      ),
      h('p', { class: 'token-card-desc' }, token.desc),
      h('div', { class: 'bonding-progress' },
        h('div', { class: 'bonding-progress-header' },
          h('span', {}, 'bonding curve'),
          h('span', { class: progress > 80 ? 'green' : '' }, `${progress}%`),
        ),
        h('div', { class: 'bonding-progress-bar' },
          h('div', { class: 'bonding-progress-fill', style: { width: `${progress}%` } }),
        ),
      ),
      h('div', { class: 'token-card-stats' },
        h('span', { class: 'token-stat' },
          h('span', { class: 'token-stat-label' }, 'mkt cap: '),
          h('span', { class: 'token-stat-value' }, formatUsdCompact(mcap)),
        ),
        h('span', { class: 'token-stat' },
          h('span', { class: 'token-stat-label' }, 'replies: '),
          h('span', { class: 'token-stat-value' }, String(rand(2, 342))),
        ),
        h('span', { class: `token-stat ${change >= 0 ? 'green' : 'red'}` }, `${change >= 0 ? '+' : ''}${change}%`),
      ),
    ),
  );
}

/** Append `count` shuffled cards. `king` puts the King of the Hill token first. */
function appendCards(grid, count, { king = false, creator } = {}) {
  let tokens = shuffle(TOKENS).slice(0, count);
  if (king) tokens = [TOKENS[0], ...tokens.filter(t => t !== TOKENS[0])].slice(0, count);
  grid.append(...tokens.map((token, index) => tokenCard(token, { index, king: king && index === 0, creator })));
}

// ── Search ──

/**
 * The header search is a GET form to the board. On the board it filters
 * the loaded cards as you type; returns the function that reapplies it.
 */
function initBoardSearch(grid) {
  const input = document.querySelector('.header-search input');
  const noResults = document.getElementById('noResults');
  input.value = new URLSearchParams(location.search).get('q') ?? '';

  const apply = () => {
    const query = input.value.trim().toLowerCase();
    let shown = 0;
    for (const card of grid.children) {
      card.hidden = !card.dataset.search.includes(query);
      if (!card.hidden) shown++;
    }
    noResults.hidden = shown > 0;
  };
  input.addEventListener('input', apply);
  input.form.addEventListener('submit', e => {
    e.preventDefault();
    apply();
  });
  return apply;
}

// ── Pages ──

function initBoard() {
  renderTicker(document.getElementById('tickerTrack'));
  const tickerToggle = document.getElementById('tickerToggle');
  tickerToggle.addEventListener('click', () => {
    const paused = tickerToggle.getAttribute('aria-pressed') !== 'true';
    tickerToggle.setAttribute('aria-pressed', String(paused));
    tickerToggle.textContent = paused ? 'Play' : 'Pause';
    document.getElementById('ticker').classList.toggle('paused', paused);
  });

  const grid = document.getElementById('tokenGrid');
  const applySearch = initBoardSearch(grid);
  appendCards(grid, TOKENS.length, { king: true });
  applySearch();

  initPressedGroup(document.getElementById('boardTabs'), () => {
    grid.replaceChildren();
    appendCards(grid, TOKENS.length, { king: true });
    applySearch();
  });
  document.getElementById('loadMore').addEventListener('click', () => {
    appendCards(grid, 8);
    applySearch();
  });
}

function initCreate() {
  const toggle = document.getElementById('advancedToggle');
  const panel = document.getElementById(toggle.getAttribute('aria-controls'));
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  });

  const file = document.getElementById('fileInput');
  const fileName = document.getElementById('fileName');
  file.addEventListener('change', () => {
    fileName.textContent = file.files.length ? file.files[0].name : 'PNG, JPG, GIF (max 5MB)';
  });

  const initialBuy = document.getElementById('initialBuy');
  const initialBuyQuote = document.getElementById('initialBuyQuote');
  initialBuy.addEventListener('input', () => {
    const lamports = parseUnits(initialBuy.value, SOL_DECIMALS);
    if (!initialBuy.value.trim()) initialBuyQuote.textContent = '';
    else if (lamports === null) initialBuyQuote.textContent = 'Enter an amount such as 0.5.';
    else {
      const q = quoteBuy(initialCurve(), lamports);
      initialBuyQuote.textContent = `You would receive about ${formatTokens(toUnits(q.tokensOut, TOKEN_DECIMALS))} tokens at the launch price, after the 1% fee.`;
    }
  });

  document.getElementById('createForm').addEventListener('submit', e => {
    e.preventDefault();
    notify('Demo only: token creation is not connected to any blockchain.');
  });
}

function initToken() {
  initTablist(document.getElementById('detailTabs'));
  initPressedGroup(document.getElementById('timeframes'));

  const curve = curveAtProgress(FEATURED.progress);
  const ticker = FEATURED.token.ticker;
  const amount = document.getElementById('tradeAmount');
  const submit = document.getElementById('tradeBtn');
  const quote = document.getElementById('tradeQuote');
  const quickAmounts = document.getElementById('quickAmounts');
  const quickPercents = document.getElementById('quickPercents');
  let mode = 'buy';

  const renderQuote = () => {
    const q = tradeQuote(curve, { mode, text: amount.value, ticker, wallet: WALLET });
    quote.classList.toggle('trade-quote-error', Boolean(q.error));
    amount.setAttribute('aria-invalid', String(Boolean(q.error)));
    if (q.main) quote.replaceChildren(h('strong', {}, q.main), h('span', {}, q.detail));
    else quote.textContent = q.error || q.message;
  };

  initPressedGroup(document.getElementById('tradeMode'), btn => {
    mode = btn.dataset.mode;
    const buy = mode === 'buy';
    submit.classList.toggle('buy-btn', buy);
    submit.classList.toggle('sell-btn', !buy);
    submit.textContent = buy ? 'Place buy' : 'Place sell';
    document.getElementById('tradeUnit').textContent = buy ? 'SOL' : ticker;
    // SVG elements have no `hidden` property, so toggle display directly.
    document.getElementById('tradeUnitIcon').style.display = buy ? '' : 'none';
    document.getElementById('tradeBalance').textContent = buy
      ? `Balance: ${WALLET.sol} SOL`
      : `Balance: ${formatTokens(Number(WALLET.tokens))} ${ticker}`;
    quickAmounts.hidden = !buy;
    quickPercents.hidden = buy;
    amount.value = '';
    renderQuote();
  });

  amount.addEventListener('input', renderQuote);
  quickAmounts.addEventListener('click', e => {
    const btn = e.target.closest('[data-amount]');
    if (!btn) return;
    amount.value = btn.dataset.amount === '0' ? '' : btn.dataset.amount;
    renderQuote();
  });
  quickPercents.addEventListener('click', e => {
    const btn = e.target.closest('[data-percent]');
    if (!btn) return;
    const tokens = parseUnits(WALLET.tokens, TOKEN_DECIMALS) * BigInt(btn.dataset.percent) / 100n;
    amount.value = tokens === 0n ? '' : formatUnits(tokens, TOKEN_DECIMALS);
    renderQuote();
  });
  submit.addEventListener('click', () => notify('Demo only: no trade was placed.'));

  document.getElementById('replyForm').addEventListener('submit', e => {
    e.preventDefault();
    notify('Demo only: replies are not posted anywhere.');
  });
}

function initProfile() {
  initTablist(document.getElementById('profileTabs'));
  appendCards(document.getElementById('createdTokenGrid'), 6, { creator: 'degen_420.sol' });
  appendCards(document.getElementById('heldTokenGrid'), 8);
  appendCards(document.getElementById('favTokenGrid'), 4);
}

const PAGES = { board: initBoard, create: initCreate, token: initToken, profile: initProfile };

initStatus();
initMobileNav();
applyFills();
PAGES[document.body.dataset.page]?.();
