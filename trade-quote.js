/* ================================================================
   Trade panel quote: turns typed input into bonding-curve quote text.
   ================================================================ */

import { TOKEN_DECIMALS, INITIAL_REAL_TOKENS, quoteBuy, quoteSell } from './curve.js';
import { parseUnits, toUnits, formatTokens, formatSol, formatPercent } from './format.js';

export const SOL_DECIMALS = 9;
export const SLIPPAGE_BPS = 100n;

/**
 * Describe a trade-panel entry: `main` and `detail` lines for a valid quote,
 * `error` for invalid input, or `message` when the field is empty.
 * `text` is what the visitor typed: SOL for a buy, tokens for a sell.
 * `wallet` holds decimal strings `{ sol, tokens }`.
 */
export function tradeQuote(curve, { mode, text, ticker, wallet }) {
  if (!text.trim()) return { message: 'Enter an amount to see a quote from the bonding-curve formula.' };
  const buy = mode === 'buy';
  const amount = parseUnits(text, buy ? SOL_DECIMALS : TOKEN_DECIMALS);
  if (amount === null) return { error: 'Enter a number such as 0.5.' };
  if (amount === 0n) return { error: 'Enter an amount above zero.' };
  const balance = buy ? parseUnits(wallet.sol, SOL_DECIMALS) : parseUnits(wallet.tokens, TOKEN_DECIMALS);
  if (amount > balance) return { error: 'That is more than the mock wallet balance.' };

  if (buy) {
    const q = quoteBuy(curve, amount);
    const out = toUnits(q.tokensOut, TOKEN_DECIMALS);
    const min = toUnits(q.tokensOut * (10_000n - SLIPPAGE_BPS) / 10_000n, TOKEN_DECIMALS);
    return {
      main: `You receive about ${formatTokens(out)} ${ticker}`,
      detail: `At least ${formatTokens(min)} with 1% slippage · fee ${formatSol(toUnits(q.fee, SOL_DECIMALS))} · price impact ${formatPercent(q.priceImpact, 2)}`,
    };
  }
  if (amount > INITIAL_REAL_TOKENS - curve.realTokens) return { error: 'The curve has not sold that many tokens.' };
  const q = quoteSell(curve, amount);
  const min = q.solOut * (10_000n - SLIPPAGE_BPS) / 10_000n;
  return {
    main: `You receive about ${formatSol(toUnits(q.solOut, SOL_DECIMALS))}`,
    detail: `At least ${formatSol(toUnits(min, SOL_DECIMALS))} with 1% slippage · fee ${formatSol(toUnits(q.fee, SOL_DECIMALS))} · price impact ${formatPercent(q.priceImpact, 2)}`,
  };
}
