"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { AppSnapshot, BlockTier, Chain, OrderSide, Position, Token, Trade, View } from "@/lib/quantara/types";
import { blockTiers as fallbackBlockTiers, tokens as fallbackTokens } from "@/lib/quantara/data";

type IconName = "bell" | "chevron" | "filter" | "lock" | "search" | "sound" | "star" | "x";

const formatCurrency = (value: number, digits = 0) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: digits }).format(value);
const formatCompact = (value: number) => new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
const formatPrice = (value: number) => value < 0.01 ? `$${value.toFixed(6)}` : formatCurrency(value, 4);

function AppIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    chevron: <path d="m8 10 4 4 4-4" />,
    filter: <path d="M4 6h16M7 12h10M10 18h4" />,
    lock: <><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    sound: <><path d="M5 10v4h4l5 4V6L9 10H5Z" /><path d="M17 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12" /></>,
    star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />,
    x: <><path d="m6 6 12 12M18 6 6 18" /></>,
  };
  return <svg className="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function EmptyState({ title, copy, action, onAction }: { title: string; copy: string; action: string; onAction: () => void }) {
  return <div className="app-empty"><span className="empty-orbit" aria-hidden="true" /><h2>{title}</h2><p>{copy}</p><button type="button" className="primary-action" onClick={onAction}>{action}</button></div>;
}

export default function AppPage() {
  const [marketTokens, setMarketTokens] = useState<Token[]>(fallbackTokens);
  const [availableBlocks, setAvailableBlocks] = useState<BlockTier[]>(fallbackBlockTiers);
  const [activeView, setActiveView] = useState<View>("Trenches");
  const [chain, setChain] = useState<Chain>("SOL");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"new" | "volume" | "movers">("new");
  const [autoFilter, setAutoFilter] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showLocked, setShowLocked] = useState(true);
  const [minLiquidity, setMinLiquidity] = useState(0);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set());
  const [showAuth, setShowAuth] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [activeBlock, setActiveBlock] = useState<BlockTier | null>(null);
  const [buySize, setBuySize] = useState(50);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [orderSide, setOrderSide] = useState<OrderSide>("buy");
  const [orderAmount, setOrderAmount] = useState(50);
  const [paperCash, setPaperCash] = useState(5000);
  const [positions, setPositions] = useState<Position[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [backendStatus, setBackendStatus] = useState<AppSnapshot["status"]>({ latencyMs: 186, indexedHead: 33610207, mode: "simulation" });
  const [soundOn, setSoundOn] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showOther, setShowOther] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const flash = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  }, []);

  const applySnapshot = useCallback((snapshot: AppSnapshot) => {
    setMarketTokens(snapshot.tokens);
    setAvailableBlocks(snapshot.blockTiers);
    setUserName(snapshot.session?.name ?? null);
    setPaperCash(snapshot.portfolio.cash);
    setPositions(snapshot.portfolio.positions);
    setTrades(snapshot.portfolio.trades);
    setActiveBlock(snapshot.portfolio.activeBlock);
    setBackendStatus(snapshot.status);
  }, []);

  const api = useCallback(async (path: string, init?: RequestInit) => {
    const response = await fetch(path, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error ?? "API_ERROR");
    applySnapshot(payload as AppSnapshot);
    return payload as AppSnapshot;
  }, [applySnapshot]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void api("/api/app/snapshot").catch(() => flash("Backend snapshot unavailable · using bundled demo data"));
  }, [api, flash]);

  const visibleTokens = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const result = marketTokens.filter((token) => {
      if (token.chain !== chain) return false;
      if (normalizedQuery && !`${token.ticker} ${token.name}`.toLowerCase().includes(normalizedQuery)) return false;
      if (!showLocked && token.locked) return false;
      if (favoritesOnly && !favorites.has(token.ticker)) return false;
      if (token.liquidity < minLiquidity) return false;
      if (autoFilter && (token.locked || token.liquidity < 10000 || token.top10 > 30)) return false;
      return true;
    });
    return result.toSorted((a, b) => sort === "volume" ? b.volume - a.volume : sort === "movers" ? Math.abs(b.change) - Math.abs(a.change) : a.ageMinutes - b.ageMinutes);
  }, [autoFilter, chain, favorites, favoritesOnly, marketTokens, minLiquidity, query, showLocked, sort]);

  const positionRows = useMemo(() => positions.map((position) => {
    const token = marketTokens.find((item) => item.ticker === position.ticker)!;
    return { ...position, token, value: position.quantity * token.price, pnl: (token.price - position.averagePrice) * position.quantity };
  }).filter((position) => position.token), [marketTokens, positions]);

  const portfolioValue = paperCash + positionRows.reduce((sum, position) => sum + position.value, 0);
  const unrealizedPnl = positionRows.reduce((sum, position) => sum + position.pnl, 0);
  const startingBalance = activeBlock?.size ?? 5000;
  const totalPnl = portfolioValue - startingBalance;
  const targetProgress = activeBlock ? Math.max(0, Math.min(100, (totalPnl / activeBlock.target) * 100)) : 0;

  const toggleFavorite = (ticker: string) => setFavorites((current) => {
    const next = new Set(current);
    if (next.has(ticker)) next.delete(ticker); else next.add(ticker);
    return next;
  });

  const openOrder = (token: Token, side: OrderSide = "buy") => {
    if (token.locked) {
      flash(`${token.ticker} is below the liquidity threshold`);
      return;
    }
    setSelectedToken(token);
    setOrderSide(side);
    setOrderAmount(buySize);
  };

  const submitAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const snapshot = await api("/api/auth/demo", { method: "POST", body: JSON.stringify({ email: authEmail }) });
      setShowAuth(false);
      flash(`Demo session ready · welcome ${snapshot.session?.name ?? "trader"}`);
    } catch {
      flash("Could not create demo session");
    }
  };

  const connectDemoWallet = async (provider: string) => {
    try {
      await api("/api/auth/demo", { method: "POST", body: JSON.stringify({ provider }) });
      setShowAuth(false);
      flash(`${provider} connected in demo mode`);
    } catch {
      flash("Could not connect demo wallet");
    }
  };

  const activateBlock = async (tier: BlockTier) => {
    if (!userName) {
      setShowBlockPicker(false);
      setShowAuth(true);
      flash("Create a demo session before starting a Block");
      return;
    }
    try {
      await api("/api/block/activate", { method: "POST", body: JSON.stringify({ size: tier.size }) });
      setShowBlockPicker(false);
      setActiveView("My Block");
      flash(`${formatCurrency(tier.size)} evaluation Block activated`);
    } catch {
      flash("Could not activate Block");
    }
  };

  const executeOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedToken || orderAmount <= 0) return;
    if (!userName) {
      setSelectedToken(null);
      setShowAuth(true);
      flash("Create a demo session to place paper orders");
      return;
    }
    const currentPosition = positions.find((position) => position.ticker === selectedToken.ticker);
    if (orderSide === "buy" && orderAmount > paperCash) {
      flash("Not enough paper cash for this order");
      return;
    }
    if (orderSide === "sell" && (!currentPosition || currentPosition.quantity * selectedToken.price < orderAmount - 0.01)) {
      flash(`You do not hold ${formatCurrency(orderAmount)} of ${selectedToken.ticker}`);
      return;
    }

    try {
      await api("/api/orders", { method: "POST", body: JSON.stringify({ ticker: selectedToken.ticker, side: orderSide, amount: orderAmount }) });
      flash(`${orderSide === "buy" ? "Bought" : "Sold"} ${formatCurrency(orderAmount)} of ${selectedToken.ticker}`);
      setSelectedToken(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "ORDER_FAILED";
      flash(message === "INSUFFICIENT_CASH" ? "Not enough paper cash for this order" : message === "INSUFFICIENT_POSITION" ? `You do not hold ${formatCurrency(orderAmount)} of ${selectedToken.ticker}` : "Order rejected by backend");
    }
  };

  return (
    <main className="trade-app">
      <header className="app-chrome">
        <Link className="app-brand" href="/"><b>quantara</b></Link>
        <nav aria-label="App navigation">
          {(["Trenches", "Portfolio", "Journal", "My Block"] as View[]).map((view) => <button type="button" key={view} className={activeView === view ? "active" : ""} onClick={() => setActiveView(view)}>{view}</button>)}
          <div className="other-menu">
            <button type="button" aria-expanded={showOther} onClick={() => setShowOther((value) => !value)}>Other <AppIcon name="chevron" /></button>
            {showOther && <div className="app-popover other-popover"><Link href="/rules">Trading rules</Link><Link href="/docs">Documentation</Link><Link href="/legal">Legal &amp; privacy</Link></div>}
          </div>
        </nav>
        <div className="account-actions">
          <button type="button" className={`status-pill ${activeBlock ? "ready" : ""}`} onClick={() => setActiveView("My Block")}>{activeBlock ? `${formatCurrency(activeBlock.size)} evaluation` : "Practice mode"}</button>
          <button type="button" className="start-block" onClick={() => setShowBlockPicker(true)}>{activeBlock ? "Switch Block" : "Start Block"}</button>
          <button type="button" className={`icon-button ${soundOn ? "is-on" : ""}`} aria-label={soundOn ? "Mute sounds" : "Enable sounds"} onClick={() => setSoundOn((value) => !value)}><AppIcon name="sound" /></button>
          <div className="notification-menu">
            <button type="button" className="icon-button" aria-label="Notifications" aria-expanded={showNotifications} onClick={() => setShowNotifications((value) => !value)}><AppIcon name="bell" /><i /></button>
            {showNotifications && <div className="app-popover notification-popover"><b>Notifications</b><p>Paper terminal is ready.</p><p>{activeBlock ? "Your evaluation Block is active." : "Start a Block when you are ready to evaluate."}</p><small>Live backend alerts arrive in a later phase.</small></div>}
          </div>
          <button type="button" className="login-button" onClick={() => setShowAuth(true)}>{userName ?? "Log in / Sign up"}</button>
        </div>
      </header>

      <section className="app-body">
        {activeView === "Trenches" ? <TrenchesView
          chain={chain} setChain={setChain} query={query} setQuery={setQuery} sort={sort} setSort={setSort}
          autoFilter={autoFilter} setAutoFilter={setAutoFilter} showFilters={showFilters} setShowFilters={setShowFilters}
          showLocked={showLocked} setShowLocked={setShowLocked} minLiquidity={minLiquidity} setMinLiquidity={setMinLiquidity}
          favoritesOnly={favoritesOnly} setFavoritesOnly={setFavoritesOnly} favorites={favorites} toggleFavorite={toggleFavorite}
          buySize={buySize} setBuySize={setBuySize} visibleTokens={visibleTokens} openOrder={openOrder}
        /> : null}

        {activeView === "Portfolio" ? <PortfolioView paperCash={paperCash} portfolioValue={portfolioValue} unrealizedPnl={unrealizedPnl} positionRows={positionRows} setActiveView={setActiveView} openOrder={openOrder} /> : null}
        {activeView === "Journal" ? <JournalView trades={trades} clearJournal={() => api("/api/journal", { method: "DELETE" }).then(() => flash("Journal cleared"))} setActiveView={setActiveView} /> : null}
        {activeView === "My Block" ? <BlockView activeBlock={activeBlock} portfolioValue={portfolioValue} totalPnl={totalPnl} targetProgress={targetProgress} startBlock={() => setShowBlockPicker(true)} /> : null}
      </section>

      <footer className="app-status"><span><i /> Stable · {backendStatus.latencyMs} ms</span><span>SOL $76.1</span><span>ETH $1,888</span><span>{formatCurrency(trades.reduce((sum, trade) => sum + trade.total, 0))} paper routed</span><span>indexed head {backendStatus.indexedHead.toLocaleString("en-US")}</span><b>simulation only · no deposits or live orders</b></footer>

      {showAuth ? <AuthModal authEmail={authEmail} setAuthEmail={setAuthEmail} close={() => setShowAuth(false)} submit={submitAuth} connect={connectDemoWallet} /> : null}
      {showBlockPicker ? <BlockPicker tiers={availableBlocks} close={() => setShowBlockPicker(false)} activate={activateBlock} /> : null}
      {selectedToken ? <OrderModal token={selectedToken} side={orderSide} setSide={setOrderSide} amount={orderAmount} setAmount={setOrderAmount} paperCash={paperCash} userName={userName} close={() => setSelectedToken(null)} submit={executeOrder} /> : null}
      {toast ? <div className="app-toast" role="status">{toast}</div> : null}
    </main>
  );
}

type TrenchesProps = {
  chain: Chain; setChain: (value: Chain) => void; query: string; setQuery: (value: string) => void;
  sort: "new" | "volume" | "movers"; setSort: (value: "new" | "volume" | "movers") => void;
  autoFilter: boolean; setAutoFilter: (value: boolean) => void; showFilters: boolean; setShowFilters: (value: boolean) => void;
  showLocked: boolean; setShowLocked: (value: boolean) => void; minLiquidity: number; setMinLiquidity: (value: number) => void;
  favoritesOnly: boolean; setFavoritesOnly: (value: boolean) => void; favorites: Set<string>; toggleFavorite: (ticker: string) => void;
  buySize: number; setBuySize: (value: number) => void; visibleTokens: Token[]; openOrder: (token: Token, side?: OrderSide) => void;
};

function TrenchesView(props: TrenchesProps) {
  const resetView = () => { props.setQuery(""); props.setMinLiquidity(0); props.setShowLocked(true); props.setAutoFilter(false); props.setFavoritesOnly(false); };
  return <>
    <div className="market-toolbar"><div className="toolbar-title"><span>Paper terminal</span><h1>Trenches</h1></div><div className="chain-tabs" role="tablist" aria-label="Network">{(["SOL", "hood", "BNB", "BASE"] as Chain[]).map((item) => <button type="button" role="tab" aria-selected={props.chain === item} key={item} className={props.chain === item ? "active" : ""} onClick={() => props.setChain(item)}>{item}</button>)}</div><div className="toolbar-spacer" /><button type="button" className={`filter ${props.autoFilter ? "active" : ""}`} onClick={() => props.setAutoFilter(!props.autoFilter)}>auto filter</button><div className="filter-menu"><button type="button" className={`filter ${props.showFilters ? "active" : ""}`} aria-expanded={props.showFilters} onClick={() => props.setShowFilters(!props.showFilters)}><AppIcon name="filter" /> filters</button>{props.showFilters ? <div className="app-popover filter-popover"><label>Minimum liquidity<select value={props.minLiquidity} onChange={(event) => props.setMinLiquidity(Number(event.target.value))}><option value={0}>Any liquidity</option><option value={10000}>$10K+</option><option value={20000}>$20K+</option></select></label><label className="toggle-row"><span>Show locked markets</span><input type="checkbox" checked={props.showLocked} onChange={(event) => props.setShowLocked(event.target.checked)} /></label><button type="button" onClick={resetView}>Reset filters</button></div> : null}</div><button type="button" className={`filter ${props.favoritesOnly ? "active" : ""}`} onClick={() => props.setFavoritesOnly(!props.favoritesOnly)}><AppIcon name="star" /> {props.favorites.size}</button><label className="buy-size">order $<input aria-label="Default order size" value={props.buySize} min={1} onChange={(event) => props.setBuySize(Math.max(1, Number(event.target.value) || 1))} inputMode="numeric" /></label></div>
    <div className="trenches-board"><div className="board-head"><div><b>migrated</b><span> · {props.visibleTokens.length}</span><small>paper fills · live market pricing</small></div><label><AppIcon name="search" /><input value={props.query} onChange={(event) => props.setQuery(event.target.value)} placeholder="search ticker or token name..." /></label><label className="sort-select">sort<select aria-label="Sort tokens" value={props.sort} onChange={(event) => props.setSort(event.target.value as TrenchesProps["sort"])}><option value="new">new</option><option value="volume">volume</option><option value="movers">movers</option></select></label></div><div className="token-list">{props.visibleTokens.length > 0 ? props.visibleTokens.map((token, index) => <TokenRow key={token.ticker} token={token} tokenIndex={index} buySize={props.buySize} favorite={props.favorites.has(token.ticker)} toggleFavorite={props.toggleFavorite} openOrder={props.openOrder} />) : <div className="board-empty"><AppIcon name="search" /><b>No markets match these filters</b><span>Change the network, clear the search, or reset filters.</span><button type="button" onClick={resetView}>Reset view</button></div>}</div></div>
  </>;
}

function TokenRow({ token, tokenIndex, buySize, favorite, toggleFavorite, openOrder }: { token: Token; tokenIndex: number; buySize: number; favorite: boolean; toggleFavorite: (ticker: string) => void; openOrder: (token: Token) => void }) {
  return <article className="token-row" onDoubleClick={() => openOrder(token)}><button type="button" className={`favorite-token ${favorite ? "active" : ""}`} aria-label={`${favorite ? "Remove" : "Add"} ${token.ticker} ${favorite ? "from" : "to"} favorites`} onClick={() => toggleFavorite(token.ticker)}><AppIcon name="star" /></button><span className={`token-avatar avatar-${tokenIndex}`}>{token.ticker.slice(0, 1)}</span><div className="token-main"><div><b>{token.ticker}</b><span>{token.name}</span><small>{token.chain} · {token.ticker.slice(0, 4)}...paper</small></div><p>{token.ageMinutes < 60 ? `${token.ageMinutes}m` : `${Math.floor(token.ageMinutes / 60)}h`}</p><div className="token-tags"><span>LIQ ${formatCompact(token.liquidity)}</span><span>HLD {token.holders}</span><span>T10 {token.top10}%</span></div></div><div className="token-metrics"><small>MC</small><b>${formatCompact(token.marketCap)}</b><span>V ${formatCompact(token.volume)}</span><em className={token.change >= 0 ? "positive" : "negative"}>{token.change >= 0 ? "+" : ""}{token.change.toFixed(1)}%</em></div><button type="button" className={token.locked ? "buy-token locked" : "buy-token"} onClick={() => openOrder(token)}>{token.locked ? <><AppIcon name="lock" /> locked</> : <>trade ${buySize}</>}</button></article>;
}

type PositionRow = Position & { token: Token; value: number; pnl: number };

function PortfolioView({ paperCash, portfolioValue, unrealizedPnl, positionRows, setActiveView, openOrder }: { paperCash: number; portfolioValue: number; unrealizedPnl: number; positionRows: PositionRow[]; setActiveView: (view: View) => void; openOrder: (token: Token, side?: OrderSide) => void }) {
  return <div className="app-view"><div className="view-heading"><div><span>Paper account</span><h1>Portfolio</h1><p>Positions update immediately when you place a simulated order.</p></div><button type="button" className="primary-action" onClick={() => setActiveView("Trenches")}>Trade markets</button></div><div className="summary-grid"><article><span>Portfolio value</span><b>{formatCurrency(portfolioValue, 2)}</b><small>cash + open positions</small></article><article><span>Available cash</span><b>{formatCurrency(paperCash, 2)}</b><small>ready for paper orders</small></article><article className={unrealizedPnl >= 0 ? "gain" : "loss"}><span>Unrealized P&amp;L</span><b>{formatCurrency(unrealizedPnl, 2)}</b><small>priced from current demo market</small></article></div>{positionRows.length > 0 ? <div className="data-table"><div className="data-row data-head"><span>asset</span><span>position</span><span>average</span><span>current</span><span>P&amp;L</span><span /></div>{positionRows.map((position) => <div className="data-row" key={position.ticker}><span className="asset-cell"><i>{position.ticker.slice(0, 1)}</i><b>{position.ticker}<small>{position.token.name}</small></b></span><span>{formatCurrency(position.value, 2)}<small>{formatCompact(position.quantity)} tokens</small></span><span>{formatPrice(position.averagePrice)}</span><span>{formatPrice(position.token.price)}</span><span className={position.pnl >= 0 ? "positive" : "negative"}>{formatCurrency(position.pnl, 2)}</span><span><button type="button" onClick={() => openOrder(position.token, "sell")}>manage</button></span></div>)}</div> : <EmptyState title="No open positions" copy="Your paper portfolio is empty. Place a trade in the Trenches and it will appear here instantly." action="Find a market" onAction={() => setActiveView("Trenches")} />}</div>;
}

function JournalView({ trades, clearJournal, setActiveView }: { trades: Trade[]; clearJournal: () => void; setActiveView: (view: View) => void }) {
  return <div className="app-view"><div className="view-heading"><div><span>Execution history</span><h1>Journal</h1><p>Every backend paper fill is recorded here for review.</p></div>{trades.length > 0 ? <button type="button" className="secondary-action" onClick={clearJournal}>Clear journal</button> : null}</div>{trades.length > 0 ? <div className="data-table journal-table"><div className="data-row data-head"><span>time</span><span>asset</span><span>side</span><span>price</span><span>quantity</span><span>total</span></div>{trades.map((trade) => <div className="data-row" key={trade.id}><span>{trade.time}</span><span><b>{trade.ticker}</b></span><span className={trade.side === "buy" ? "positive" : "negative"}>{trade.side}</span><span>{formatPrice(trade.price)}</span><span>{formatCompact(trade.quantity)}</span><span>{formatCurrency(trade.total, 2)}</span></div>)}</div> : <EmptyState title="Your journal is ready" copy="Complete a paper order and Quantara will record the side, price, quantity, and time here." action="Place first trade" onAction={() => setActiveView("Trenches")} />}</div>;
}

function BlockView({ activeBlock, portfolioValue, totalPnl, targetProgress, startBlock }: { activeBlock: BlockTier | null; portfolioValue: number; totalPnl: number; targetProgress: number; startBlock: () => void }) {
  return <div className="app-view"><div className="view-heading"><div><span>Evaluation</span><h1>My Block</h1><p>Track the rules and progress of your current simulated evaluation.</p></div>{activeBlock ? <button type="button" className="secondary-action" onClick={startBlock}>Switch Block</button> : null}</div>{activeBlock ? <div className="block-dashboard"><section className="block-primary"><div className="block-label"><span>Active evaluation</span><i>paper</i></div><b>{formatCurrency(activeBlock.size)}</b><p>Starting buying power</p><div className="progress-copy"><span>Profit target progress</span><b>{targetProgress.toFixed(1)}%</b></div><div className="progress-track"><i style={{ width: `${targetProgress}%` }} /></div><small>{formatCurrency(Math.max(0, activeBlock.target - totalPnl), 2)} remaining to target</small></section><section className="block-rules"><article><span>Current equity</span><b>{formatCurrency(portfolioValue, 2)}</b><small className={totalPnl >= 0 ? "positive" : "negative"}>{totalPnl >= 0 ? "+" : ""}{formatCurrency(totalPnl, 2)}</small></article><article><span>Maximum loss</span><b>{formatCurrency(activeBlock.maxLoss)}</b><small>{formatCurrency(activeBlock.maxLoss + totalPnl, 2)} buffer remaining</small></article><article><span>Profit split</span><b>90%</b><small>after evaluation</small></article><article><span>Time remaining</span><b>30 days</b><small>no daily loss limit</small></article></section></div> : <EmptyState title="Start your first Block" copy="Pick a simulated evaluation size. This demo activates it locally, resets the paper account, and starts tracking your progress." action="Choose a Block" onAction={startBlock} />}</div>;
}

function AuthModal({ authEmail, setAuthEmail, close, submit, connect }: { authEmail: string; setAuthEmail: (value: string) => void; close: () => void; submit: (event: FormEvent<HTMLFormElement>) => void; connect: (provider: string) => void }) {
  return <div className="auth-overlay" role="dialog" aria-modal="true" aria-labelledby="auth-title"><div className="auth-backdrop" onClick={close} /><form className="auth-modal" onSubmit={submit}><button type="button" className="auth-close" onClick={close} aria-label="Close"><AppIcon name="x" /></button><span className="modal-kicker">Demo access</span><h2 id="auth-title">Enter the terminal</h2><p>Create a local demo session. No account is sent to a server.</p><button type="button" className="wallet-button primary" onClick={() => connect("Phantom")}><span className="wallet-mark phantom" aria-hidden="true" />Continue with Phantom</button><button type="button" className="wallet-button" onClick={() => connect("WalletConnect")}><span className="wallet-mark wc" aria-hidden="true" />WalletConnect</button><div className="divider"><span /> or use email <span /></div><label>Email<input required value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} placeholder="you@email.com" type="email" /></label><label>Password<input required placeholder="at least 8 characters" type="password" minLength={8} /></label><button type="submit" className="create-account">Create demo session</button><small>Paper trading only · this form stores no credentials and sends no transactions.</small></form></div>;
}

function BlockPicker({ tiers, close, activate }: { tiers: BlockTier[]; close: () => void; activate: (tier: BlockTier) => void }) {
  return <div className="auth-overlay center-modal" role="dialog" aria-modal="true" aria-labelledby="block-title"><div className="auth-backdrop" onClick={close} /><section className="auth-modal block-picker"><button type="button" className="auth-close" onClick={close} aria-label="Close"><AppIcon name="x" /></button><span className="modal-kicker">Simulated evaluation</span><h2 id="block-title">Choose your Block</h2><p>Activating a backend demo Block resets the current paper portfolio and journal.</p><div className="block-options">{tiers.map((tier) => <button type="button" key={tier.size} onClick={() => activate(tier)}><span>{formatCurrency(tier.size)}</span><b>{formatCurrency(tier.fee)} demo fee</b><small>{formatCurrency(tier.target)} target · {formatCurrency(tier.maxLoss)} max loss</small></button>)}</div></section></div>;
}

function OrderModal({ token, side, setSide, amount, setAmount, paperCash, userName, close, submit }: { token: Token; side: OrderSide; setSide: (side: OrderSide) => void; amount: number; setAmount: (amount: number) => void; paperCash: number; userName: string | null; close: () => void; submit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <div className="auth-overlay order-overlay" role="dialog" aria-modal="true" aria-labelledby="order-title"><div className="auth-backdrop" onClick={close} /><form className="auth-modal order-modal" onSubmit={submit}><button type="button" className="auth-close" onClick={close} aria-label="Close"><AppIcon name="x" /></button><span className="modal-kicker">Paper order · {token.chain}</span><div className="order-asset"><i>{token.ticker.slice(0, 1)}</i><div><h2 id="order-title">{token.ticker}</h2><p>{token.name} · {formatPrice(token.price)}</p></div></div><div className="side-tabs"><button type="button" className={side === "buy" ? "active buy" : ""} onClick={() => setSide("buy")}>Buy</button><button type="button" className={side === "sell" ? "active sell" : ""} onClick={() => setSide("sell")}>Sell</button></div><label className="order-input">Order value<span>$</span><input autoFocus value={amount} min={1} step={1} onChange={(event) => setAmount(Math.max(1, Number(event.target.value) || 1))} type="number" /><small>{formatCompact(amount / token.price)} {token.ticker}</small></label><div className="quick-amounts">{[25, 50, 100, 250].map((value) => <button type="button" key={value} onClick={() => setAmount(value)}>${value}</button>)}</div><div className="order-summary"><span>Available paper cash <b>{formatCurrency(paperCash, 2)}</b></span><span>Estimated fill <b>{formatPrice(token.price)}</b></span><span>Network fee <b>$0.00</b></span></div><button type="submit" className={`execute-order ${side}`}>{userName ? `${side === "buy" ? "Buy" : "Sell"} ${token.ticker}` : "Continue to demo access"}</button><small className="simulation-note">Simulated fill only · no wallet approval or live transaction.</small></form></div>;
}
