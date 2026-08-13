"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { LiquidCandles } from "@/components/liquid-candles";

const tiers = [
  { size: "$1,000", note: "evaluation block", target: "$2,000", loss: "$800", split: "90%", price: "$99 · start" },
  { size: "$3,000", note: "evaluation block · most popular", target: "$3,000", loss: "$2,400", split: "90%", price: "$179 · start", hot: true },
  { size: "$5,000", note: "evaluation block", target: "$5,000", loss: "$4,000", split: "90%", price: "$249 · start" },
];

const primitives = [
  { label: "Block Engine", desc: "evaluation + funded rules", status: "LIVE" },
  { label: "Risk Guard", desc: "max loss enforcement", status: "LIVE" },
  { label: "Treasury Rail", desc: "USDC payout reserve", status: "READY" },
  { label: "Market Feed", desc: "BNB memecoin pricing", status: "LIVE" },
  { label: "Payout Wall", desc: "public receipts after first payout", status: "ARMED" },
  { label: "Scale Path", desc: "$5K → $25K funded blocks", status: "NEXT" },
];

const systemRows = [
  { key: "RULESET", value: "30D / NO DAILY LIMIT" },
  { key: "SPLIT", value: "90% TRADER" },
  { key: "TREASURY", value: "$10,000 USDC" },
];

const flowCommands = [
  { cmd: "quantara.buy_block --size 3000", result: "block_003 minted · rules attached" },
  { cmd: "risk_engine.arm --max-loss 2400", result: "guardrails online · breach monitor active" },
  { cmd: "evaluation.start --days 30", result: "live market feed linked · no daily limit" },
  { cmd: "funded_block.unlock", result: "payout rail prepared · split set to 90%" },
];

const simulatorStats = [
  { label: "Account", value: "$5,000", hint: "evaluation block" },
  { label: "Target", value: "$10,000", hint: "42% complete" },
  { label: "Max loss", value: "$4,000", hint: "no breach" },
];

const payoutGhosts = [
  { trader: "Trader #001", payout: "Awaiting", network: "BNB Chain", receipt: "pending first public receipt" },
  { trader: "Trader #002", payout: "Queued slot", network: "BNB Chain", receipt: "auto-publishes on payout" },
  { trader: "Trader #003", payout: "Locked", network: "BNB Chain", receipt: "no invented hashes" },
];

function XIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
}

function LinkIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><g transform="rotate(-45 12 12)"><rect x="3.5" y="7.6" width="17" height="8.8" rx="4.4" /><line x1="12" y1="7.6" x2="12" y2="16.4" /></g></svg>;
}

export default function Home() {
  const [announcement, setAnnouncement] = useState(true);
  const [treasuryBalance, setTreasuryBalance] = useState(0);
  const treasuryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("in")),
      { threshold: 0.15 },
    );
    document.querySelectorAll(".bf-reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const treasury = treasuryRef.current;
    if (!treasury) return;

    let frame = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      frame = requestAnimationFrame(() => setTreasuryBalance(10000));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const startedAt = performance.now();
      const animate = (now: number) => {
        const progress = Math.min((now - startedAt) / 1350, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setTreasuryBalance(Math.round(10000 * eased));
        if (progress < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
      observer.disconnect();
    }, { threshold: 0.35 });

    observer.observe(treasury);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  function moveTreasuryGlow(event: React.PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--treasury-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--treasury-y", `${event.clientY - bounds.top}px`);
  }

  return (
    <main className="bf-home">
      <link rel="stylesheet" href="https://myblockfirm.com/fonts/fonts.css" />

      <div className="bf-atmosphere" aria-hidden="true">
        <span className="bf-aurora bf-aurora-one" />
        <span className="bf-aurora bf-aurora-two" />
        <span className="bf-market-grid" />
        <span className="bf-circuit-grid" />
        <span className="bf-market-pulse" />
        <span className="bf-float-chip chip-one">RISK OK</span>
        <span className="bf-float-chip chip-two">BNB SYNC</span>
        <span className="bf-float-chip chip-three">BLOCK #024</span>
        <span className="bf-float-chip chip-four">90% SPLIT</span>
        <span className="bf-scanline" />
      </div>

      {announcement && (
        <div className="bf-announcement">
          <span>Code <b>EARLY</b> for <b>50% off</b> ANY evaluation Block · ending soon</span>
          <button type="button" aria-label="Dismiss announcement" onClick={() => setAnnouncement(false)}>×</button>
        </div>
      )}

      <nav className="bf-nav">
        <div className="bf-wrap bf-nav-in">
          <Link className="bf-logo" href="#top"><span>quantara<span className="bf-cursor" /></span></Link>
          <span className="bf-socials">
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X / Twitter"><XIcon /></a>
            <a href="https://github.com/jadoreblessed/Quantara" target="_blank" rel="noreferrer" aria-label="GitHub"><LinkIcon /></a>
          </span>
          <div className="bf-nav-links">
            <a href="#how">how it works</a><a href="#payouts">payouts</a><Link href="/rules">rules</Link><Link href="/docs">docs</Link><a href="#accounts">$quantara</a>
          </div>
          <Link className="bf-btn bf-btn-accent" href="/app">launch app</Link>
        </div>
      </nav>

      <header className="bf-hero" id="top">
        <LiquidCandles />
        <div className="bf-glow" />
        <div className="bf-wrap">
          <div className="bf-hero-layout">
            <div className="bf-hero-head">
              <h1>
                <span className="bf-statline sl1">prove your edge in <b>live markets</b></span>
                <span className="bf-statline sl2">unlock up to <b>$5k</b> in buying power</span>
                <span className="bf-statline sl3 dim">keep <b>90%</b> when your strategy delivers</span>
              </h1>
              <p className="bf-hero-sub">Trade a rules-based simulation priced from live on-chain markets. Clear the evaluation, unlock a funded Block, and qualify for crypto payouts · without deposits, seed phrases, or KYC.</p>
              <div className="bf-hero-cta"><Link className="bf-btn bf-btn-accent" href="/app">find your block</Link><Link className="bf-btn bf-btn-outline" href="/app">open the terminal</Link></div>
            </div>
            <aside className="bf-hero-machine" aria-label="Quantara system preview">
              <div className="bf-machine-top"><span><i /> BLOCK OS</span><b>online</b></div>
              <div className="bf-dot-orb" aria-hidden="true">
                {Array.from({ length: 96 }).map((_, index) => <i key={index} />)}
              </div>
              <div className="bf-command-card">
                <small>terminal command</small>
                <code>quantara / buy-block --size 5000</code>
              </div>
              <div className="bf-machine-rows">
                {systemRows.map((row) => <div key={row.key}><span>{row.key}</span><b>{row.value}</b></div>)}
              </div>
            </aside>
          </div>
        </div>
        <div className="bf-live-ticker" aria-label="Quantara platform status">
          <div className="bf-live-ticker-track">
            {[0, 1].map((copy) => <div className="bf-live-ticker-set" aria-hidden={copy === 1} key={copy}>
              <span><i /> BNB Chain connected</span><span>paper markets live</span><span>90% trader split</span><span>$10,000 treasury</span><span>on-chain verification</span>
            </div>)}
          </div>
        </div>
      </header>

      <section id="how" className="bf-section bf-flow-section"><div className="bf-wrap">
        <div className="bf-section-head bf-reveal"><span className="bf-kicker">Terminal flow</span><h2>Funded in three commands.</h2><p>The journey now reads like a live system: pick a Block, arm risk rules, pass the evaluation, then unlock the funded rail.</p></div>
        <div className="bf-terminal-flow bf-reveal">
          <div className="bf-flow-console">
            <div className="bf-console-bar"><span /><span /><span /><b>quantara://block-os</b></div>
            <div className="bf-console-lines">
              {flowCommands.map((line, index) => <div key={line.cmd} style={{ "--line": index } as CSSProperties}>
                <code><em>$</em> {line.cmd}</code>
                <small>{line.result}</small>
              </div>)}
            </div>
          </div>
          <div className="bf-flow-steps">
            <article><span>01</span><h3>Pick your Block</h3><p>Choose simulated capital from $1K to $5K and start with one flat fee.</p><small>~2 min · no seed phrase</small></article>
            <article><span>02</span><h3>Pass the evaluation</h3><p>Hit target before max loss. Real market feel, structured downside.</p><small>30 days · no daily limit</small></article>
            <article><span>03</span><h3>Unlock funded mode</h3><p>Activate the funded Block, follow rules, and qualify for crypto payouts.</p><small>90% split · treasury backed</small></article>
          </div>
        </div>
      </div></section>

      <section id="accounts" className="bf-section bf-marketplace-section"><div className="bf-wrap">
        <div className="bf-section-head bf-reveal"><span className="bf-kicker">Block marketplace</span><h2>Choose your <b>Block</b></h2><p>Each account now feels like a tradable object: target, max loss, split and entry price are visible before you launch.</p></div>
        <div className="bf-block-market bf-reveal">
          {tiers.map((tier, index) => <article className={tier.hot ? "hot" : ""} key={tier.size}>
            <div className="bf-block-card-top"><span>BLOCK {String(index + 1).padStart(2, "0")}</span>{tier.hot && <em>most popular</em>}</div>
            <strong>{tier.size}</strong>
            <p>{tier.note}</p>
            <div className="bf-block-bars">
              <div><span>Target</span><b>{tier.target}</b><i style={{ width: index === 0 ? "54%" : index === 1 ? "68%" : "82%" }} /></div>
              <div><span>Max loss</span><b>{tier.loss}</b><i style={{ width: index === 0 ? "42%" : index === 1 ? "58%" : "74%" }} /></div>
              <div><span>Split</span><b>{tier.split}</b><i style={{ width: "90%" }} /></div>
            </div>
            <Link className={`bf-btn ${tier.hot ? "bf-btn-accent" : "bf-btn-ghost"}`} href="/app">{tier.price}</Link>
          </article>)}
        </div>
        <p className="bf-tiers-note bf-reveal">Targets are high because the trenches are high · hit the target before your max loss and the account is yours. You get 30 days to pass an evaluation, and there are no daily limits. Funded Blocks have no clock.<br />A one-time <b>$50 lifetime activation fee</b> applies when your funded account is activated · never recurring. Consistent traders scale their Block to <b>$25k</b> after payouts.</p>
      </div></section>

      <section className="bf-section bf-simulator-section"><div className="bf-wrap">
        <div className="bf-section-head bf-reveal"><span className="bf-kicker">Live challenge simulator</span><h2>See the evaluation pressure.</h2><p>A compact dashboard shows the thing traders care about: target distance, max-loss safety, trading days, and whether the Block is clean.</p></div>
        <div className="bf-simulator bf-reveal">
          <div className="bf-sim-left">
            <div className="bf-sim-status"><span><i /> Day 07 / 30</span><b>No breach</b></div>
            <div className="bf-sim-balance"><small>Current equity</small><strong>$7,120</strong><span>+$2,120 toward target</span></div>
            <div className="bf-sim-chart" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div>
          </div>
          <div className="bf-sim-right">
            {simulatorStats.map((stat) => <article key={stat.label}><span>{stat.label}</span><b>{stat.value}</b><small>{stat.hint}</small></article>)}
            <div className="bf-sim-progress"><div><span>Target progress</span><b>42%</b></div><i /></div>
          </div>
        </div>
      </div></section>

      <section className="bf-section"><div className="bf-wrap">
        <div className="bf-section-head bf-reveal"><h2>Why traders switch</h2><p>Same $5,000 of buying power. Very different downside.</p></div>
        <div className="bf-compare bf-reveal">
          <article><h3>your own money</h3><p>$5,000 of your savings</p><ul><li className="no"><b>×</b>Every loss comes out of your pocket</li><li className="no"><b>×</b>One bad rug can wipe months of gains</li><li className="no"><b>×</b>Wallets, bridges, and gas to manage</li><li className="no"><b>×</b>No structure, no risk guardrails</li></ul></article>
          <article className="win"><h3>Quantara $5k block</h3><p>$5,000 account · $249 eval</p><ul><li className="yes"><b>✓</b>Max possible loss: the $249 fee</li><li className="yes"><b>✓</b>Keep 90% of the upside</li><li className="yes"><b>✓</b>Email login · zero wallet setup</li><li className="yes"><b>✓</b>Built-in risk rules keep you disciplined</li></ul></article>
        </div>
      </div></section>

      <section className="bf-section bf-system-section"><div className="bf-wrap">
        <div className="bf-section-head bf-reveal"><span className="bf-kicker">Quantara primitives</span><h2>More product, less empty landing.</h2><p>Every core promise is shown as a small working module, so the page feels like a live trading system instead of a static pitch deck.</p></div>
        <div className="bf-primitives bf-reveal">
          {primitives.map((primitive, index) => <article key={primitive.label} className={index === 0 ? "wide" : ""}>
            <div><span>{String(index + 1).padStart(2, "0")}</span><em>{primitive.status}</em></div>
            <h3>{primitive.label}</h3>
            <p>{primitive.desc}</p>
          </article>)}
        </div>
      </div></section>

      <section id="payouts" className="bf-section"><div className="bf-wrap">
        <div className="bf-section-head bf-reveal"><h2>Every payout is a public transaction</h2><p>We pay in crypto, which means every payout comes with an on-chain receipt anyone can verify. No screenshots, no trust-me · just the chain.</p></div>
        <div className="bf-payout-wall bf-ghost-wall bf-reveal">
          <div className="bf-payout-head"><span>trader</span><span>payout</span><span>network</span><span>receipt</span></div>
          {payoutGhosts.map((row) => <div className="bf-ghost-row" key={row.trader}><span>{row.trader}</span><b>{row.payout}</b><span>{row.network}</span><code>{row.receipt}</code></div>)}
          <div className="bf-payout-empty"><b>No public payouts yet · receipt slots are armed.</b><span>The first real funded payout will replace these ghost rows with a verifiable on-chain transaction. We keep it alive visually without inventing fake wins.</span></div>
        </div>
        <div className="bf-section-head bf-reveal treasury-head"><h2>Live <b>Treasury Funds</b></h2><p>Payouts are backed by USDC held in the treasury wallet. The balance below is visible and can be verified on-chain.</p></div>
        <div className="bf-treasury-grid bf-reveal" ref={treasuryRef} onPointerMove={moveTreasuryGlow}>
          <div className="bf-treasury">
            <div className="live"><i /> Live · USDC treasury</div>
            <div className="amount">${treasuryBalance.toLocaleString("en-US")}<span>USDC</span></div>
            <p>Connected to the Quantara USDC treasury · verifiable on-chain</p>
            <div className="wallet"><span>Wallet</span><b>QUANTARA_TREASURY_WALLET</b></div>
            <a className="bf-btn bf-btn-outline" href="#payouts">Verify on-chain ↗</a>
          </div>
          <aside className="bf-treasury-flow" aria-label="Treasury flow">
            <div className="bf-flow-heading"><div><small>LIVE SYSTEM</small><h3>Treasury flow</h3></div><span><i /> synced</span></div>
            <div className="bf-flow-map" aria-hidden="true">
              <span className="bf-flow-line line-a"><i /></span><span className="bf-flow-line line-b"><i /></span>
              <div className="bf-flow-node treasury"><small>TREASURY</small><b>$10K</b></div>
              <div className="bf-flow-node blocks"><small>ACTIVE BLOCKS</small><b>24</b></div>
              <div className="bf-flow-node payouts"><small>PAYOUT RAIL</small><b>READY</b></div>
            </div>
            <div className="bf-flow-stats"><span><small>Reserved</small><b>$2,400</b></span><span><small>Available</small><b>$7,600</b></span></div>
            <div className="bf-flow-activity"><div><span className="bf-activity-icon">↗</span><p><b>Demo payout queue</b><small>Simulation preview · no public payout yet</small></p><time>ready</time></div><div><span className="bf-activity-icon cyan">✓</span><p><b>BNB Chain sync</b><small>Treasury monitor is online</small></p><time>live</time></div></div>
            <div className="bf-mini-terminal" aria-label="Treasury monitor log">
              <div><span /> quantara.monitor</div>
              <code>reserve_check: pass · payout_wall: awaiting first receipt</code>
            </div>
          </aside>
        </div>
      </div></section>

      <div className="bf-final bf-launch-final"><div className="bf-glow" /><div className="bf-wrap">
        <div className="bf-launch-panel">
          <div className="bf-console-bar"><span /><span /><span /><b>launch.sequence</b></div>
          <code>quantara.launch()<i /></code>
          <div className="bf-launch-states"><span>market_feed: online</span><span>risk_engine: armed</span><span>treasury: synced</span></div>
          <p>your skill.<br /><b>your funded Block.</b></p>
          <Link className="bf-btn bf-btn-accent" href="/app">initialize block</Link>
        </div>
      </div></div>

      <footer className="bf-footer"><div className="bf-wrap">
        <div className="bf-footer-in"><Link className="bf-logo" href="#top"><span>quantara<span className="bf-cursor" /></span></Link><div><a href="#how">how it works</a><a href="#payouts">payouts</a><Link href="/rules">rules</Link><a href="#accounts">$quantara</a><Link href="/legal">terms</Link><Link href="/legal">privacy</Link></div></div>
        <p>Quantara provides access to simulated trading evaluations and funded simulated accounts. All trading occurs in a simulated environment using real market data. Quantara is not a broker-dealer, investment advisor, or exchange, and nothing on this site is financial advice. Trading involves substantial risk of loss. Evaluation fees are non-refundable except as described in our Terms.</p>
      </div></footer>

      <div className="bf-mobile-cta"><Link className="bf-btn bf-btn-accent" href="/app">get your block · from $99</Link></div>
    </main>
  );
}
