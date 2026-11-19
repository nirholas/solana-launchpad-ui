// Structural checks on the static pages, the CSP and the colour tokens.
// Regex-based on purpose: the markup is hand-written and small, and this
// keeps the suite free of dependencies.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(join(root, path), 'utf8');

const APP_PAGES = { 'index.html': 'board', 'create.html': 'create', 'token.html': 'token', 'profile.html': 'profile' };
const ALL_PAGES = [...Object.keys(APP_PAGES), 'docs/index.html'];
const JS_FILES = ['app.js', 'curve.js', 'format.js', 'mock-data.js', 'trade-quote.js', 'docs/docs.js'];

const ids = html => [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
const section = (html, open, close) => {
  const start = html.indexOf(open);
  return start === -1 ? '' : html.slice(start, html.indexOf(close, start) + close.length);
};

for (const page of ALL_PAGES) {
  const html = read(page);

  test(`${page}: document basics`, () => {
    assert.match(html, /^<!doctype html>/i);
    assert.match(html, /<html lang="en">/);
    assert.match(html, /<meta charset="utf-8">/i);
    assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1(\.0)?">/);
    assert.match(html, /<title>[^<]+<\/title>/);
    assert.match(html, /<meta name="description" content="[^"]+">/);
    assert.match(html, /<main\b[^>]*\bid="(main|content)"/);
  });

  test(`${page}: ids are unique and every ARIA reference resolves`, () => {
    const all = ids(html);
    assert.deepEqual(all.filter((id, i) => all.indexOf(id) !== i), []);
    for (const [, attr, value] of html.matchAll(/\s(aria-controls|aria-labelledby|aria-describedby|for)="([^"]+)"/g)) {
      for (const id of value.split(/\s+/)) assert.ok(all.includes(id), `${attr}="${id}"`);
    }
    for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(all.includes(target), `#${target}`);
  });

  test(`${page}: CSP-friendly markup (no inline scripts, handlers or style attributes)`, () => {
    assert.doesNotMatch(html, /\son[a-z]+\s*=/i);
    assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)[^>]*>/);
    assert.doesNotMatch(html, /<style\b/);
    assert.doesNotMatch(html, /\sstyle="/);
    assert.doesNotMatch(html, /href="javascript:/i);
  });

  test(`${page}: links are real`, () => {
    assert.doesNotMatch(html, /href="#"/);
    const base = dirname(page);
    for (const [, url] of html.matchAll(/(?:href|src)="([^"#?]+)[^"]*"/g)) {
      if (/^(https?:|data:|mailto:)/.test(url)) continue;
      assert.ok(existsSync(join(root, base, url)), `${url} from ${page}`);
    }
  });

  test(`${page}: every form control and button has an accessible name`, () => {
    const labelled = [...html.matchAll(/<label\b[^>]*>[\s\S]*?<\/label>/g)].map(m => m[0]);
    for (const [control, attrs] of html.matchAll(/<(?:input|select|textarea)\b([^>]*)>/g)) {
      if (/type="hidden"/.test(attrs)) continue;
      const id = (attrs.match(/\sid="([^"]+)"/) || [])[1];
      const named = /aria-label(ledby)?="/.test(attrs)
        || (id && html.includes(`for="${id}"`))
        || labelled.some(label => label.includes(control));
      assert.ok(named, control);
    }
    for (const [button, attrs, body] of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)) {
      assert.match(attrs, /\stype="(button|submit)"/, `button without type: ${button.slice(0, 80)}`);
      const text = body.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, '').trim();
      assert.ok(text || /aria-label="/.test(attrs), `unnamed button: ${button.slice(0, 80)}`);
    }
    for (const [img] of html.matchAll(/<img\b[^>]*>/g)) assert.match(img, /\salt="/);
  });

  test(`${page}: has a skip link`, () => {
    assert.match(html, /<a class="skip-link" href="#(main|content)">/);
  });
}

test('app pages share one navigation and footer', () => {
  const normalise = s => s.replace(/ aria-current="page"/g, '');
  const parts = Object.keys(APP_PAGES).map(page => {
    const html = read(page);
    return [
      normalise(section(html, '<nav class="nav"', '</nav>')),
      normalise(section(html, '<nav class="mobile-nav"', '</nav>')),
      section(html, '<form class="header-search"', '</form>'),
      section(html, '<footer', '</footer>'),
    ];
  });
  for (const other of parts.slice(1)) assert.deepEqual(other, parts[0]);
  for (const part of parts[0]) assert.ok(part.length > 0);
});

test('each app page marks itself current, shows the demo notice and loads app.js as a module', () => {
  for (const [page, name] of Object.entries(APP_PAGES)) {
    const html = read(page);
    assert.match(html, new RegExp(`<body data-page="${name}">`));
    assert.match(html, new RegExp(`<a href="${page}" class="nav-link" aria-current="page">`));
    assert.match(html, /<p class="demo-notice" role="note">[^<]*<strong>Demo template\.<\/strong>[^<]*mock data/);
    assert.match(html, /<script type="module" src="app.js"><\/script>/);
    assert.doesNotMatch(html, /<title>[^<]*pump\.fun/i);
  }
});

test('every element app.js looks up exists on the page that uses it', () => {
  const js = read('app.js');
  const body = name => {
    const start = js.indexOf(`function ${name}(`);
    let depth = 0;
    for (let i = js.indexOf('{', start); i < js.length; i++) {
      if (js[i] === '{') depth++;
      if (js[i] === '}' && --depth === 0) return js.slice(start, i);
    }
    return '';
  };
  const inits = { board: ['initBoard', 'initBoardSearch'], create: ['initCreate'], token: ['initToken'], profile: ['initProfile'] };
  for (const [page, name] of Object.entries(APP_PAGES)) {
    const pageIds = ids(read(page));
    const lookups = inits[name].flatMap(fn => [...body(fn).matchAll(/getElementById\('([^']+)'\)/g)].map(m => m[1]));
    assert.ok(lookups.length > 0, name);
    for (const id of [...lookups, 'mobileToggle', 'mobileNav', 'main']) assert.ok(pageIds.includes(id), `#${id} on ${page}`);
  }
});

test('no script writes HTML strings into the DOM', () => {
  for (const file of JS_FILES) {
    const code = read(file).replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
    assert.doesNotMatch(code, /innerHTML|outerHTML|insertAdjacentHTML|document\.write|\beval\(|new Function/, file);
  }
});

test('vercel.json sends a strict CSP that still allows every origin the pages use', () => {
  const config = JSON.parse(read('vercel.json'));
  const headers = Object.fromEntries(config.headers[0].headers.map(h => [h.key, h.value]));
  const csp = Object.fromEntries(headers['Content-Security-Policy'].split(';').map(d => {
    const [name, ...values] = d.trim().split(/\s+/);
    return [name, values];
  }));
  assert.deepEqual(csp['script-src'], ["'self'"]);
  assert.ok(!headers['Content-Security-Policy'].includes('unsafe'), 'no unsafe-* sources');
  assert.deepEqual(csp['object-src'], ["'none'"]);
  assert.deepEqual(csp['frame-ancestors'], ["'none'"]);
  assert.equal(config.rewrites, undefined, 'no SPA catch-all on a multi-page site');

  for (const page of ALL_PAGES) {
    for (const [element, tag] of read(page).matchAll(/<(link|script)\b[^>]*>/g)) {
      const url = (element.match(/(?:href|src)="(https:\/\/[^/"]+)/) || [])[1];
      if (!url || /rel="preconnect"/.test(element)) continue;
      const directive = tag === 'script' ? 'script-src' : 'style-src';
      assert.ok(csp[directive].includes(url), `${url} in ${directive} (${page})`);
    }
  }
  assert.ok(csp['font-src'].includes('https://fonts.gstatic.com'));
});

test('text colour tokens meet WCAG AA (4.5:1) on every background token', () => {
  const css = read('styles.css');
  const token = name => css.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i'))[1];
  const luminance = hex => {
    const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };
  // --text-dim is not used on --bg-elevated; everything else is checked on all surfaces.
  const pairs = {
    text: ['bg', 'bg-secondary', 'bg-card', 'bg-input', 'bg-elevated'],
    'text-secondary': ['bg', 'bg-secondary', 'bg-card', 'bg-input', 'bg-elevated'],
    'text-muted': ['bg', 'bg-secondary', 'bg-card', 'bg-input', 'bg-elevated'],
    'text-dim': ['bg', 'bg-secondary', 'bg-card', 'bg-input'],
    green: ['bg', 'bg-secondary', 'bg-card', 'bg-input', 'bg-elevated'],
    red: ['bg', 'bg-secondary', 'bg-card'],
  };
  for (const [fg, bgs] of Object.entries(pairs)) {
    for (const bg of bgs) {
      const r = ratio(token(fg), token(bg));
      assert.ok(r >= 4.5, `--${fg} on --${bg} is ${r.toFixed(2)}:1`);
    }
  }
  assert.ok(ratio('#ffffff', token('red-strong')) >= 4.5, 'white on --red-strong');
});

test('styles.css provides focus, reduced-motion and hidden-attribute rules', () => {
  const css = read('styles.css');
  assert.match(css, /:focus-visible\s*{/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\[hidden\]\s*{\s*display:\s*none\s*!important;?\s*}/);
});
