# solana-launchpad-ui examples

## Quote a buy on the bonding curve

`curve.js` works in BigInt base units: lamports for SOL, 6-decimal units for tokens.

```js
import { initialCurve, quoteBuy, spotPrice } from './curve.js';
import { parseUnits, toUnits, formatTokens } from './format.js';

const curve = initialCurve();                 // 30 SOL / 1,073,000,000 virtual reserves
const q = quoteBuy(curve, parseUnits('1', 9)); // spend 1 SOL, fee included

formatTokens(toUnits(q.tokensOut, 6));        // '34,277,831'
toUnits(q.fee, 9);                            // 0.01
spotPrice(q.state) > spotPrice(curve);        // true: buying moves the price up
```

## Describe a curve part-way through

```js
import { curveAtProgress, marketCapSol, realSolReserves } from './curve.js';

const curve = curveAtProgress(0.724);  // 72.4% of the sellable tokens bought
marketCapSol(curve);                   // about 129.4 SOL
realSolReserves(curve);                // 34535453000n lamports deposited
```

## Change the featured token

Edit `FEATURED` in `mock-data.js`, then run `npm test`: `test/figures.test.js` fails for each figure in `token.html` and `index.html` that still shows the old value.

## Deploy

```bash
vercel                       # uses vercel.json for the security headers
netlify deploy --dir=.       # Netlify ignores vercel.json; set headers in netlify.toml
```

GitHub Pages also works (enable Pages for the repository), but it cannot send the Content-Security-Policy header.
