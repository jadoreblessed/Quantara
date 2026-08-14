export const backendConfig = {
  mode: process.env.QUANTARA_BACKEND_MODE === "live" ? "live" : "simulation",
  sessionCookie: process.env.QUANTARA_SESSION_COOKIE || "quantara_session",
  marketDataUrl: process.env.QUANTARA_MARKET_DATA_URL || "",
  marketDataKey: process.env.QUANTARA_MARKET_DATA_KEY || "",
  marketDataProvider: process.env.QUANTARA_MARKET_DATA_PROVIDER || "birdeye",
  marketDataChain: process.env.QUANTARA_MARKET_DATA_CHAIN || "solana",
  heliusApiKey: process.env.HELIUS_API_KEY || "",
  moralisApiKey: process.env.MORALIS_API_KEY || "",
  solanaRpcUrl: process.env.SOLANA_RPC_URL || (process.env.HELIUS_API_KEY ? `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}` : ""),
  evmRpcUrl: process.env.EVM_RPC_URL || "",
  maxOrderUsd: Number(process.env.QUANTARA_MAX_ORDER_USD || 10000),
  maxWalletsPerUser: Number(process.env.QUANTARA_MAX_WALLETS || 8),
} as const;

export const isLiveBackend = () => backendConfig.mode === "live";
