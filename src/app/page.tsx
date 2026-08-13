"use client";

import Link from "next/link";

const marketRows = [
  { pair: "BTC / USD", state: "Challenge pair", pnl: "+2.18%" },
  { pair: "ETH / USD", state: "Risk hedge", pnl: "+1.44%" },
  { pair: "SOL / USD", state: "Trench live", pnl: "+8.24%" },
  { pair: "ARB / USD", state: "Block watch", pnl: "-0.31%" },
];

const steps = [
  {
    num: "01",
    label: "Choose",
    title: "Pick a block",
    copy: "Select a simulated account size, review the rules, and start with every limit visible before you trade.",
  },
  {
    num: "02",
    label: "Trade",
    title: "Survive the trench",
    copy: "Trade crypto markets in a terminal-first arena while Quantara tracks profit target, daily loss, and drawdown.",
  },
  {
    num: "03",
    label: "Review",
    title: "Unlock the next arena",
    copy: "Hit the target without breaking the rules, submit the run, and move into a higher-pressure funded simulation.",
  },
];

const blocks = [
  { name: "Starter", copy: "Lower pressure for first evaluation runs.", split: "$25k", action: "Open" },
  { name: "Trench", copy: "The core Quantara challenge block.", split: "$100k", action: "Open" },
  { name: "Apex", copy: "Strict limits, bigger simulated scale.", split: "$250k", action: "Open" },
];

const tape = [
  "BTC +2.18%",
  "ETH +1.44%",
  "SOL +8.24%",
  "Target 6.8 / 8%",
  "Risk used 1.2 / 4%",
  "Block unlocked",
];

export default function Home() {
  return (
    <main className="qhome">
      <div className="qhome-scroll" />

      <header className="qhome-nav">
        <div className="qhome-wrap qhome-nav-in">
          <Link className="qhome-brand" href="/">
            <span className="qhome-mark">Q</span>
            <span>Quantara</span>
          </Link>

          <nav aria-label="Main navigation">
            <a href="#app">App</a>
            <span>//</span>
            <a href="#how">How it works</a>
            <span>//</span>
            <a href="#blocks">Blocks</a>
            <span>//</span>
            <a href="#ecosystem">Ecosystem</a>
          </nav>

          <div className="qhome-actions">
            <span className="qhome-live">Beta live</span>
            <Link className="qhome-ghost" href="/docs">Docs</Link>
            <Link className="qhome-primary" href="/app">Launch App</Link>
          </div>
        </div>
      </header>

      <section className="qhome-hero">
        <div className="qhome-hero-bg" />
        <div className="qhome-wrap qhome-hero-in">
          <div className="qhome-hero-copy">
            <p className="qhome-kicker">// QUANTARA</p>
            <h1>
              Trade the trenches,
              <br />
              not the noise.
            </h1>
            <p>
              The fast crypto challenge arena for traders who want clean blocks, visible risk,
              and a terminal that feels alive from the first click.
            </p>
          </div>
          <div className="qhome-corners" aria-hidden="true" />
          <a className="qhome-scroll-cue" href="#app">SCROLL TO DISCOVER</a>
        </div>
      </section>

      <section id="app" className="qhome-section qhome-wrap">
        <div className="qhome-section-head qhome-center">
          <p className="qhome-kicker">// THE APP</p>
          <h2>Every block, in one place.</h2>
          <p>
            Browse live challenge blocks, watch account pressure, paper trade the trenches,
            and start the next evaluation without leaving the Quantara terminal.
          </p>
        </div>

        <div className="qhome-demo">
          <div className="qhome-demo-screen">
            <div className="qhome-demo-top">
              <span>QUANTARA TERMINAL</span>
              <b>RECORDED IN-APP / CHOOSE - TRADE - REVIEW</b>
            </div>
            <div className="qhome-chart" aria-label="Market chart preview">
              <svg viewBox="0 0 900 280" preserveAspectRatio="none">
                <path d="M0 205 C90 130 142 226 230 150 S365 72 450 112 S588 232 672 90 S790 44 900 62" />
              </svg>
            </div>
            <div className="qhome-market-list">
              {marketRows.map((row) => (
                <article key={row.pair}>
                  <span>{row.pair}</span>
                  <small>{row.state}</small>
                  <b className={row.pnl.startsWith("-") ? "down" : ""}>{row.pnl}</b>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="qhome-section qhome-wrap">
        <div className="qhome-intro">
          <p className="qhome-kicker">// HOW IT WORKS</p>
          <h2>Choose. Trade. Unlock.</h2>
        </div>

        <div className="qhome-steps">
          {steps.map((step) => (
            <article className="qhome-step" key={step.num}>
              <i className="tl" />
              <i className="tr" />
              <i className="bl" />
              <i className="br" />
              <span>{step.num}</span>
              <div className="qhome-step-art">
                <b>{step.label}</b>
              </div>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="ecosystem" className="qhome-section qhome-eco">
        <div className="qhome-wrap qhome-eco-in">
          <div>
            <p className="qhome-kicker">// ECOSYSTEM</p>
            <h2>Built for the world you already trade in.</h2>
          </div>
          <p>
            Quantara does not pretend to be a new chain or a fake exchange. It wraps familiar
            crypto-market behavior into a prop-style simulation: wallet login, live pairs,
            transparent limits, journaled trades, and reviewable challenge history.
          </p>
        </div>
      </section>

      <section id="blocks" className="qhome-section qhome-wrap">
        <div className="qhome-section-head">
          <div>
            <p className="qhome-kicker">// BLOCKS</p>
            <h2>The Quantara challenge blocks.</h2>
          </div>
          <p>
            Pick the lane that matches your discipline. Every block uses the same simple idea:
            grow the account without breaking visible risk.
          </p>
        </div>

        <div className="qhome-blocks">
          {blocks.map((block) => (
            <article key={block.name}>
              <span>{block.name}</span>
              <p>{block.copy}</p>
              <strong>{block.split}</strong>
              <Link href="/app">{block.action}</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="qhome-section qhome-wrap">
        <div className="qhome-section-head">
          <div>
            <p className="qhome-kicker">// WHY QUANTARA</p>
            <h2>Real rules, clean pressure.</h2>
          </div>
          <p>
            The promise is intentionally simple: no fog, no maze, no oversized marketing layer.
            The interface shows the rule, the trade, the breach, and the review state.
          </p>
        </div>

        <div className="qhome-why">
          <article>
            <span>[ 01 ]</span>
            <h3>Risk before hype</h3>
            <p>Daily loss, drawdown, and target are visible before a trader opens the first position.</p>
          </article>
          <article>
            <span>[ 02 ]</span>
            <h3>Terminal-first</h3>
            <p>The product should feel like a place to trade, not a generic landing page about trading.</p>
          </article>
          <article>
            <span>[ 03 ]</span>
            <h3>Reviewable runs</h3>
            <p>Challenge history, account state, and unlock progress stay readable from app to payout review.</p>
          </article>
        </div>
      </section>

      <div className="qhome-tape">
        <div>
          {[...tape, ...tape, ...tape].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>

      <section className="qhome-community">
        <div className="qhome-wrap">
          <p>[ ENTER THE ARENA ]</p>
          <h2>Start a block. Trade the trench. Prove the run.</h2>
          <div>
            <Link className="qhome-primary" href="/app">Launch App</Link>
            <Link className="qhome-ghost" href="/docs">Read Docs</Link>
          </div>
        </div>
      </section>

      <footer className="qhome-footer">
        <div className="qhome-wrap">
          <Link className="qhome-brand" href="/">
            <span className="qhome-mark">Q</span>
            <span>Quantara</span>
          </Link>
          <nav>
            <Link href="/app">App</Link>
            <a href="#how">How it works</a>
            <a href="#blocks">Blocks</a>
            <Link href="/legal">Terms</Link>
            <Link href="/rules">Rules</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
