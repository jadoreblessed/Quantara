import type { BlockTier, Token, TreasurySnapshot } from "./types";

export const tokens: Token[] = [
  { ticker: "SURI", name: "Suri", chain: "SOL", ageMinutes: 2, liquidity: 12300, holders: 308, top10: 23, marketCap: 42900, volume: 17400, change: 18.4, price: 0.000429 },
  { ticker: "SPLASHDOG", name: "Melky The SplashDog", chain: "SOL", ageMinutes: 21, liquidity: 21100, holders: 674, top10: 17, marketCap: 127400, volume: 391300, change: 127, price: 0.001274 },
  { ticker: "GATOR", name: "The GMGN Gator", chain: "SOL", ageMinutes: 23, liquidity: 7700, holders: 292, top10: 17, marketCap: 20200, volume: 68500, change: -55.9, price: 0.000202, locked: true },
  { ticker: "DUDAS", name: "Dudas the Goat", chain: "hood", ageMinutes: 42, liquidity: 7600, holders: 86, top10: 53, marketCap: 19900, volume: 11000, change: -34.5, price: 0.000199, locked: true },
  { ticker: "SPELLB", name: "Spelloff Bell", chain: "hood", ageMinutes: 56, liquidity: 16800, holders: 334, top10: 16, marketCap: 61300, volume: 42600, change: 72, price: 0.000613 },
  { ticker: "NIGHTTRADER", name: "The NightTrader", chain: "BNB", ageMinutes: 64, liquidity: 11200, holders: 318, top10: 25, marketCap: 34300, volume: 221500, change: -29.5, price: 0.000343 },
  { ticker: "MARIO64", name: "Mario64", chain: "BNB", ageMinutes: 79, liquidity: 19400, holders: 556, top10: 19, marketCap: 104000, volume: 242400, change: 44.2, price: 0.00104 },
  { ticker: "AEROBOT", name: "Aerodrome Bot", chain: "BASE", ageMinutes: 13, liquidity: 26300, holders: 812, top10: 14, marketCap: 188000, volume: 516800, change: 31.8, price: 0.00188 },
  { ticker: "BLUECAT", name: "Blue Cat", chain: "BASE", ageMinutes: 37, liquidity: 9800, holders: 405, top10: 22, marketCap: 71100, volume: 98300, change: -8.7, price: 0.000711, locked: true },
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

export function getToken(ticker: string) {
  return tokens.find((token) => token.ticker === ticker.toUpperCase());
}

export function getBlockTier(size: number) {
  return blockTiers.find((tier) => tier.size === size);
}
