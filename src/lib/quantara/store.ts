import { cookies } from "next/headers";
import { blockTiers, getBlockTier, getToken, tokens } from "./data";
import type { AppSnapshot, OrderSide, PortfolioSnapshot, Trade, UserSession } from "./types";

const SESSION_COOKIE = "quantara_session";

type StoredSession = UserSession & PortfolioSnapshot;
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

export async function getSnapshot(): Promise<AppSnapshot> {
  const session = await getCurrentSession();
  return {
    session: publicSession(session),
    tokens,
    blockTiers,
    portfolio: session ? { cash: session.cash, positions: session.positions, trades: session.trades, activeBlock: session.activeBlock } : defaultPortfolio(),
    status: {
      latencyMs: 86 + Math.floor(Math.random() * 32),
      indexedHead: 33610207 + Math.floor(Date.now() / 120000) % 9000,
      mode: "simulation",
    },
  };
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

export async function executeOrder(input: { ticker: string; side: OrderSide; amount: number }) {
  const session = await getCurrentSession();
  if (!session) throw new Error("AUTH_REQUIRED");
  const token = getToken(input.ticker);
  if (!token) throw new Error("TOKEN_NOT_FOUND");
  if (token.locked) throw new Error("MARKET_LOCKED");
  const amount = Math.max(1, Math.round(input.amount * 100) / 100);
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

export function formatBackendError(error: unknown) {
  const message = error instanceof Error ? error.message : "UNKNOWN";
  const status = message === "AUTH_REQUIRED" ? 401 : message.includes("NOT_FOUND") ? 404 : 400;
  return Response.json({ error: message }, { status });
}
