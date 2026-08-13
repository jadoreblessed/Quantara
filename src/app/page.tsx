"use client";

import Link from "next/link";
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

      <section id="how" className="bf-section"><div className="bf-wrap">
        <div className="bf-section-head bf-reveal"><h2>Funded in three steps</h2><p>No jargon, no fine-print traps. This is the whole journey.</p></div>
        <div className="bf-steps bf-reveal">
          <article><span>01</span><h3>Pick your Block</h3><p>Choose a Block from $1K to $5K in simulated capital and pay a one-time fee. The fee is all you risk on that Block · optional paid resets exist if you blow it and want the same Block restored.</p><small>~2 min · connect a wallet, add email if you like</small></article>
          <article><span>02</span><h3>Pass the evaluation</h3><p>Double down or trade smart · hit your profit target before your max loss runs out. You trade live memecoin markets with real on-chain execution: real slippage, real fees.</p><small>30 days to pass · no daily limit</small></article>
          <article><span>03</span><h3>Get a funded block &amp; paid out</h3><p>After passing your evaluation without breaches, activate it into a funded Block · then follow the funded rules and trade on it to get payouts.</p><small>paid in crypto · no KYC, ever</small></article>
        </div>
      </div></section>

      <section id="accounts" className="bf-section"><div className="bf-wrap">
        <div className="bf-section-head bf-reveal"><h2>Choose your <b>Block</b></h2><p>Every account is a Block. Buy one, beat it, stack the next. One flat fee · no monthly charges. Optional paid resets are priced by how much max loss you used, always shown before you pay.</p></div>
        <div className="bf-tiers bf-reveal">
          <div className="bf-tier-row head"><span>block</span><span>profit target</span><span>max loss</span><span>split</span><span /></div>
          {tiers.map((tier) => <div className={`bf-tier-row ${tier.hot ? "hot" : ""}`} key={tier.size}><span className="size">{tier.size}<small>{tier.note}</small></span><span className="cell" data-label="profit target">{tier.target}</span><span className="cell" data-label="max loss">{tier.loss}</span><span className="cell highlight" data-label="split">{tier.split}</span><span className="buy"><Link className={`bf-btn ${tier.hot ? "bf-btn-accent" : "bf-btn-ghost"}`} href="/app">{tier.price}</Link></span></div>)}
        </div>
        <p className="bf-tiers-note bf-reveal">Targets are high because the trenches are high · hit the target before your max loss and the account is yours. You get 30 days to pass an evaluation, and there are no daily limits. Funded Blocks have no clock.<br />A one-time <b>$50 lifetime activation fee</b> applies when your funded account is activated · never recurring. Consistent traders scale their Block to <b>$25k</b> after payouts.</p>
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
        <div className="bf-payout-wall bf-reveal"><div className="bf-payout-head"><span>trader</span><span>payout</span><span>network</span><span>receipt</span></div><div className="bf-payout-empty"><b>No payouts yet · but funded Blocks are active.</b><span>The moment the first funded trader gets paid, their transaction hash appears here and you can verify it on-chain yourself. We would rather show an empty wall than invent one.</span></div></div>
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

      <div className="bf-final"><div className="bf-glow" /><div className="bf-wrap"><p>your skill.<br /><b>your funded Block.</b></p><Link className="bf-btn bf-btn-accent" href="/app">get your block</Link></div></div>

      <footer className="bf-footer"><div className="bf-wrap">
        <div className="bf-footer-in"><Link className="bf-logo" href="#top"><span>quantara<span className="bf-cursor" /></span></Link><div><a href="#how">how it works</a><a href="#payouts">payouts</a><Link href="/rules">rules</Link><a href="#accounts">$quantara</a><Link href="/legal">terms</Link><Link href="/legal">privacy</Link></div></div>
        <p>Quantara provides access to simulated trading evaluations and funded simulated accounts. All trading occurs in a simulated environment using real market data. Quantara is not a broker-dealer, investment advisor, or exchange, and nothing on this site is financial advice. Trading involves substantial risk of loss. Evaluation fees are non-refundable except as described in our Terms.</p>
      </div></footer>

      <div className="bf-mobile-cta"><Link className="bf-btn bf-btn-accent" href="/app">get your block · from $99</Link></div>
    </main>
  );
}
