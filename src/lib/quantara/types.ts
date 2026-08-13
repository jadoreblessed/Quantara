export type View = "Trenches" | "Portfolio" | "Journal" | "My Block";
export type Chain = "SOL" | "hood" | "BNB" | "BASE";
export type OrderSide = "buy" | "sell";

export type Token = {
  ticker: string;
  name: string;
  chain: Chain;
  ageMinutes: number;
  liquidity: number;
  holders: number;
  top10: number;
  marketCap: number;
  volume: number;
  change: number;
  price: number;
  locked?: boolean;
};

export type Position = { ticker: string; quantity: number; averagePrice: number };
export type Trade = { id: number; ticker: string; side: OrderSide; quantity: number; price: number; total: number; time: string };
export type BlockTier = { size: number; target: number; maxLoss: number; fee: number };
export type UserSession = { id: string; name: string; email?: string; createdAt: string };

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
