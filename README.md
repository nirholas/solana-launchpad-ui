# Solana Launchpad UI — Design Template

<!-- three.ws:badges -->
[![GitHub stars](https://img.shields.io/github/stars/nirholas/solana-launchpad-ui?style=flat&logo=github)](https://github.com/nirholas/solana-launchpad-ui/stargazers) [![Last commit](https://img.shields.io/github/last-commit/nirholas/solana-launchpad-ui?style=flat)](https://github.com/nirholas/solana-launchpad-ui/commits) [![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat)](https://github.com/nirholas/solana-launchpad-ui/pulls) [![AI agent friendly](https://img.shields.io/badge/AI%20agents-AGENTS.md%20%2B%20llms.txt-6d5dfc?style=flat)](https://github.com/nirholas/solana-launchpad-ui/blob/HEAD/AGENTS.md)
<!-- /three.ws:badges -->


> **Purpose:** Static UI design template in the style of pump.fun — mock data only, no blockchain integration. Not affiliated with pump.fun.

A Solana token launchpad front end in plain HTML, CSS and ES modules. **No blockchain functionality**: no wallet connection, no RPC calls, no transactions. Every token, price, trade and profile is mock data, and every page says so in a visible notice.

## Pages

| Page | File | Description |
|------|------|-------------|
| Board | `index.html` | Token grid, King of the Hill banner, view buttons, search, pausable activity ticker |
| Create | `create.html` | Token creation form with image picker, social links, option switches and an initial-buy estimate |
| Trade | `token.html` | Token detail with illustrative price chart, buy/sell panel quoting from the bonding curve, thread, trades and holders |
| Profile | `profile.html` | Mock user profile with created, held and favourite tokens and an activity table |

## Live Demo

[solana-launchpad-ui.vercel.app](https://solana-launchpad-ui.vercel.app) (verified serving 2026-07-30). Source: [github.com/nirholas/solana-launchpad-ui](https://github.com/nirholas/solana-launchpad-ui).

## Running Locally

The pages load ES modules, which browsers block over `file://`, so serve the folder:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Features

- **Dark theme** with neon green accent (PumpFun-style)
- **Responsive layout** — desktop-first with breakpoints at 1024/768/480px, checked down to 375px wide
- **Bonding-curve trade quotes** — `curve.js` implements the constant-product curve (30 SOL / 1,073,000,000 token virtual reserves, 1% fee); the trade panel shows tokens or SOL out, minimum after slippage, fee and price impact
- **Consistent mock figures** — card market caps follow each card's curve progress, and the featured token's price, market cap and trades are recomputed from the curve in tests
- **Activity ticker** — randomly generated mock activity, pausable, and still under `prefers-reduced-motion`
- **Token card grid** — bonding curve progress bars, market cap, change %, with each card a single keyboard stop
- **King of the Hill** — highlighted banner for the featured token
- **Search** — the header search filters the board by name or ticker from any page
- **Trading UI** — buy/sell toggle, quick amounts (SOL presets or % of balance), slippage display
- **SVG price chart** — static illustrative line chart with timeframe buttons
- **Thread, trades and holders** — tabbed panel using the WAI-ARIA tabs pattern
- **Accessible** — WCAG AA colour contrast, visible focus, skip links, labelled controls, landmarks and headings
- **CSP-ready** — no inline scripts, handlers or style attributes; `vercel.json` sends a strict Content-Security-Policy
- **Skeleton loading** — shimmer effect CSS class (`.skeleton`) available

## Project layout

| File | Purpose |
|------|---------|
| `index.html`, `create.html`, `token.html`, `profile.html` | The four pages |
| `styles.css` | All styles; theme tokens in `:root` |
| `app.js` | Page behaviour (ES module); picks an init function from `<body data-page>` |
| `curve.js` | Bonding-curve math in BigInt base units |
| `trade-quote.js` | Turns trade-panel input into quote text |
| `format.js` | Decimal parsing and number formatting |
| `mock-data.js` | Mock tokens, creators, featured token and the fixed `MOCK_SOL_USD` rate |
| `test/` | `node:test` suites |
| `docs/` | Documentation site and guides |
| `vercel.json` | Security headers, including the CSP |

## Tests

Node 20 or later; nothing to install.

```bash
npm run check   # node --check on every script
npm test        # curve math, formatting, quotes, page structure, CSP, contrast
```

CI runs both on Node 20, 22 and 24.

## Customization

Edit CSS variables in `styles.css` `:root` to change the color scheme:

```css
--green: #7bff69;       /* Primary accent */
--bg: #0e0e16;          /* Background */
--bg-card: #181825;     /* Card background */
--border: #2a2a3e;      /* Border color */
```

The text tokens (`--text-muted`, `--text-dim` and friends) pass WCAG AA on every background token, and `npm test` checks that they still do.

Replace `mock-data.js` to change the data. If you change `FEATURED`, `npm test` reports each figure in `token.html` and `index.html` that needs updating.

## Deploying

```bash
# Vercel (applies the headers in vercel.json)
vercel

# Netlify (ignores vercel.json; copy the headers into netlify.toml)
netlify deploy --dir=.

# GitHub Pages — enable Pages for this repository (cannot send the CSP header)
```

Keep scripts in files and markup free of inline handlers and `style` attributes, or the Content-Security-Policy will block them.

## License

All rights reserved. See [LICENSE](LICENSE). This is a design template, not an
open-source project: ask before reusing it.

## Documentation

Full documentation site: **https://nirholas.github.io/solana-launchpad-ui/**

- [Getting started](docs/getting-started.md) covers install and first run.
- [Examples](docs/examples.md) has copy-paste snippets.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=nirholas/solana-launchpad-ui&type=Date)](https://www.star-history.com/#nirholas/solana-launchpad-ui&Date)

<!-- three.ws:growth -->
## Support the project

If solana-launchpad-ui saves you time, **[star it on GitHub](https://github.com/nirholas/solana-launchpad-ui)**. Stars are how other developers and AI agents find the repositories worth trusting, and they cost you one click.

Know someone who would use it? [Post on X](https://twitter.com/intent/tweet?text=solana-launchpad-ui%3A%20Token%20launchpad%20UI%20template%20inspired%20by%20pump.fun%3A%20dark%20theme%2C%20bonding%20curves%2C%20trading%20panel%2C%204&url=https%3A%2F%2Fgithub.com%2Fnirholas%2Fsolana-launchpad-ui) · [Share on Bluesky](https://bsky.app/intent/compose?text=solana-launchpad-ui%3A%20Token%20launchpad%20UI%20template%20inspired%20by%20pump.fun%3A%20dark%20theme%2C%20bonding%20curves%2C%20trading%20panel%2C%204%20https%3A%2F%2Fgithub.com%2Fnirholas%2Fsolana-launchpad-ui) · [Share on LinkedIn](https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fgithub.com%2Fnirholas%2Fsolana-launchpad-ui) · [Submit to Hacker News](https://news.ycombinator.com/submitlink?u=https%3A%2F%2Fgithub.com%2Fnirholas%2Fsolana-launchpad-ui&t=solana-launchpad-ui%3A%20Token%20launchpad%20UI%20template%20inspired%20by%20pump.fun%3A%20dark%20theme%2C%20bonding%20curves%2C%20trading%20panel%2C%204) · [Share on Reddit](https://www.reddit.com/submit?url=https%3A%2F%2Fgithub.com%2Fnirholas%2Fsolana-launchpad-ui&title=solana-launchpad-ui%3A%20Token%20launchpad%20UI%20template%20inspired%20by%20pump.fun%3A%20dark%20theme%2C%20bonding%20curves%2C%20trading%20panel%2C%204)

## Built for AI agents too

Coding agents and LLM tooling can read this repo directly: [AGENTS.md](./AGENTS.md), [llms.txt](./llms.txt), [llms-full.txt](./llms-full.txt). Point an agent at `https://github.com/nirholas/solana-launchpad-ui` and it has the context it needs.

## More from the same author

- [All repositories by nirholas](https://github.com/nirholas/nirholas#readme): the full catalog, grouped by topic
- [three.ws](https://three.ws): the platform for 3D AI agents with Solana wallets, a skill marketplace and x402 payments
- Questions or ideas: [open an issue](https://github.com/nirholas/solana-launchpad-ui/issues) or [start a discussion](https://github.com/nirholas/solana-launchpad-ui/discussions)

## Contributors

[![Contributors](https://contrib.rocks/image?repo=nirholas/solana-launchpad-ui)](https://github.com/nirholas/solana-launchpad-ui/graphs/contributors)

<!-- /three.ws:growth -->

<!-- nirholas:watermark -->

---

<p align="center">
  Built by <a href="https://github.com/nirholas"><b>nirholas</b></a> · <a href="https://x.com/nichxbt">@nichxbt</a> · <a href="https://github.com/nirholas">github.com/nirholas</a>
</p>

<!-- /nirholas:watermark -->
