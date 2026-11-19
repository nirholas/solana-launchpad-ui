/* ================================================================
   Mock data for the template. Every token, user and figure here is
   invented; swap this module for a real data source.
   ================================================================ */

export const TOKENS = [
  { name: 'PEPE2025', ticker: 'PEPE25', emoji: '🐸', color: '#6366f1,#a855f7', desc: 'The king of memes returns for 2025. Community-driven, no BS, just vibes.' },
  { name: 'DogWifHat2', ticker: 'WIF2', emoji: '🐕', color: '#f472b6,#a855f7', desc: 'He still has the hat. And this time, he brought friends.' },
  { name: 'SolCat', ticker: 'SCAT', emoji: '🐱', color: '#facc15,#fb923c', desc: 'Fastest cat on the Solana blockchain. Meow to the moon.' },
  { name: 'MoonBoy', ticker: 'MOON', emoji: '🌙', color: '#3b82f6,#06b6d4', desc: 'We\'re not stopping until we hit the moon. Then Mars.' },
  { name: 'WAGMI', ticker: 'WAGMI', emoji: '💎', color: '#22c55e,#16a34a', desc: 'We are all gonna make it. Diamond hands only.' },
  { name: 'BONK2', ticker: 'BONK2', emoji: '🔨', color: '#ef4444,#f97316', desc: 'BONK is back with a vengeance. Bonk bonk bonk.' },
  { name: 'GigaChad', ticker: 'CHAD', emoji: '🗿', color: '#8b5cf6,#6366f1', desc: 'For chads only. If you have to ask, you can\'t afford it.' },
  { name: 'Degen', ticker: 'DEGEN', emoji: '🎰', color: '#ec4899,#f43f5e', desc: 'Born to degen. Forced to wageslave. Trading is the way out.' },
  { name: 'CopiumMax', ticker: 'COPE', emoji: '😤', color: '#14b8a6,#06b6d4', desc: 'Maximum copium achieved. We hold because we believe.' },
  { name: 'BasedGod', ticker: 'BASED', emoji: '⚡', color: '#f59e0b,#ef4444', desc: 'The most based token on Solana. Lil B approves.' },
  { name: 'Fren', ticker: 'FREN', emoji: '🤝', color: '#84cc16,#22c55e', desc: 'Be a fren. Buy fren. Hold fren. Simple as.' },
  { name: 'NPC', ticker: 'NPC', emoji: '🤖', color: '#64748b,#475569', desc: 'We are all NPCs in a simulation. Might as well get rich.' },
  { name: 'HODL', ticker: 'HODL', emoji: '🫴', color: '#d946ef,#a855f7', desc: 'Never selling. Not now. Not ever. Holding until heat death of universe.' },
  { name: 'PUMP', ticker: 'PUMP', emoji: '🚀', color: '#7bff69,#00d4ff', desc: 'The token that pumps. That\'s it. That\'s the pitch.' },
  { name: 'ApeIn', ticker: 'APE', emoji: '🦍', color: '#b45309,#d97706', desc: 'Ape now, think later. Financial advice? Never heard of her.' },
  { name: 'Rugged', ticker: 'RUG', emoji: '🧹', color: '#dc2626,#991b1b', desc: 'We named it Rugged so you can\'t say we didn\'t warn you.' },
];

export const CREATORS = [
  'degen_420.sol', 'whale_hunter', 'solana_maxi', 'crypto_chad',
  'pepe_lord', 'ape_together', 'diamond_hands', 'moon_shot',
  'based_dev', 'anon_builder', 'giga_brain', 'pump_master',
];

export const CREATOR_COLORS = [
  '#f472b6,#a855f7', '#facc15,#fb923c', '#3b82f6,#06b6d4',
  '#22c55e,#16a34a', '#ef4444,#f97316', '#8b5cf6,#6366f1',
];

/** Fixed USD price of SOL used to turn curve figures into dollars. */
export const MOCK_SOL_USD = 150;

/**
 * The token on the King of the Hill banner and on token.html. Its price,
 * market cap and liquidity are derived from `progress` with curve.js, and
 * test/figures.test.js checks the static copies in the HTML match.
 */
export const FEATURED = {
  token: TOKENS[0],
  progress: 0.724,
  volume24hUsd: 48_210,
  holders: 4_821,
  change24h: 342,
};

/** The mock visitor's wallet on token.html. */
export const WALLET = {
  sol: '12.45',
  tokens: '38000000',
};

// ── Random helpers ──
export function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
export function randItem(arr) { return arr[rand(0, arr.length - 1)]; }

/** Fisher-Yates shuffle; returns a new array. */
export function shuffle(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = rand(0, i);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
