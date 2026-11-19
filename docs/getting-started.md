# Getting started with solana-launchpad-ui

A static UI template for a Solana token launchpad. Pure HTML, CSS and ES modules with mock data; nothing connects to a wallet or a blockchain.

## Run it

```bash
git clone https://github.com/nirholas/solana-launchpad-ui.git
cd solana-launchpad-ui
npx serve .
```

Open the URL `serve` prints. The pages load ES modules, which browsers do not allow from `file://`, so opening `index.html` directly from disk shows an empty board. `python3 -m http.server 8000` works as well.

## Check it

Node 20 or later, with nothing to install:

```bash
npm run check   # syntax-check every JavaScript file
npm test        # bonding-curve, formatting, quote and page-structure tests
```

## Next steps

- [Examples](./examples.md) shows how to use the curve and formatting modules.
- The [README](https://github.com/nirholas/solana-launchpad-ui#readme) covers the pages, customisation and deployment.
- Found a problem? [Open an issue](https://github.com/nirholas/solana-launchpad-ui/issues).
