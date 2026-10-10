# PumpFun Site — Design Template

<!-- three.ws:badges -->
[![GitHub stars](https://img.shields.io/github/stars/nirholas/solana-launchpad-ui?style=flat&logo=github)](https://github.com/nirholas/solana-launchpad-ui/stargazers) [![Last commit](https://img.shields.io/github/last-commit/nirholas/solana-launchpad-ui?style=flat)](https://github.com/nirholas/solana-launchpad-ui/commits) [![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat)](https://github.com/nirholas/solana-launchpad-ui/pulls) [![AI agent friendly](https://img.shields.io/badge/AI%20agents-AGENTS.md%20%2B%20llms.txt-6d5dfc?style=flat)](https://github.com/nirholas/solana-launchpad-ui/blob/HEAD/AGENTS.md)
<!-- /three.ws:badges -->


> **Purpose:** Static UI design template of pump.fun — mock data only, no blockchain integration.

Static design template clone of pump.fun for the Pump SDK project. **No blockchain functionality** — pure HTML/CSS/JS with mock data.

## Pages

| Page | File | Description |
|------|------|-------------|
| Board | `index.html` | Token grid with tabs (trending/new/top), King of the Hill banner, live activity ticker |
| Create | `create.html` | Token creation form with image upload, social links, mayhem mode, creator fees |
| Trade | `token.html` | Token detail with SVG price chart, buy/sell panel, thread/comments, trades table, holder distribution |
| Profile | `profile.html` | User profile with created/held tokens, activity history, favorites |

## Live Demo

[solana-launchpad-ui.vercel.app](https://solana-launchpad-ui.vercel.app) (verified serving 2026-07-30). Source: [github.com/nirholas/solana-launchpad-ui](https://github.com/nirholas/solana-launchpad-ui).

## Running Locally

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Features

- **Dark theme** with neon green accent (PumpFun-style)
- **Responsive design** — mobile-first with breakpoints at 480/768/1024px
- **Activity ticker** — scrolling real-time trade feed
- **Token card grid** — with bonding curve progress bars, market cap, change %
- **King of the Hill** — highlighted banner for top token
- **Trading UI** — buy/sell toggle, quick amount buttons, slippage control
- **SVG price chart** — placeholder candlestick-style chart
- **Thread/comments** — chat section with emoji avatars
- **Transaction table** — buy/sell history with color coding
- **Holder distribution** — ranked list with percentage bars
- **Tab navigation** — Terminal, Trending, Top, New, Graduating, Graduated
- **Mobile nav** — overlay menu for small screens
- **Fade-in animations** — staggered card entrance
- **Skeleton loading** — shimmer effect CSS class available

## Customization

Edit CSS variables in `styles.css` `:root` to change the color scheme:

```css
--green: #7bff69;       /* Primary accent */
--bg: #0e0e16;          /* Background */
--bg-card: #181825;     /* Card background */
--border: #2a2a3e;      /* Border color */
```

## Deploying

```bash
# Vercel
vercel

# Netlify
netlify deploy --dir=.

# GitHub Pages — enable Pages for this repository
```

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
