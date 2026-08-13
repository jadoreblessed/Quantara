export type View = "Trenches" | "Portfolio" | "Journal" | "My Block";
export type Chain = "SOL" | "hood" | "BNB" | "BASE";
export type OrderSide = "buy" | "sell";

export type Token = {
  token: string;
  ticker: string;
  name: string;
  chain: Chain;
  network: "solana" | "bnb" | "base" | "hood";
  launchpad: string;
  dex: string;
  icon?: string;
  links?: { website?: string; x?: string; telegram?: string; dexscreener?: string; explorer?: string };
  ageMinutes: number;
  ageSec: number;
  liquidity: number;
  liqUsd: number;
  holders: number;
  top10: number;
  top10Pct: number;
  marketCap: number;
  mcUsd: number;
  volume: number;
  priceUsd: number;
  change: number;
  price: number;
  pool?: string;
  tradeable: boolean;
  locked?: boolean;
};

export type Position = { ticker: string; quantity: number; averagePrice: number };
export type Trade = { id: number; ticker: string; side: OrderSide; quantity: number; price: number; total: number; time: string };
export type BlockTier = { size: number; target: number; maxLoss: number; fee: number };
export type UserSession = { id: string; name: string; email?: string; createdAt: string };
export type WalletAccount = { chain: "solana" | "evm"; address: string; label: string; attachedAt: string };

export type Holder = {
  wallet: string;
  rank: number;
  balance: number;
  percent: number;
  valueUsd: number;
};

export type TapeTrade = {
  id: string;
  token: string;
  wallet: string;
  side: OrderSide;
  usd: number;
  priceUsd: number;
  quantity: number;
  ageSec: number;
  tx: string;
};

export type TokenDetail = Token & {
  holdersList: Holder[];
  trades: TapeTrade[];
  safety: {
    score: number;
    top10Pct: number;
    devWalletPct: number;
    liquidityUsd: number;
    warnings: string[];
  };
};

export type PortfolioSnapshot = {
  cash: number;
  positions: Position[];
  trades: Trade[];
  activeBlock: BlockTier | null;
};

export type RiskSnapshot = {
  portfolioValue: number;
  unrealizedPnl: number;
  totalPnl: number;
  targetProgress: number;
  maxLossBuffer: number | null;
  breached: boolean;
};

export type TreasurySnapshot = {
  balance: number;
  reserved: number;
  available: number;
  currency: "USDC";
  wallet: string;
  network: "BNB";
  receiptMode: "awaiting-first-public-payout";
};

export type AppSnapshot = {
  session: UserSession | null;
  wallets: WalletAccount[];
  tokens: Token[];
  blockTiers: BlockTier[];
  favorites: string[];
  portfolio: PortfolioSnapshot;
  risk: RiskSnapshot;
  treasury: TreasurySnapshot;
  status: {
    latencyMs: number;
    indexedHead: number;
    mode: "simulation";
  };
};
