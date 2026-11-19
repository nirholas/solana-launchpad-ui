/* ================================================================
   Bonding curve math (pump.fun-style constant product)

   Virtual reserves start at 30 SOL and 1,073,000,000 tokens. Trades keep
   k = virtualSol * virtualTokens constant, so a buy that adds `net`
   lamports returns  tokensOut = vT - k / (vS + net). 793,100,000 tokens are
   sold through the curve; when they run out the curve is complete.

   Amounts are BigInt base units (lamports, 6-decimal token units) so the
   results match integer on-chain arithmetic. Divisions round in the pool's
   favour, as an on-chain program would. The 1% fee is taken from the SOL
   side of every trade.

   This module powers the template's quotes and mock statistics. It is an
   illustration of the formula, not a client for any deployed program.
   ================================================================ */

export const LAMPORTS_PER_SOL = 1_000_000_000n;
export const TOKEN_DECIMALS = 6;
export const TOKEN_UNIT = 10n ** BigInt(TOKEN_DECIMALS);

export const INITIAL_VIRTUAL_SOL = 30n * LAMPORTS_PER_SOL;
export const INITIAL_VIRTUAL_TOKENS = 1_073_000_000n * TOKEN_UNIT;
export const INITIAL_REAL_TOKENS = 793_100_000n * TOKEN_UNIT;
export const TOTAL_SUPPLY = 1_000_000_000n * TOKEN_UNIT;
export const FEE_BPS = 100n;

const BPS = 10_000n;
const K = INITIAL_VIRTUAL_SOL * INITIAL_VIRTUAL_TOKENS;

function ceilDiv(a, b) {
  return (a + b - 1n) / b;
}

function assertAmount(value, name) {
  if (typeof value !== 'bigint' || value < 0n) {
    throw new RangeError(`${name} must be a non-negative BigInt`);
  }
}

function makeState(virtualSol, virtualTokens, realTokens) {
  return Object.freeze({ virtualSol, virtualTokens, realTokens });
}

// ── Curve states ──

export function initialCurve() {
  return makeState(INITIAL_VIRTUAL_SOL, INITIAL_VIRTUAL_TOKENS, INITIAL_REAL_TOKENS);
}

/** State after `fraction` (0..1) of the sellable tokens have been bought. */
export function curveAtProgress(fraction) {
  if (!Number.isFinite(fraction) || fraction < 0 || fraction > 1) {
    throw new RangeError('fraction must be between 0 and 1');
  }
  const sold = (INITIAL_REAL_TOKENS * BigInt(Math.round(fraction * 1e6))) / 1_000_000n;
  const virtualTokens = INITIAL_VIRTUAL_TOKENS - sold;
  return makeState(ceilDiv(K, virtualTokens), virtualTokens, INITIAL_REAL_TOKENS - sold);
}

// ── Derived figures (Numbers, for display) ──

/** Spot price in SOL per whole token. */
export function spotPrice(state) {
  return (Number(state.virtualSol) / Number(LAMPORTS_PER_SOL))
    / (Number(state.virtualTokens) / Number(TOKEN_UNIT));
}

/** Fully diluted market cap in SOL (spot price times total supply). */
export function marketCapSol(state) {
  return spotPrice(state) * (Number(TOTAL_SUPPLY) / Number(TOKEN_UNIT));
}

/** Share of the sellable tokens already bought, 0..1. */
export function progress(state) {
  return 1 - Number(state.realTokens) / Number(INITIAL_REAL_TOKENS);
}

/** Lamports actually deposited into the curve by buyers. */
export function realSolReserves(state) {
  return state.virtualSol - INITIAL_VIRTUAL_SOL;
}

/** Tokens held by the curve account: unsold supply plus the migration reserve. */
export function curveTokenBalance(state) {
  return TOTAL_SUPPLY - (INITIAL_REAL_TOKENS - state.realTokens);
}

// ── Quotes ──

/**
 * Spend `lamportsIn` (fee included) on tokens. If the input would buy past
 * the end of the curve, the buy is capped at the remaining tokens and
 * `solSpent` is less than `lamportsIn`.
 */
export function quoteBuy(state, lamportsIn) {
  assertAmount(lamportsIn, 'lamportsIn');
  const { virtualSol, virtualTokens, realTokens } = state;
  const k = virtualSol * virtualTokens;

  let fee = ceilDiv(lamportsIn * FEE_BPS, BPS);
  let net = lamportsIn - fee;
  let tokensOut = virtualTokens - ceilDiv(k, virtualSol + net);

  if (tokensOut > realTokens) {
    tokensOut = realTokens;
    net = ceilDiv(k, virtualTokens - tokensOut) - virtualSol;
    const gross = ceilDiv(net * BPS, BPS - FEE_BPS);
    fee = gross - net;
  }

  return {
    tokensOut,
    fee,
    solSpent: net + fee,
    priceImpact: tokensOut > 0n ? executionPrice(net, tokensOut) / spotPrice(state) - 1 : 0,
    state: makeState(virtualSol + net, virtualTokens - tokensOut, realTokens - tokensOut),
  };
}

/** Sell `tokensIn` back to the curve. `solOut` is after the fee. */
export function quoteSell(state, tokensIn) {
  assertAmount(tokensIn, 'tokensIn');
  const { virtualSol, virtualTokens, realTokens } = state;
  if (tokensIn > INITIAL_REAL_TOKENS - realTokens) {
    throw new RangeError('cannot sell more tokens than the curve has sold');
  }
  const k = virtualSol * virtualTokens;

  const gross = virtualSol - ceilDiv(k, virtualTokens + tokensIn);
  const fee = ceilDiv(gross * FEE_BPS, BPS);

  return {
    solOut: gross - fee,
    fee,
    priceImpact: tokensIn > 0n ? 1 - executionPrice(gross, tokensIn) / spotPrice(state) : 0,
    state: makeState(virtualSol - gross, virtualTokens + tokensIn, realTokens + tokensIn),
  };
}

function executionPrice(lamports, tokens) {
  return (Number(lamports) / Number(LAMPORTS_PER_SOL)) / (Number(tokens) / Number(TOKEN_UNIT));
}
