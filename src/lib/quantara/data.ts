import type { BlockTier, Holder, TapeTrade, Token, TokenDetail, TreasurySnapshot } from "./types";

export const tokens: Token[] = [
  { token: "So111111111111111111111111111111111111SURI", ticker: "SURI", name: "Suri", chain: "SOL", network: "solana", launchpad: "pump.fun", dex: "PumpSwap", ageMinutes: 2, ageSec: 143, liquidity: 12300, liqUsd: 12300, holders: 308, top10: 23, top10Pct: 23, marketCap: 42900, mcUsd: 42900, volume: 17400, priceUsd: 0.000429, change: 18.4, price: 0.000429, pool: "6suriPoolxQNT11111111111111111111111111", tradeable: true },
  { token: "So22222222222222222222222222222222SPLASH", ticker: "SPLASHDOG", name: "Melky The SplashDog", chain: "SOL", network: "solana", launchpad: "pump.fun", dex: "Raydium", ageMinutes: 21, ageSec: 1284, liquidity: 21100, liqUsd: 21100, holders: 674, top10: 17, top10Pct: 17, marketCap: 127400, mcUsd: 127400, volume: 391300, priceUsd: 0.001274, change: 127, price: 0.001274, pool: "9splashPoolQNT22222222222222222222222", tradeable: true },
  { token: "So333333333333333333333333333333333GATOR", ticker: "GATOR", name: "The GMGN Gator", chain: "SOL", network: "solana", launchpad: "moonshot", dex: "Meteora", ageMinutes: 23, ageSec: 1391, liquidity: 7700, liqUsd: 7700, holders: 292, top10: 17, top10Pct: 17, marketCap: 20200, mcUsd: 20200, volume: 68500, priceUsd: 0.000202, change: -55.9, price: 0.000202, pool: "3gatorPoolQNT333333333333333333333333", tradeable: false, locked: true },
  { token: "hood111111111111111111111111111111111DUDAS", ticker: "DUDAS", name: "Dudas the Goat", chain: "hood", network: "hood", launchpad: "bags", dex: "HoodSwap", ageMinutes: 42, ageSec: 2533, liquidity: 7600, liqUsd: 7600, holders: 86, top10: 53, top10Pct: 53, marketCap: 19900, mcUsd: 19900, volume: 11000, priceUsd: 0.000199, change: -34.5, price: 0.000199, pool: "hoodPoolDudas4444444444444444444444", tradeable: false, locked: true },
  { token: "hood22222222222222222222222222222222SPELL", ticker: "SPELLB", name: "Spelloff Bell", chain: "hood", network: "hood", launchpad: "bags", dex: "HoodSwap", ageMinutes: 56, ageSec: 3418, liquidity: 16800, liqUsd: 16800, holders: 334, top10: 16, top10Pct: 16, marketCap: 61300, mcUsd: 61300, volume: 42600, priceUsd: 0.000613, change: 72, price: 0.000613, pool: "hoodPoolSpell5555555555555555555555", tradeable: true },
  { token: "0x111111111111111111111111111111nighttrader", ticker: "NIGHTTRADER", name: "The NightTrader", chain: "BNB", network: "bnb", launchpad: "four.meme", dex: "PancakeSwap", ageMinutes: 64, ageSec: 3862, liquidity: 11200, liqUsd: 11200, holders: 318, top10: 25, top10Pct: 25, marketCap: 34300, mcUsd: 34300, volume: 221500, priceUsd: 0.000343, change: -29.5, price: 0.000343, pool: "0xpool111111111111111111111111111111111", tradeable: true },
  { token: "0x222222222222222222222222222222222mario64", ticker: "MARIO64", name: "Mario64", chain: "BNB", network: "bnb", launchpad: "four.meme", dex: "PancakeSwap", ageMinutes: 79, ageSec: 4764, liquidity: 19400, liqUsd: 19400, holders: 556, top10: 19, top10Pct: 19, marketCap: 104000, mcUsd: 104000, volume: 242400, priceUsd: 0.00104, change: 44.2, price: 0.00104, pool: "0xpool222222222222222222222222222222222", tradeable: true },
  { token: "0x333333333333333333333333333333333aerobot", ticker: "AEROBOT", name: "Aerodrome Bot", chain: "BASE", network: "base", launchpad: "clanker", dex: "Aerodrome", ageMinutes: 13, ageSec: 801, liquidity: 26300, liqUsd: 26300, holders: 812, top10: 14, top10Pct: 14, marketCap: 188000, mcUsd: 188000, volume: 516800, priceUsd: 0.00188, change: 31.8, price: 0.00188, pool: "0xpool333333333333333333333333333333333", tradeable: true },
  { token: "0x444444444444444444444444444444444bluecat", ticker: "BLUECAT", name: "Blue Cat", chain: "BASE", network: "base", launchpad: "base.fun", dex: "Uniswap", ageMinutes: 37, ageSec: 2257, liquidity: 9800, liqUsd: 9800, holders: 405, top10: 22, top10Pct: 22, marketCap: 71100, mcUsd: 71100, volume: 98300, priceUsd: 0.000711, change: -8.7, price: 0.000711, pool: "0xpool444444444444444444444444444444444", tradeable: false, locked: true },
];

export const blockTiers: BlockTier[] = [
  { size: 1000, target: 2000, maxLoss: 800, fee: 99 },
  { size: 3000, target: 3000, maxLoss: 2400, fee: 179 },
  { size: 5000, target: 5000, maxLoss: 4000, fee: 249 },
];

export const treasury: TreasurySnapshot = {
  balance: 10000,
  reserved: 2400,
  available: 7600,
  currency: "USDC",
  wallet: "QUANTARA_TREASURY_WALLET",
  network: "BNB",
  receiptMode: "awaiting-first-public-payout",
};

const shortHash = (value: string) => [...value].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 7);
const walletFor = (seed: string, rank: number) => `Q${(shortHash(`${seed}:${rank}`).toString(16) + "0000000000000000").slice(0, 16)}...${rank.toString().padStart(4, "0")}`;

export function getToken(identifier: string) {
  const needle = identifier.trim().toLowerCase();
  return tokens.find((token) => token.ticker.toLowerCase() === needle || token.token.toLowerCase() === needle || token.pool?.toLowerCase() === needle);
}

export function searchTokens(query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return tokens;
  return tokens.filter((token) => [token.ticker, token.name, token.token, token.chain, token.dex, token.launchpad].some((field) => field.toLowerCase().includes(needle)));
}

export function getHolders(identifier: string): Holder[] {
  const token = getToken(identifier);
  if (!token) return [];
  const base = Math.max(2.2, token.top10Pct / 4);
  return Array.from({ length: 18 }, (_, index) => {
    const rank = index + 1;
    const percent = Math.max(0.18, base / Math.pow(rank, 0.62));
    return {
      wallet: walletFor(token.token, rank),
      rank,
      balance: Math.round((token.mcUsd / Math.max(token.priceUsd, 0.00000001)) * (percent / 100)),
      percent: Math.round(percent * 100) / 100,
      valueUsd: Math.round(token.mcUsd * (percent / 100)),
    };
  });
}

export function getTapeTrades(identifier: string): TapeTrade[] {
  const token = getToken(identifier);
  if (!token) return [];
  return Array.from({ length: 28 }, (_, index) => {
    const side = (index + token.ticker.length) % 3 === 0 ? "sell" : "buy";
    const usd = Math.round((180 + ((shortHash(token.token) + index * 97) % 4200)) * (side === "sell" ? 0.72 : 1));
    return {
      id: `${token.ticker}-${index}`,
      token: token.token,
      wallet: walletFor(token.ticker, index + 21),
      side,
      usd,
      priceUsd: Math.round(token.priceUsd * (1 + (index - 13) * 0.002) * 1_000_000_000) / 1_000_000_000,
      quantity: Math.round(usd / token.priceUsd),
      ageSec: 4 + index * 11,
      tx: `${token.network}_${shortHash(`${token.token}:tx:${index}`).toString(16)}`,
    };
  });
}

export function getTokenDetail(identifier: string): TokenDetail | null {
  const token = getToken(identifier);
  if (!token) return null;
  const warnings = [
    token.top10Pct > 35 ? "Top 10 concentration is elevated" : "",
    token.liqUsd < 10000 ? "Liquidity is thin" : "",
    token.locked ? "Market is locked for demo trading" : "",
  ].filter(Boolean);
  return {
    ...token,
    holdersList: getHolders(identifier),
    trades: getTapeTrades(identifier),
    safety: {
      score: Math.max(24, Math.min(96, 100 - token.top10Pct - (token.liqUsd < 10000 ? 14 : 0) - (token.locked ? 18 : 0))),
      top10Pct: token.top10Pct,
      devWalletPct: Math.round((token.top10Pct / 5) * 10) / 10,
      liquidityUsd: token.liqUsd,
      warnings,
    },
  };
}

export function getBlockTier(size: number) {
  return blockTiers.find((tier) => tier.size === size);
}
