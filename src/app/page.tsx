"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const feed = ["BTC +2.18%", "ETH +1.44%", "SOL +8.24%", "Challenge passed", "Block unlocked"];

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
      <header className="site-header-wrap">
        <div className={compact ? "site-header is-compact" : "site-header"}>
          <Link className="q-brand" href="/">
            <span className="q-mark">Q</span>
            <span>
              Quantara
              <small>Market is live</small>
            </span>
          </Link>
          <nav className="site-nav" aria-label="Main navigation">
            <a href="#terminal">Terminal</a>
            <a href="#blocks">Blocks</a>
            <a href="#rules">Rules</a>
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
        <div className="hero-grid">
          <div>
            <div className="eyebrow"><span className="live-dot" /> V5 full preview, fresh file</div>
            <h1>Trade the <span className="accent">trenches</span>, not the noise.</h1>
            <p className="lead">
              Quantara is a prop-style crypto arena with clean challenge blocks, transparent risk rules,
              and a terminal-first experience.
            </p>
            <div className="hero-tags" aria-label="Hero actions">
              <Link className="hero-tag primary" href="/app?flow=block">Choose your block</Link>
              <a className="hero-tag secondary" href="#terminal">Trade the trenches</a>
            </div>
          </div>

          <div className="terminal-wrap" id="terminal" aria-label="Quantara terminal preview">
            <div className="float-card">
              <b>SOL / USD</b>
              <span>+8.24%</span>
              <small>visible floating banner</small>
            </div>
            <div className="terminal">
              <div className="terminal-inner">
                <div className="terminal-bar">
                  <span>Quantara terminal</span>
                  <span>Live</span>
                </div>
                <div className="chart">
                  <svg viewBox="0 0 520 230" preserveAspectRatio="none" role="img" aria-label="Animated market line">
                    <path d="M0 168 C55 122 78 194 130 144 S216 92 260 116 S340 186 386 106 S462 68 520 32" />
                  </svg>
                </div>
                <div className="trade-row">
                  <div className="tile">Equity<strong>$100,000</strong></div>
                  <div className="tile">Daily PnL<strong className="positive">+$2,840</strong></div>
                  <div className="tile">Drawdown<strong>3.1%</strong></div>
                </div>
                <div className="trade-row">
                  <div className="tile">BTC Long<strong>2.4x</strong></div>
                  <div className="tile">ETH Short<strong className="negative">-0.8%</strong></div>
                  <div className="tile">Risk left<strong>71%</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="feed">
        <div className="feed-track">
          {[...feed, ...feed].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>

      <section id="blocks" className="section shell">
        <div className="section-head">
          <div>
            <span className="section-kicker">Challenge blocks</span>
            <h2 className="section-title">Choose your block.</h2>
          </div>
          <p className="section-copy">Three account styles, one clean rule set. Pick the size and pressure level, then prove you can stay alive when the market starts pushing back.</p>
        </div>
        <div className="blocks">
          <article className="block"><span>01</span><h3>Starter Block</h3><p>Lower risk, cleaner targets, quick entry for first challenge traders.</p><strong>$25k simulated equity</strong></article>
          <article className="block"><span>02</span><h3>Trench Block</h3><p>Higher intensity, tighter discipline, bigger upside for consistent execution.</p><strong>$100k simulated equity</strong></article>
          <article className="block"><span>03</span><h3>Apex Block</h3><p>Top-tier funded environment with strict rules and premium account scale.</p><strong>$250k simulated equity</strong></article>
        </div>
      </section>

      <section id="rules" className="section shell">
        <div className="section-head">
          <div>
            <span className="section-kicker">Trade the trenches</span>
            <h2 className="section-title">The arena reacts while you trade.</h2>
          </div>
          <p className="section-copy">The lower part of the site should feel like product, not brochure. These panels show live positions, breaches, targets, and payout state with small motion.</p>
        </div>
        <div className="trenches">
          <div className="signal-panel">
            <div className="signal-inner">
              <div className="signal-row"><span className="orb" /><div><small>BTC position</small><strong>Long 2.4x</strong></div><b>+1.82%</b></div>
              <div className="signal-row"><span className="orb" /><div><small>ETH hedge</small><strong>Short 1.1x</strong></div><b className="negative">-0.34%</b></div>
              <div className="signal-row"><span className="orb" /><div><small>Daily loss used</small><strong>1.2% / 4%</strong></div><b>Safe</b></div>
              <div className="signal-row"><span className="orb" /><div><small>Profit target</small><strong>6.8% / 8%</strong></div><b>Near</b></div>
              <div className="chart small-chart">
                <svg viewBox="0 0 520 150" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0 118 C58 90 82 116 128 72 S210 38 260 66 S340 122 394 54 S462 22 520 36" />
                </svg>
              </div>
            </div>
          </div>
          <div className="rule-stack">
            <article className="rule-item"><span className="rule-num">1</span><div><h3>Targets before hype</h3><p>Profit target, max daily loss, and max drawdown are visible before a block starts.</p></div></article>
            <article className="rule-item"><span className="rule-num">2</span><div><h3>Breach states are obvious</h3><p>If the account breaks a rule, the interface should show what happened without hiding behind vague copy.</p></div></article>
            <article className="rule-item"><span className="rule-num">3</span><div><h3>Manual payout review</h3><p>No fake instant promises. Rewards stay honest: simulated trading first, review and approval after.</p></div></article>
            <article className="rule-item"><span className="rule-num">4</span><div><h3>Crypto-native pacing</h3><p>Market tape, positions, account pressure, and challenge progress stay alive while the user scrolls.</p></div></article>
          </div>
        </div>
      </section>

      <section className="section shell">
        <div className="payout-grid">
          <div className="payout-panel">
            <span className="section-kicker">Funded simulation</span>
            <h2 className="section-title payout-title">Built for traders who can survive pressure.</h2>
            <p className="section-copy payout-copy">Quantara can present the whole loop clearly: choose a block, trade simulated crypto markets, respect risk limits, submit for review, then unlock the next arena.</p>
          </div>
          <div className="payout-panel">
            <span className="section-kicker">Live account feel</span>
            <div className="stat-grid">
              <div className="stat"><span>Pass target</span><b>8%</b></div>
              <div className="stat"><span>Daily max loss</span><b>4%</b></div>
              <div className="stat"><span>Reward split</span><b>80%</b></div>
              <div className="stat"><span>Review window</span><b>24h</b></div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="section faq shell">
        <div className="section-head">
          <div>
            <span className="section-kicker">Questions</span>
            <h2 className="section-title">No fog, no maze.</h2>
          </div>
          <p className="section-copy">These are placeholder FAQ cards for the design preview. If you approve the direction, I will wire this into the real Quantara pages and replace copy with final product text.</p>
        </div>
        <div className="faq-grid">
          <article className="faq-card"><h3>Is this real trading?</h3><p>The preview positions Quantara as simulated evaluation first, so promises stay clean and believable.</p></article>
          <article className="faq-card"><h3>Why this structure?</h3><p>The page only points to sections that exist in the current concept: terminal, blocks, rules, and FAQ.</p></article>
          <article className="faq-card"><h3>What happens next?</h3><p>After approval, this visual system moves into the real app with responsive layout and production styling.</p></article>
        </div>
      </section>

      <footer className="footer shell">
        <div className="footer-inner">
          <strong>Quantara</strong>
          <span>Prop-style crypto challenge arena · visual preview</span>
        </div>
      </footer>
    </main>
  );
}
