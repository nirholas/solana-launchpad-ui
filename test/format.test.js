import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseUnits, toUnits, formatUsdCompact, formatUsd, formatPrice,
  formatTokens, formatSol, formatPercent,
} from '../format.js';

test('parseUnits converts decimal strings without floating point error', () => {
  assert.equal(parseUnits('1', 9), 1_000_000_000n);
  assert.equal(parseUnits('0.1', 9), 100_000_000n);
  assert.equal(parseUnits('.5', 6), 500_000n);
  assert.equal(parseUnits('12.', 6), 12_000_000n);
  assert.equal(parseUnits(' 3.25 ', 2), 325n);
  assert.equal(parseUnits('0.1234567891', 9), 123_456_789n);
});

test('parseUnits rejects anything that is not a plain non-negative decimal', () => {
  for (const bad of ['', '.', '-1', '1e3', 'abc', '1.2.3', '0x10', '1,000']) {
    assert.equal(parseUnits(bad, 9), null, bad);
  }
});

test('toUnits scales base units back to whole units', () => {
  assert.equal(toUnits(1_500_000n, 6), 1.5);
});

test('formatUsdCompact', () => {
  assert.equal(formatUsdCompact(4_210.4), '$4,210');
  assert.equal(formatUsdCompact(85_499), '$85K');
  assert.equal(formatUsdCompact(1_234_567), '$1.2M');
});

test('formatUsd, formatPrice, formatTokens, formatSol, formatPercent', () => {
  assert.equal(formatUsd(19_407.4), '$19,407');
  assert.equal(formatPrice(0.0000194074), '$0.00001941');
  assert.equal(formatTokens(34_277_831.9), '34,277,831');
  assert.equal(formatSol(1.234567), '1.2346 SOL');
  assert.equal(formatSol(2, 2), '2 SOL');
  assert.equal(formatPercent(0.724), '72.4%');
  assert.equal(formatPercent(0.0153, 2), '1.53%');
});
