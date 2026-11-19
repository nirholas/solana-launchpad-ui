// The featured token's figures are written into the HTML so the pages read
// correctly without JavaScript. These tests recompute them from curve.js so
// the static copies cannot drift from the formula.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  TOTAL_SUPPLY, curveAtProgress, spotPrice, marketCapSol, realSolReserves,
  curveTokenBalance, quoteBuy, quoteSell,
} from '../curve.js';
import {
  parseUnits, toUnits, formatPrice, formatUsd, formatUsdCompact, formatPercent, formatTokens,
} from '../format.js';
import { FEATURED, MOCK_SOL_USD } from '../mock-data.js';

const page = name => readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');
const stats = (html, key) => [...html.matchAll(new RegExp(`data-stat="${key}">([^<]+)<`, 'g'))].map(m => m[1]);

const curve = curveAtProgress(FEATURED.progress);
const usd = sol => sol * MOCK_SOL_USD;

test('token.html price, market cap, liquidity, progress and curve share match the curve', () => {
  const html = page('token.html');
  assert.deepEqual(stats(html, 'price'), Array(2).fill(formatPrice(usd(spotPrice(curve)))));
  assert.deepEqual(stats(html, 'mcap'), [formatUsd(usd(marketCapSol(curve)))]);
  assert.deepEqual(stats(html, 'liquidity'), [formatUsd(usd(toUnits(realSolReserves(curve), 9)))]);
  assert.deepEqual(stats(html, 'progress'), [formatPercent(FEATURED.progress)]);
  assert.deepEqual(stats(html, 'curve-share'), [formatPercent(Number(curveTokenBalance(curve)) / Number(TOTAL_SUPPLY))]);
});

test('token.html holder shares add up to 100%', () => {
  const shares = [...page('token.html').matchAll(/class="holder-pct[^"]*"[^>]*>([\d.]+)%/g)].map(m => Number(m[1]));
  assert.equal(shares.length, 10);
  assert.equal(Math.round(shares.reduce((a, b) => a + b, 0) * 10) / 10, 100);
});

test('token.html trade rows follow the curve', () => {
  const rows = [...page('token.html').matchAll(/tx-type (buy|sell)">\w+<\/span><\/td><td>([\d.]+)<\/td><td>([\d,]+)<\/td>/g)];
  assert.equal(rows.length, 8);
  for (const [, side, sol, tokens] of rows) {
    if (side === 'buy') {
      const out = quoteBuy(curve, parseUnits(sol, 9)).tokensOut;
      assert.equal(tokens, formatTokens(toUnits(out, 6)), `buy ${sol} SOL`);
    } else {
      const solOut = toUnits(quoteSell(curve, parseUnits(tokens.replaceAll(',', ''), 6)).solOut, 9);
      assert.equal(solOut.toFixed(2), sol, `sell ${tokens}`);
    }
  }
});

test('the King of the Hill banner shows the featured token\'s market cap', () => {
  assert.deepEqual(stats(page('index.html'), 'mcap'), [formatUsdCompact(usd(marketCapSol(curve)))]);
});
