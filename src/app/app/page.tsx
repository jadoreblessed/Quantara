"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Token = {
  ticker: string;
  name: string;
  age: string;
  liq: string;
  holders: string;
  top: string;
  mc: string;
  vol: string;
  change: string;
  locked?: boolean;
};

const tokens: Token[] = [
  { ticker: "SURI", name: "Suri", age: "2m", liq: "$12.3K", holders: "308", top: "23%", mc: "$42.9K", vol: "$17.4K", change: "+18.4%" },
  { ticker: "SPLASHDOG", name: "Melky The SplashDog", age: "21m", liq: "$21.1K", holders: "674", top: "17%", mc: "$127.4K", vol: "$391.3K", change: "+127.0%" },
  { ticker: "GATOR", name: "The GMGN Gator", age: "23m", liq: "$7.7K", holders: "292", top: "17%", mc: "$20.2K", vol: "$68.5K", change: "-55.9%", locked: true },
  { ticker: "DUDAS", name: "Dudas the Goat", age: "42m", liq: "$7.6K", holders: "86", top: "53%", mc: "$19.9K", vol: "$11K", change: "-34.5%", locked: true },
  { ticker: "SPELLB", name: "Spelloff Bell", age: "56m", liq: "$6.8K", holders: "34", top: "6%", mc: "$61.3K", vol: "$42.6K", change: "+172.0%", locked: true },
  { ticker: "NIGHTTRADER", name: "The NightTrader", age: "1h", liq: "$11.2K", holders: "318", top: "25%", mc: "$34.3K", vol: "$221.5K", change: "-29.5%" },
  { ticker: "MARIO64", name: "Mario64", age: "1h", liq: "$9.4K", holders: "156", top: "19%", mc: "$104K", vol: "$242.4K", change: "+44.2%" },
];

function PhantomIcon() {
  return <span className="wallet-mark phantom" aria-hidden="true" />;
}

function WalletConnectIcon() {
  return <span className="wallet-mark wc" aria-hidden="true" />;
}

function MetaMaskIcon() {
  return <span className="wallet-mark mm" aria-hidden="true" />;
}

export default function AppPage() {
  const [chain, setChain] = useState("SOL");
  const [showAuth, setShowAuth] = useState(false);
  const [buySize, setBuySize] = useState(50);
  const paperSpent = useMemo(() => tokens.filter((token) => !token.locked).length * buySize, [buySize]);

  return (
    <main className="trade-app">
      <div className="discord-strip">
        <span>🎉 Join the Discord, we have a giveaway live!</span>
        <a href="https://discord.gg/QaFXA67QP">https://discord.gg/QaFXA67QP</a>
        <button aria-label="Dismiss announcement">×</button>
      </div>

      <header className="app-chrome">
        <Link className="app-brand" href="/">
          <span>↯</span>
          <b>quantara</b>
        </Link>
        <nav aria-label="App navigation">
          <button className="active">Trenches</button>
          <button>Portfolio</button>
          <button>Journal</button>
          <button>My Block</button>
          <button>Other ▾</button>
        </nav>
        <div className="account-actions">
          <span className="status-pill">No evaluation account</span>
          <button className="start-block" onClick={() => setShowAuth(true)}>Start Block</button>
          <button className="icon-button" aria-label="Sound">⌁</button>
          <button className="icon-button" aria-label="Notifications">♢</button>
          <button className="icon-button" aria-label="Discord">◈</button>
          <button className="login-button" onClick={() => setShowAuth(true)}>Log in / Sign up</button>
        </div>
      </header>

      <section className="app-body">
        <div className="market-toolbar">
          <h1>Trenches</h1>
          <div className="chain-tabs">
            {["SOL", "hood", "BNB", "BASE"].map((item) => (
              <button key={item} className={chain === item ? "active" : ""} onClick={() => setChain(item)}>
                {item === "SOL" ? "▰ " : ""}
                {item}
              </button>
            ))}
          </div>
          <div className="toolbar-spacer" />
          <button className="filter active">auto filter</button>
          <button className="filter">filters</button>
          <button className="filter">★ 0</button>
          <label className="buy-size">
            buy $
            <input value={buySize} onChange={(event) => setBuySize(Number(event.target.value) || 0)} inputMode="numeric" />
          </label>
        </div>

        <div className="trenches-board">
          <div className="board-head">
            <div>
              <b>migrated</b>
              <span> ·25</span>
              <small>$32k+ unlocks trading</small>
            </div>
            <label>
              <span>⌕</span>
              <input placeholder="search ticker, name or paste contract..." />
            </label>
            <button>new⌄</button>
          </div>

          <div className="token-list">
            {tokens.map((token, index) => (
              <article className={index === 0 ? "token-row selected" : "token-row"} key={token.ticker}>
                <span className={`token-avatar avatar-${index}`}>{token.ticker.slice(0, 1)}</span>
                <div className="token-main">
                  <div>
                    <b>{token.ticker}</b>
                    <span>{token.name}</span>
                    <small>{token.ticker.slice(0, 4)}...pump</small>
                  </div>
                  <p>{token.age}</p>
                  <div className="token-tags">
                    <span>LIQ {token.liq}</span>
                    <span>HLD {token.holders}</span>
                    <span>T10 {token.top}</span>
                  </div>
                </div>
                <div className="token-metrics">
                  <small>MC</small>
                  <b>{token.mc}</b>
                  <span>V {token.vol}</span>
                  <em className={token.change.startsWith("+") ? "positive" : "negative"}>{token.change}</em>
                </div>
                <button className={token.locked ? "buy-token locked" : "buy-token"} onClick={() => setShowAuth(true)}>
                  {token.locked ? "▣" : `↯ $${buySize}`}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="app-status">
        <span><i /> Stable · 186 ms</span>
        <span>SOL $76.1</span>
        <span>ETH $1 888</span>
        <span>⚡ {paperSpent} paper routed</span>
        <span>indexed head 33 610 207</span>
        <b>paper fills · priced off real pool depth</b>
      </footer>

      {showAuth && (
        <div className="auth-overlay" role="dialog" aria-modal="true" aria-labelledby="auth-title">
          <div className="auth-backdrop" onClick={() => setShowAuth(false)} />
          <section className="auth-modal">
            <button className="auth-close" onClick={() => setShowAuth(false)} aria-label="Close">×</button>
            <h2 id="auth-title">Create your account</h2>
            <p>Register or log in to manage your Blocks.</p>
            <button className="wallet-button primary"><PhantomIcon /> Continue with Phantom</button>
            <button className="wallet-button"><WalletConnectIcon /> WalletConnect</button>
            <button className="wallet-button"><MetaMaskIcon /> MetaMask / EVM</button>
            <p className="wallet-note">
              One click, no email, no password. Your wallet is your account. WalletConnect works with
              Phantom, Solflare, Backpack and more on your phone.
            </p>
            <div className="divider"><span /> or use email <span /></div>
            <label>Email<input placeholder="you@email.com" /></label>
            <label>Password<input placeholder="at least 8 characters" type="password" /></label>
            <button className="create-account">Create account</button>
            <p className="login-copy">Already have an account? <button>Log in</button></p>
            <small>
              Paper trading only — no deposits and no transaction approvals, ever. Phantom just signs a
              message to prove the wallet is yours.
            </small>
          </section>
        </div>
      )}
    </main>
  );
}
