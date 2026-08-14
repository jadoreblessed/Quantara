import { cookies } from "next/headers";
import { backendConfig } from "./config";
import { blockTiers, getBlockTier, getToken, treasury } from "./data";
import { assertRateLimit, parseOrderSide, parsePositiveAmount } from "./guards";
import { getMarketCatalog, getMarketFills, getMarketSafety, getMarketToken } from "./provider";
import type { AppSnapshot, NotificationItem, OrderSide, PortfolioSnapshot, ReferralSnapshot, RiskSnapshot, StopOrder, Trade, UserSession, WalletAccount } from "./types";

const SESSION_COOKIE = backendConfig.sessionCookie;

type StoredSession = UserSession & PortfolioSnapshot & {
  favorites: string[];
  wallets: WalletAccount[];
  stops: StopOrder[];
  notifications: NotificationItem[];
  referral: ReferralSnapshot;
};
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

const defaultReferral = (id: string): ReferralSnapshot => ({
  code: `QNT-${id.slice(0, 6).toUpperCase()}`,
  clicks: 0,
  signups: 0,
  claimable: 0,
  claimed: 0,
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
    stops: [],
    notifications: [{
      id: `n_${Date.now()}`,
      type: "system",
      title: "Demo backend online",
      body: "Session, wallets, markets and trading services are active.",
      seen: false,
      createdAt: new Date().toISOString(),
    }],
    referral: defaultReferral(id),
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
  const markets = await getMarketCatalog();
  return {
    session: publicSession(session),
    wallets: session?.wallets ?? [],
    tokens: markets.tokens,
    blockTiers,
    favorites: session?.favorites ?? [],
    portfolio: session ? { cash: session.cash, positions: session.positions, trades: session.trades, activeBlock: session.activeBlock } : defaultPortfolio(),
    stops: session?.stops ?? [],
    notifications: session?.notifications ?? [],
    referral: session?.referral ?? defaultReferral("guest"),
    risk,
    treasury,
    status: {
      latencyMs: 86 + Math.floor(Math.random() * 32),
      indexedHead: 33610207 + Math.floor(Date.now() / 120000) % 9000,
      mode: backendConfig.mode,
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
  return getMarketCatalog();
}

export function getSearchResults(query: string) {
  return getMarketCatalog(query).then((catalog) => ({ results: catalog.tokens.slice(0, 24) }));
}

export function getTokenRoute(identifier: string, interval?: string) {
  return getMarketToken(identifier, interval);
}

export function getSafetyRoute(identifier: string) {
  return getMarketSafety(identifier);
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
  session.wallets = [wallet, ...session.wallets.filter((item) => item.address.toLowerCase() !== address.toLowerCase())].slice(0, backendConfig.maxWalletsPerUser);
  const notification: NotificationItem = {
    id: `n_${Date.now()}`,
    type: "system",
    title: "Wallet attached",
    body: `${wallet.label} was connected to Quantara.`,
    seen: false,
    createdAt: new Date().toISOString(),
  };
  session.notifications = [notification, ...session.notifications].slice(0, 50);
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
  const marketFills = await getMarketFills(identifier);
  return { fills: [...ownFills, ...marketFills].slice(0, 80) };
}

export async function getNotifications() {
  const session = await getCurrentSession();
  if (!session) throw new Error("AUTH_REQUIRED");
  return { notifications: session.notifications };
}

export async function markNotificationsSeen() {
  const session = await getCurrentSession();
  if (!session) throw new Error("AUTH_REQUIRED");
  session.notifications = session.notifications.map((item) => ({ ...item, seen: true }));
  return getNotifications();
}

export async function getReferral() {
  const session = await getCurrentSession();
  if (!session) throw new Error("AUTH_REQUIRED");
  return session.referral;
}

export async function claimReferral() {
  const session = await getCurrentSession();
  if (!session) throw new Error("AUTH_REQUIRED");
  const amount = session.referral.claimable;
  session.referral.claimable = 0;
  session.referral.claimed += amount;
  session.cash += amount;
  return session.referral;
}

export function trackReferralClick(code: string) {
  for (const session of store.values()) {
    if (session.referral.code.toLowerCase() === code.toLowerCase()) {
      session.referral.clicks += 1;
      return { ok: true };
    }
  }
  return { ok: false };
}

export async function getStops() {
  const session = await getCurrentSession();
  if (!session) throw new Error("AUTH_REQUIRED");
  return { stops: session.stops };
}

export async function createStop(input: { ticker: string; side: OrderSide; triggerPrice: number; amount: number }) {
  const session = await getCurrentSession();
  if (!session) throw new Error("AUTH_REQUIRED");
  const token = getToken(input.ticker);
  if (!token) throw new Error("TOKEN_NOT_FOUND");
  const stop: StopOrder = {
    id: `stop_${Date.now()}`,
    ticker: token.ticker,
    side: parseOrderSide(input.side),
    triggerPrice: Number(input.triggerPrice),
    amount: parsePositiveAmount(input.amount),
    status: "active",
    createdAt: new Date().toISOString(),
  };
  if (!Number.isFinite(stop.triggerPrice) || stop.triggerPrice <= 0) throw new Error("INVALID_TRIGGER");
  session.stops = [stop, ...session.stops].slice(0, 40);
  return getStops();
}

export async function clearStop(id: string) {
  const session = await getCurrentSession();
  if (!session) throw new Error("AUTH_REQUIRED");
  session.stops = session.stops.map((stop) => stop.id === id ? { ...stop, status: "cancelled" } : stop);
  return getStops();
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
  assertRateLimit(`trade:${session.id}`, 30, 60_000);
  const side = parseOrderSide(input.side);
  const token = getToken(input.ticker);
  if (!token) throw new Error("TOKEN_NOT_FOUND");
  if (token.locked) throw new Error("MARKET_LOCKED");
  const amount = parsePositiveAmount(input.amount);
  if (amount > backendConfig.maxOrderUsd) throw new Error("ORDER_TOO_LARGE");
  const quantity = amount / token.price;
  const existing = session.positions.find((position) => position.ticker === token.ticker);

  if (side === "buy") {
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
    side,
    quantity,
    price: token.price,
    total: amount,
    time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
  session.trades = [trade, ...session.trades].slice(0, 80);
  const notification: NotificationItem = {
    id: `n_${trade.id}`,
    type: "trade",
    title: `${side.toUpperCase()} ${token.ticker}`,
    body: `$${amount.toLocaleString("en-US")} filled at $${token.price.toFixed(6)}.`,
    seen: false,
    createdAt: new Date().toISOString(),
  };
  session.notifications = [notification, ...session.notifications].slice(0, 50);
  return getSnapshot();
}

export async function executeTrade(input: { token: string; side: OrderSide; amount: number }) {
  const token = getToken(input.token);
  if (!token) throw new Error("TOKEN_NOT_FOUND");
  return executeOrder({ ticker: token.ticker, side: input.side, amount: input.amount });
}

export function formatBackendError(error: unknown) {
  const message = error instanceof Error ? error.message : "UNKNOWN";
  const status = message === "AUTH_REQUIRED" ? 401 : message === "RATE_LIMITED" ? 429 : message.includes("NOT_FOUND") ? 404 : 400;
  return Response.json({ error: message }, { status });
}
