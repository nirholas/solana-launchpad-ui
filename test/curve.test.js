import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  LAMPORTS_PER_SOL, TOKEN_UNIT, INITIAL_REAL_TOKENS, TOTAL_SUPPLY,
  initialCurve, curveAtProgress, spotPrice, marketCapSol, progress,
  realSolReserves, curveTokenBalance, quoteBuy, quoteSell,
} from '../curve.js';

const SOL = LAMPORTS_PER_SOL;

test('launch price and market cap follow from 30 SOL / 1,073,000,000 virtual reserves', () => {
  const s = initialCurve();
  assert.ok(Math.abs(spotPrice(s) - 30 / 1_073_000_000) < 1e-18);
  assert.ok(Math.abs(marketCapSol(s) - 27.958993476) < 1e-6);
  assert.equal(progress(s), 0);
  assert.equal(realSolReserves(s), 0n);
});

test('buying 1 SOL at launch takes a 1% fee and returns vT - k / (vS + net)', () => {
  const q = quoteBuy(initialCurve(), 1n * SOL);
  assert.equal(q.fee, 10_000_000n);
  assert.equal(q.solSpent, 1n * SOL);
  // Reference value computed independently: 1,073e6 - 32,190e6 / 30.99, rounded down.
  assert.equal(q.tokensOut, 34_277_831_558_567n);
  assert.equal(q.state.virtualSol, 30_990_000_000n);
  assert.ok(q.priceImpact > 0);
});

test('the constant product never decreases across trades', () => {
  let s = initialCurve();
  const k0 = s.virtualSol * s.virtualTokens;
  const buy = quoteBuy(s, 7n * SOL);
  s = buy.state;
  assert.ok(s.virtualSol * s.virtualTokens >= k0);
  s = quoteSell(s, buy.tokensOut / 3n).state;
  assert.ok(s.virtualSol * s.virtualTokens >= k0);
});

test('a round trip loses the two fees plus one lamport of rounding in the pool\'s favour', () => {
  const buy = quoteBuy(initialCurve(), 1n * SOL);
  const sell = quoteSell(buy.state, buy.tokensOut);
  // The sell prices against the post-buy reserves, whose product is a hair
  // above the launch k because the buy rounded up; that costs one lamport.
  assert.equal(sell.fee, 9_900_000n);
  assert.equal(sell.solOut, 980_099_999n);
});

test('a buy larger than the curve is capped at the remaining tokens', () => {
  const q = quoteBuy(initialCurve(), 1_000n * SOL);
  assert.equal(q.tokensOut, INITIAL_REAL_TOKENS);
  assert.equal(q.state.realTokens, 0n);
  assert.equal(progress(q.state), 1);
  assert.ok(q.solSpent < 1_000n * SOL);
  // 85.005359057 SOL of net deposits completes the curve.
  assert.equal(realSolReserves(q.state), 85_005_359_057n);
  assert.equal(q.solSpent - q.fee, 85_005_359_057n);
});

test('a completed curve returns nothing for further buys', () => {
  const done = curveAtProgress(1);
  const q = quoteBuy(done, 1n * SOL);
  assert.equal(q.tokensOut, 0n);
  assert.equal(q.solSpent, 0n);
});

test('curveAtProgress matches the state reached by buying', () => {
  const end = curveAtProgress(1);
  assert.equal(end.virtualTokens, 279_900_000n * TOKEN_UNIT);
  assert.equal(end.virtualSol, 115_005_359_057n);
  assert.ok(Math.abs(marketCapSol(end) - 410.880168) < 1e-5);

  const mid = curveAtProgress(0.724);
  assert.ok(Math.abs(progress(mid) - 0.724) < 1e-12);
  assert.equal(realSolReserves(mid), 34_535_453_000n);
  assert.equal(curveTokenBalance(mid), TOTAL_SUPPLY - 574_204_400n * TOKEN_UNIT);
});

test('invalid inputs throw instead of producing silent garbage', () => {
  const s = initialCurve();
  assert.throws(() => quoteBuy(s, 1), RangeError);
  assert.throws(() => quoteBuy(s, -1n), RangeError);
  assert.throws(() => quoteSell(s, 1n), RangeError);
  assert.throws(() => curveAtProgress(1.5), RangeError);
  assert.throws(() => curveAtProgress(Number.NaN), RangeError);
});

test('zero-sized trades are no-ops', () => {
  const s = curveAtProgress(0.5);
  assert.equal(quoteBuy(s, 0n).tokensOut, 0n);
  assert.equal(quoteSell(s, 0n).solOut, 0n);
  assert.equal(quoteBuy(s, 0n).priceImpact, 0);
});
