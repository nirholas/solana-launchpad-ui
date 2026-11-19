/* ================================================================
   Number parsing and formatting for display.
   Output is pinned to en-US so every visitor sees the same figures.
   ================================================================ */

const LOCALE = 'en-US';

/**
 * Parse a decimal string such as "0.5" into integer base units without
 * going through floating point. Digits beyond `decimals` are truncated.
 * Returns null for anything that is not a plain non-negative decimal.
 */
export function parseUnits(text, decimals) {
  const match = /^(\d*)(?:\.(\d*))?$/.exec(String(text).trim());
  if (!match || (match[1] === '' && !match[2])) return null;
  const whole = match[1] || '0';
  const fraction = (match[2] || '').slice(0, decimals).padEnd(decimals, '0');
  return BigInt(whole) * 10n ** BigInt(decimals) + BigInt(fraction || '0');
}

/** Convert integer base units to a Number of whole units. */
export function toUnits(amount, decimals) {
  return Number(amount) / 10 ** decimals;
}

/** Compact USD for large figures: $4,210 / $85K / $1.2M. */
export function formatUsdCompact(n) {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 10_000) return '$' + Math.round(n / 1_000) + 'K';
  return '$' + Math.round(n).toLocaleString(LOCALE);
}

/** Whole-dollar USD with grouping: $19,407. */
export function formatUsd(n) {
  return '$' + Math.round(n).toLocaleString(LOCALE);
}

/** Small prices keep four significant digits: $0.00001941. */
export function formatPrice(n) {
  return '$' + n.toLocaleString(LOCALE, { maximumSignificantDigits: 4, useGrouping: false });
}

/** Token counts are shown as whole tokens with grouping. */
export function formatTokens(n) {
  return Math.floor(n).toLocaleString(LOCALE);
}

export function formatSol(n, digits = 4) {
  return n.toLocaleString(LOCALE, { maximumFractionDigits: digits }) + ' SOL';
}

/** `fraction` 0.724 becomes "72.4%". */
export function formatPercent(fraction, digits = 1) {
  return (fraction * 100).toFixed(digits) + '%';
}
