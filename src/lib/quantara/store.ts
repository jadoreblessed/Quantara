import { cookies } from "next/headers";
import { blockTiers, getBlockTier, getTapeTrades, getToken, getTokenDetail, searchTokens, tokens, treasury } from "./data";
import type { AppSnapshot, OrderSide, PortfolioSnapshot, RiskSnapshot, Trade, UserSession, WalletAccount } from "./types";

const SESSION_COOKIE = "quantara_session";

type StoredSession = UserSession & PortfolioSnapshot & { favorites: string[]; wallets: WalletAccount[] };
type MemoryStore = Map<string, StoredSession>;

const globalStore = globalThis as typeof globalThis & { quantaraStore?: MemoryStore };
const store = globalStore.quantaraStore ?? new Map<string, StoredSession>();
globalStore.quantaraStore = store;

const defaultPortfolio = (): PortfolioSnapshot => ({
  cash: 5000,
  positions: [],
  trades: [],
  activeBlock: null,
});

function defaultRisk(): RiskSnapshot {
  return {
    portfolioValue: 5000,
    unrealizedPnl: 0,
    totalPnl: 0,
    targetProgress: 0,
    maxLossBuffer: null,
    breached: false,
  };
}

const newId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `session_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export async function getSessionId() {
  return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
}

export async function getCurrentSession() {
  const id = await getSessionId();
  return id ? store.get(id) ?? null : null;
}

export async function createSession(email?: string, provider?: string) {
  const id = newId();
  const rawName = provider ? `${provider} trader` : email?.trim().split("@")[0];
  const session: StoredSession = {
    id,
    name: rawName || "trader",
    email,
    createdAt: new Date().toISOString(),
    favorites: [],
    wallets: [
      { chain: "solana", address: "QuantaraSolDemo11111111111111111111111111", label: "Solana demo", attachedAt: new Date().toISOString() },
      { chain: "evm", address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", label: "EVM demo", attachedAt: new Date().toISOString() },
    ],
    ...defaultPortfolio(),
  };
  store.set(id, session);
  (await cookies()).set(SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return session;
}

function publicSession(session: StoredSession | null): UserSession | null {
  if (!session) return null;
  return { id: session.id, name: session.name, email: session.email, createdAt: session.createdAt };
}

function calculateRisk(session: StoredSession | null): RiskSnapshot {
  if (!session) return defaultRisk();
  const positionRows = session.positions.flatMap((position) => {
    const token = getToken(position.ticker);
    return token ? [{ value: position.quantity * token.price, pnl: (token.price - position.averagePrice) * position.quantity }] : [];
  });
  const portfolioValue = session.cash + positionRows.reduce((sum, position) => sum + position.value, 0);
  const unrealizedPnl = positionRows.reduce((sum, position) => sum + position.pnl, 0);
  const startingBalance = session.activeBlock?.size ?? 5000;
  const totalPnl = portfolioValue - startingBalance;
  const targetProgress = session.activeBlock ? Math.max(0, Math.min(100, (totalPnl / session.activeBlock.target) * 100)) : 0;
  const maxLossBuffer = session.activeBlock ? session.activeBlock.maxLoss + totalPnl : null;
  return {
    portfolioValue,
    unrealizedPnl,
    totalPnl,
    targetProgress,
    maxLossBuffer,
    breached: typeof maxLossBuffer === "number" ? maxLossBuffer <= 0 : false,
  };
}

export async function getSnapshot(): Promise<AppSnapshot> {
  const session = await getCurrentSession();
  const risk = calculateRisk(session);
  return {
    session: publicSession(session),
    wallets: session?.wallets ?? [],
    tokens,
    blockTiers,
    favorites: session?.favorites ?? [],
    portfolio: session ? { cash: session.cash, positions: session.positions, trades: session.trades, activeBlock: session.activeBlock } : defaultPortfolio(),
    risk,
    treasury,
    status: {
      latencyMs: 86 + Math.floor(Math.random() * 32),
      indexedHead: 33610207 + Math.floor(Date.now() / 120000) % 9000,
      mode: "simulation",
    },
  };
}

export async function getPortfolio() {
  const session = await getCurrentSession();
  return {
    session: publicSession(session),
    portfolio: session ? { cash: session.cash, positions: session.positions, trades: session.trades, activeBlock: session.activeBlock } : defaultPortfolio(),
    risk: calculateRisk(session),
  };
}

export function getMarkets() {
  return { tokens, blockTiers, migrated: tokens.filter((token) => token.liqUsd >= 15000), almost: tokens.filter((token) => token.liqUsd < 15000) };
}

export function getSearchResults(query: string) {
  return { results: searchTokens(query).slice(0, 24) };
}

export function getTokenRoute(identifier: string) {
  const detail = getTokenDetail(identifier);
  if (!detail) throw new Error("TOKEN_NOT_FOUND");
  return detail;
}

export function getSafetyRoute(identifier: string) {
  const detail = getTokenDetail(identifier);
  if (!detail) throw new Error("TOKEN_NOT_FOUND");
  return detail.safety;
}

export async function getSessionAccount() {
  const session = await getCurrentSession();
  return {
    session: publicSession(session),
    wallets: session?.wallets ?? [],
    favorites: session?.favorites ?? [],
  };
}

export async function attachWallet(input: { chain: WalletAccount["chain"]; address: string; label?: string }) {
  const session = await getCurrentSession();
  if (!session) throw new Error("AUTH_REQUIRED");
  if (input.chain !== "solana" && input.chain !== "evm") throw new Error("INVALID_CHAIN");
  const address = input.address.trim();
  if (address.length < 12) throw new Error("INVALID_WALLET");
  const wallet: WalletAccount = {
    chain: input.chain,
    address,
    label: input.label?.trim() || (input.chain === "solana" ? "Solana wallet" : "EVM wallet"),
    attachedAt: new Date().toISOString(),
  };
  session.wallets = [wallet, ...session.wallets.filter((item) => item.address.toLowerCase() !== address.toLowerCase())].slice(0, 8);
  return getSessionAccount();
}

export function getTreasury() {
  return treasury;
}

export async function activateBlock(size: number) {
  const session = await getCurrentSession();
  if (!session) throw new Error("AUTH_REQUIRED");
  const tier = getBlockTier(size);
  if (!tier) throw new Error("BLOCK_NOT_FOUND");
  session.activeBlock = tier;
  session.cash = tier.size;
  session.positions = [];
  session.trades = [];
  return getSnapshot();
}

export async function clearJournal() {
  const session = await getCurrentSession();
  if (!session) throw new Error("AUTH_REQUIRED");
  session.trades = [];
  return getSnapshot();
}

export async function setFavorite(ticker: string, favorite: boolean) {
  const session = await getCurrentSession();
  if (!session) throw new Error("AUTH_REQUIRED");
  const token = getToken(ticker);
  if (!token) throw new Error("TOKEN_NOT_FOUND");
  const favorites = new Set(session.favorites);
  if (favorite) favorites.add(token.ticker);
  else favorites.delete(token.ticker);
  session.favorites = [...favorites];
  return getSnapshot();
}

export async function getMyFills(identifier?: string) {
  const session = await getCurrentSession();
  const ownFills = (session?.trades ?? []).flatMap((trade) => {
    const token = getToken(trade.ticker);
    if (!token) return [];
    return [{
      id: `own-${trade.id}`,
      token: token.token,
      ticker: token.ticker,
      wallet: session?.wallets[0]?.address ?? "session-wallet",
      side: trade.side,
      usd: trade.total,
      priceUsd: trade.price,
      quantity: trade.quantity,
      ageSec: 1,
      tx: `${token.network}_${trade.id}`,
    }];
  });
  const marketFills = identifier ? getTapeTrades(identifier) : tokens.flatMap((token) => getTapeTrades(token.ticker).slice(0, 4));
  return { fills: [...ownFills, ...marketFills].slice(0, 80) };
}

export async function logout() {
  const id = await getSessionId();
  if (id) store.delete(id);
  (await cookies()).delete(SESSION_COOKIE);
  return getSnapshot();
}

export async function executeOrder(input: { ticker: string; side: OrderSide; amount: number }) {
  const session = await getCurrentSession();
  if (!session) throw new Error("AUTH_REQUIRED");
  if (input.side !== "buy" && input.side !== "sell") throw new Error("INVALID_SIDE");
  const token = getToken(input.ticker);
  if (!token) throw new Error("TOKEN_NOT_FOUND");
  if (token.locked) throw new Error("MARKET_LOCKED");
  const amount = Math.max(1, Math.round(input.amount * 100) / 100);
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("INVALID_AMOUNT");
  if (amount > 10000) throw new Error("ORDER_TOO_LARGE");
  const quantity = amount / token.price;
  const existing = session.positions.find((position) => position.ticker === token.ticker);

  if (input.side === "buy") {
    if (amount > session.cash) throw new Error("INSUFFICIENT_CASH");
    if (existing) {
      const totalCost = existing.quantity * existing.averagePrice + amount;
      existing.quantity += quantity;
      existing.averagePrice = totalCost / existing.quantity;
    } else {
      session.positions.push({ ticker: token.ticker, quantity, averagePrice: token.price });
    }
    session.cash -= amount;
  } else {
    if (!existing || existing.quantity * token.price < amount - 0.01) throw new Error("INSUFFICIENT_POSITION");
    existing.quantity = Math.max(0, existing.quantity - quantity);
    if (existing.quantity < 0.000001) session.positions = session.positions.filter((position) => position.ticker !== token.ticker);
    session.cash += amount;
  }

  const trade: Trade = {
    id: Date.now(),
    ticker: token.ticker,
    side: input.side,
    quantity,
    price: token.price,
    total: amount,
    time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
  session.trades = [trade, ...session.trades].slice(0, 80);
  return getSnapshot();
}

export async function executeTrade(input: { token: string; side: OrderSide; amount: number }) {
  const token = getToken(input.token);
  if (!token) throw new Error("TOKEN_NOT_FOUND");
  return executeOrder({ ticker: token.ticker, side: input.side, amount: input.amount });
}

export function formatBackendError(error: unknown) {
  const message = error instanceof Error ? error.message : "UNKNOWN";
  const status = message === "AUTH_REQUIRED" ? 401 : message.includes("NOT_FOUND") ? 404 : 400;
  return Response.json({ error: message }, { status });
}
