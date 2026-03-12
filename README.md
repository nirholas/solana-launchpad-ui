# PumpFun Site — Design Template

> **Purpose:** Static UI design template of pump.fun — mock data only, no blockchain integration.

Static design template clone of pump.fun for the Pump SDK project. **No blockchain functionality** — pure HTML/CSS/JS with mock data.

This is one of three web directories in the repository:

| Directory | Purpose |
|-----------|--------|
| [`website/`](../website/) | SDK documentation & marketing site |
| **`pumpfun-site/`** (this) | pump.fun UI design template (mock data, no blockchain) |
| [`site/`](../site/) | PumpOS — full web desktop OS with app store |

## Pages

| Page | File | Description |
|------|------|-------------|
| Board | `index.html` | Token grid with tabs (trending/new/top), King of the Hill banner, live activity ticker |
| Create | `create.html` | Token creation form with image upload, social links, mayhem mode, creator fees |
| Trade | `token.html` | Token detail with SVG price chart, buy/sell panel, thread/comments, trades table, holder distribution |
| Profile | `profile.html` | User profile with created/held tokens, activity history, favorites |

## Running Locally

```bash
cd pumpfun-site
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
cd pumpfun-site && vercel

# Netlify
netlify deploy --dir=pumpfun-site

# GitHub Pages — just push the folder
```
