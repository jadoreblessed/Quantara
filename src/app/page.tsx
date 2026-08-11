"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const blocks = [
  { name: "Scout", capital: "$1K", fee: "$49", target: "$180", risk: "12%" },
  { name: "Operator", capital: "$5K", fee: "$129", target: "$760", risk: "10%", hot: true },
  { name: "Syndicate", capital: "$10K", fee: "$249", target: "$1.6K", risk: "8%" },
];

const tape = ["SOL $176.1", "ETH $3,188", "198 migrations", "5.0M trades streamed", "indexed head 33 610 207"];

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .5A11.5 11.5 0 0 0 8.36 22.9c.58.1.79-.25.79-.56v-2.02c-3.22.7-3.9-1.38-3.9-1.38-.53-1.34-1.3-1.7-1.3-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.73-1.56-2.57-.29-5.27-1.29-5.27-5.73 0-1.27.45-2.3 1.2-3.11-.12-.3-.52-1.48.11-3.07 0 0 .98-.32 3.17 1.18A10.9 10.9 0 0 1 12 6.03c.98 0 1.96.13 2.88.39 2.2-1.5 3.16-1.18 3.16-1.18.64 1.59.24 2.77.12 3.07.75.82 1.2 1.84 1.2 3.1 0 4.46-2.71 5.44-5.3 5.73.42.37.79 1.09.79 2.2v3c0 .31.2.67.8.56A11.5 11.5 0 0 0 12 .5Z"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.9 2.25h3.28l-7.17 8.2 8.44 11.15h-6.6l-5.18-6.76-5.92 6.76H2.47l7.67-8.76L2.05 2.25h6.77l4.68 6.19 5.4-6.19Zm-1.15 17.39h1.82L7.83 4.1H5.88l11.87 15.54Z"
      />
    </svg>
  );
}

export default function Home() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 72);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="site-page">
      <div className="ambient-grid" />
      <header className="site-header-wrap">
        <div className={compact ? "site-header is-compact" : "site-header"}>
          <Link className="q-brand" href="/">
            <span className="q-mark">Q</span>
            <span>
              Quantara
              <small>paper trenches</small>
            </span>
          </Link>
          <nav className="site-nav" aria-label="Main navigation">
            <a href="#blocks">Blocks</a>
            <a href="#trenches">Trenches</a>
            <a href="#rules">Risk</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="site-actions">
            <Link className="launch-button" href="/app">Launch App</Link>
            <a className="round-link" href="https://github.com/jadoreblessed/Quantara" aria-label="Quantara on GitHub">
              <GithubIcon />
            </a>
            <a className="round-link" href="https://x.com" aria-label="Quantara on X">
              <XIcon />
            </a>
          </div>
        </div>
      </header>

      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow"><span /> V5 direction, now in product</p>
          <h1>
            Trade the <em>trenches</em> without torching your wallet.
          </h1>
          <p>
            Quantara is a paper-trading arena for fast crypto markets. Pick a Block, prove discipline against
            live-style streams, then manage your account from a real app interface.
          </p>
          <div className="hero-choices" aria-label="Primary choices">
            <Link href="/app?flow=block">Choose your block</Link>
            <a href="#trenches">Trade the trenches</a>
          </div>
        </div>

        <div className="hero-terminal" aria-label="Quantara terminal preview">
          <div className="terminal-top">
            <span className="live-dot" /> SOL / USD
            <strong>$176.10</strong>
          </div>
          <div className="terminal-chart">
            <div className="chart-glow" />
            <svg viewBox="0 0 520 220" role="img" aria-label="Animated market line">
              <path d="M8 170 C58 132 82 148 122 104 S190 86 238 116 326 38 382 70 452 22 512 44" />
              <circle cx="512" cy="44" r="6" />
            </svg>
          </div>
          <div className="floating-card sol-card">
            <small>migrated</small>
            <b>SURI</b>
            <span>MC $42.9K</span>
          </div>
          <div className="floating-card pnl-card">
            <small>block equity</small>
            <b>$5,318</b>
            <span>+6.4% today</span>
          </div>
        </div>
      </section>

      <div className="market-tape">
        {[...tape, ...tape].map((item, index) => (
          <span key={`${item}-${index}`}>⚡ {item}</span>
        ))}
      </div>

      <section id="blocks" className="section shell">
        <div className="section-head">
          <p className="kicker">Choose your block</p>
          <h2>Three lanes. One clean risk engine.</h2>
          <p>
            Start with simulated capital, clear limits, and a product flow that feels like a real terminal,
            not a spreadsheet with a buy button.
          </p>
        </div>
        <div className="block-grid">
          {blocks.map((block) => (
            <article className={block.hot ? "block-card hot" : "block-card"} key={block.name}>
              {block.hot && <span className="card-badge">popular</span>}
              <small>{block.name}</small>
              <h3>{block.capital}</h3>
              <dl>
                <div><dt>Entry</dt><dd>{block.fee}</dd></div>
                <div><dt>Target</dt><dd>{block.target}</dd></div>
                <div><dt>Max risk</dt><dd>{block.risk}</dd></div>
              </dl>
              <Link href="/app?flow=signup">Start block</Link>
            </article>
          ))}
        </div>
      </section>

      <section id="trenches" className="section trenches shell">
        <div className="trenches-panel">
          <div>
            <p className="kicker">Trade the trenches</p>
            <h2>Fast lists, filters, and paper fills.</h2>
            <p>
              The app screen follows the blockfirn-style workflow from your reference: token lanes, migrated
              pairs, instant buy sizing, account state, and a wallet-first login modal.
            </p>
          </div>
          <div className="mini-list">
            {["SURI", "SPLASHDOG", "NIGHTTRADER"].map((name, index) => (
              <div key={name}>
                <span className="coin-avatar">{name.slice(0, 1)}</span>
                <b>{name}</b>
                <small>{index === 1 ? "+127.0%" : index === 2 ? "-29.5%" : "$42.9K"}</small>
                <Link href="/app">Buy $50</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="rules" className="section shell">
        <div className="rule-row">
          <article>
            <span>01</span>
            <h3>Wallet signs in</h3>
            <p>No custodial deposits in the preview. Phantom, WalletConnect, MetaMask, or email creates the account shell.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Paper fills only</h3>
            <p>Trades are priced from the simulated stream. You can show the customer the flow without touching real liquidity.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Risk stays visible</h3>
            <p>Equity, loss limit, active block, and account status stay in the product chrome at all times.</p>
          </article>
        </div>
      </section>

      <section id="faq" className="section faq shell">
        <h2>Launch-ready preview, not final custody.</h2>
        <p>
          The current build focuses on the visual product experience: landing, app dashboard, registration modal,
          wallet choices, and paper-trading interface. Real auth, wallet signatures, payments, and market APIs can
          be wired after the design is approved.
        </p>
        <Link className="launch-button big" href="/app">Open app preview</Link>
      </section>

      <footer className="site-footer shell">
        <Link className="q-brand" href="/"><span className="q-mark">Q</span>Quantara</Link>
        <span>© 2026 Quantara · simulated trading only</span>
      </footer>
    </main>
  );
}
