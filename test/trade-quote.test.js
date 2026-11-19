import { test } from 'node:test';
import assert from 'node:assert/strict';
import { curveAtProgress } from '../curve.js';
import { tradeQuote } from '../trade-quote.js';

const curve = curveAtProgress(0.724);
const wallet = { sol: '12.45', tokens: '38000000' };
const quote = (mode, text) => tradeQuote(curve, { mode, text, ticker: 'PEPE25', wallet });

test('an empty field shows the prompt, not an error', () => {
  assert.ok(quote('buy', '  ').message);
  assert.equal(quote('buy', '').error, undefined);
});

test('invalid, zero and over-balance input are errors', () => {
  assert.match(quote('buy', 'abc').error, /number/);
  assert.match(quote('buy', '-1').error, /number/);
  assert.match(quote('buy', '0').error, /above zero/);
  assert.match(quote('buy', '12.46').error, /balance/);
  assert.match(quote('sell', '38000001').error, /balance/);
});

test('a buy quotes tokens out, the slippage floor, the fee and the impact', () => {
  const q = quote('buy', '5');
  assert.equal(q.main, 'You receive about 35,533,167 PEPE25');
  assert.match(q.detail, /^At least 35,177,835 with 1% slippage · fee 0\.05 SOL · price impact \d+\.\d\d%$/);
});

test('a sell quotes SOL out after the fee', () => {
  const q = quote('sell', '9547836');
  assert.equal(q.main, 'You receive about 1.2 SOL');
  assert.match(q.detail, /fee 0\.0121 SOL/);
});
