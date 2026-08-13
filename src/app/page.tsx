"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

const steps = [
  { number: "[ 01 ]", label: "choose", title: "Choose a block", copy: "Pick an evaluation size and review every target, daily-loss limit, and drawdown rule before the run starts." },
  { number: "[ 02 ]", label: "trade", title: "Trade the market", copy: "Enter the terminal, trade live crypto pairs in simulation, and keep every position inside the visible risk rules." },
  { number: "[ 03 ]", label: "unlock", title: "Unlock the next level", copy: "Reach the target without a breach, submit the run for review, and move into the next Quantara arena." },
];

const blocks = [
  { mark: "25", name: "Starter Block", meta: "$25K simulated equity", target: "8%" },
  { mark: "100", name: "Trench Block", meta: "$100K simulated equity", target: "8%" },
  { mark: "250", name: "Apex Block", meta: "$250K simulated equity", target: "10%" },
];

const benefits = [
  { number: "[ 01 ]", mark: "R", title: "Rules before hype", copy: "Targets, daily loss, and maximum drawdown stay visible before and during every evaluation." },
  { number: "[ 02 ]", mark: "T", title: "Terminal-first", copy: "Quantara feels like a place to trade, with positions, market pressure, and account state always in view." },
  { number: "[ 03 ]", mark: "V", title: "Verifiable runs", copy: "Every trade, breach, target, and review state remains readable from the first order to the final result." },
];

const marketLeft = [["BTC / USD", "$126.4K", "+18.8%"], ["SOL / USD", "$94.8K", "+42.1%"], ["ETH / USD", "$71.2K", "-6.4%"], ["ARB / USD", "$38.6K", "+12.7%"], ["LINK / USD", "$26.1K", "+9.3%"]];
const marketRight = [["DOGE / USD", "$102.7K", "+31.4%"], ["AVAX / USD", "$82.3K", "-8.2%"], ["SUI / USD", "$64.9K", "+24.6%"], ["BNB / USD", "$44.8K", "+4.1%"], ["OP / USD", "$29.4K", "-3.6%"]];

function Arrow() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

function XIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.24 2.25h3.31l-7.23 8.26 8.51 11.24h-6.66l-5.22-6.82-5.96 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" /></svg>;
}

function Button({ href, children, ghost = false }: { href: string; children: ReactNode; ghost?: boolean }) {
  return <Link className={`rf-btn ${ghost ? "rf-btn-ghost" : "rf-btn-primary"}`} href={href}><span className="rf-btn-label">{children}</span>{!ghost && <span className="rf-btn-arrow"><Arrow /></span>}</Link>;
}

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setSlide((value) => (value + 1) % 3), 2600);
    const update = () => {
      setScrolled(window.scrollY > 8);
      setPastHero(window.scrollY > window.innerHeight * 0.78);
      const root = document.querySelector<HTMLElement>(".rf-home");
      const height = document.documentElement.scrollHeight - window.innerHeight;
      root?.style.setProperty("--rf-progress", `${height > 0 ? (window.scrollY / height) * 100 : 0}%`);
    };
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll(".rf-reveal").forEach((element) => observer.observe(element));
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => { window.clearInterval(timer); window.removeEventListener("scroll", update); observer.disconnect(); };
  }, []);

  return (
    <main className="rf-home">
      <div className="rf-progress" />
      <nav className={`rf-nav ${scrolled ? "is-scrolled" : ""} ${pastHero ? "is-green" : ""}`}>
        <div className="rf-wrap rf-nav-in">
          <Link className="rf-brand" href="#top"><span className="rf-logo">Q</span><span className="rf-brand-name">Quantara</span><span className="rf-beta">Beta</span></Link>
          <div className="rf-nav-links"><a href="#demo">App</a><span>//</span><a href="#how">How it works</a><span>//</span><a href="#ecosystem">Ecosystem</a><span>//</span><a href="#blocks">Blocks</a></div>
          <div className="rf-nav-actions"><a className="rf-nav-icon" href="https://x.com" aria-label="Quantara on X"><XIcon /></a><Button href="/docs" ghost>Docs</Button><Button href="/app">Launch App</Button></div>
        </div>
      </nav>

      <header className="rf-hero" id="top">
        <video className="rf-hero-video" muted loop playsInline autoPlay poster="https://frogscan-web.vercel.app/assets/hero-poster.jpg"><source src="https://frogscan-web.vercel.app/assets/hero.mp4" type="video/mp4" /></video>
        <div className="rf-hero-tone" /><div className="rf-hero-scrim" /><div className="rf-hero-fade" />
        <div className="rf-wrap rf-hero-inner"><div className="rf-hero-slides">
          <div className={`rf-hero-slide ${slide === 0 ? "is-active" : ""}`}><span>Trade the trenches,</span><span>not the <b>noise</b></span></div>
          <div className={`rf-hero-slide ${slide === 1 ? "is-active" : ""}`}><span>Choose, trade and</span><span>prove <b>every run</b></span></div>
          <div className={`rf-hero-slide ${slide === 2 ? "is-active" : ""}`}><span><b>Unlock</b> your block</span><span>in the arena</span></div>
        </div></div>
        <div className="rf-hero-corners"><div className="rf-hero-note"><div>// Quantara</div><p>A fast crypto challenge arena with clean evaluation blocks, visible risk rules, and a terminal built for disciplined traders.</p></div><div className="rf-scroll">Scroll to discover <span>v</span></div></div>
      </header>

      <section className="rf-section rf-demo" id="demo"><div className="rf-wrap">
        <div className="rf-section-head rf-center rf-reveal"><span className="rf-eyebrow">// The app</span><h2>Every trade, in one place.</h2><p>Watch live pairs, open simulated positions, track challenge pressure, and review account progress inside one terminal.</p></div>
        <div className="rf-video-frame rf-reveal"><div className="rf-app-preview"><iframe src="/app" title="Quantara app preview" tabIndex={-1} /><div className="rf-preview-shield" /></div></div>
        <div className="rf-video-caption">Recorded in-app / choose - trade - unlock</div>
      </div></section>

      <section className="rf-section" id="how"><div className="rf-wrap">
        <div className="rf-how-intro"><div className="rf-reveal"><span className="rf-eyebrow">// How it works</span><h2>Choose. Trade. Unlock.</h2></div><div className="rf-reveal"><p>Quantara turns a crypto evaluation into one simple loop. Choose a block, trade the market without breaking the visible limits, and unlock the next arena.</p></div></div>
        <div className="rf-steps">{steps.map((step, index) => <article className="rf-step rf-reveal" style={{ "--rf-delay": `${index * 70}ms` } as CSSProperties} key={step.number}><i className="tl" /><i className="tr" /><i className="bl" /><i className="br" /><span className="rf-step-num">{step.number}</span><div className="rf-step-art"><div className={`rf-mini-terminal state-${index}`}><span>{step.label}</span><div /><div /><div /></div></div><h3>{step.title}</h3><p>{step.copy}</p></article>)}</div>
      </div></section>

      <section className="rf-section rf-ecosystem" id="ecosystem"><div className="rf-wrap rf-eco-grid">
        <div className="rf-eco-copy rf-reveal"><span className="rf-eyebrow">// Ecosystem</span><h2>Built for the market you already trade in</h2><p>Quantara wraps familiar crypto rails into a focused evaluation experience: real pairs, wallet access, transparent limits, journaled positions, and reviewable challenge history.</p></div>
        <div className="rf-eco-cells">{["Solana", "Ethereum", "BNB Chain", "Base", "Phantom", "MetaMask", "TradingView", "Quantara"].map((name, index) => <div className="rf-eco-cell rf-reveal" style={{ "--rf-delay": `${index * 60}ms` } as CSSProperties} key={name}><span>{name}</span></div>)}</div>
      </div></section>

      <section className="rf-section" id="blocks"><div className="rf-wrap">
        <div className="rf-section-head rf-center rf-reveal"><span className="rf-eyebrow">// Blocks</span><h2>The Quantara challenge blocks</h2><p>Choose the pressure level that matches your discipline, then grow the simulated account without breaking its risk rules.</p></div>
        <div className="rf-launch rf-reveal"><div className="rf-orbit" aria-hidden="true"><div className="rf-sweep" /><div className="rf-ring" /><div className="rf-ring second" /><div className="rf-core">Q</div><div className="rf-satellite one"><b>25</b></div><div className="rf-satellite two"><b>100</b></div><div className="rf-satellite three"><b>250</b></div></div><div className="rf-block-list"><div className="rf-list-head"><b>Challenge blocks</b><span><i /> Live</span></div>{blocks.map((block) => <article className="rf-block-row" key={block.name}><span className="rf-block-mark">{block.mark}</span><span><b>{block.name}</b><small>{block.meta}</small></span><span className="rf-block-stat"><b>{block.target}</b><small>Target</small></span><Link href="/app">Start</Link></article>)}</div></div>
        <div className="rf-center-button rf-reveal"><Button href="/app">Launch the app</Button></div>
      </div></section>

      <section className="rf-section"><div className="rf-wrap">
        <div className="rf-section-head rf-center rf-reveal"><span className="rf-eyebrow">// Why Quantara</span><h2>Real rules, clean pressure</h2><p>The account state stays readable, the limits stay visible, and every result comes from the trades inside the run.</p></div>
        <div className="rf-steps rf-benefits">{benefits.map((benefit) => <article className="rf-step rf-reveal" key={benefit.number}><i className="tl" /><i className="tr" /><i className="bl" /><i className="br" /><span className="rf-step-num">{benefit.number}</span><div className="rf-benefit-art"><span>{benefit.mark}</span></div><h3>{benefit.title}</h3><p>{benefit.copy}</p></article>)}</div>
      </div></section>

      <section className="rf-community" id="community"><div className="rf-community-track">
        <div className="rf-market-column left">{marketLeft.map(([pair, volume, change]) => <div className="rf-market-card" key={pair}><span>{pair.charAt(0)}</span><div><b>{pair}</b><small>{volume}</small></div><strong className={change.startsWith("-") ? "down" : ""}>{change}</strong></div>)}</div>
        <div className="rf-market-column right">{marketRight.map(([pair, volume, change]) => <div className="rf-market-card" key={pair}><span>{pair.charAt(0)}</span><div><b>{pair}</b><small>{volume}</small></div><strong className={change.startsWith("-") ? "down" : ""}>{change}</strong></div>)}</div>
        <div className="rf-community-copy rf-reveal"><span className="rf-eyebrow">[ Enter the arena ]</span><h2>Choose a block and trade on Quantara.</h2><p>Open the terminal, start an evaluation, and prove the run with every target and risk limit visible.</p><div><Button href="/app">Launch App</Button><Button href="/docs" ghost>Read Docs</Button></div></div>
      </div></section>

      <footer className="rf-footer"><div className="rf-wrap">
        <div className="rf-footer-top"><h2>The crypto challenge arena.</h2><div className="rf-footer-links"><a href="#blocks">Blocks</a><a href="https://x.com">X / Twitter</a><a href="#demo">The app</a><a href="#community">Community</a><a href="#how">How it works</a><Link href="/app">Launch App</Link><a href="#ecosystem">Ecosystem</a><Link href="/docs">Docs</Link></div></div>
        <div className="rf-footer-bottom"><div className="rf-footer-brand"><span>Q</span>Quantara</div><div>© Quantara 2026<br /><a href="#">Terms</a> // <a href="#">Privacy</a></div></div>
        <p className="rf-disclaimer">Quantara is a simulated crypto evaluation platform. Trading involves market risk. Nothing on this site is financial advice.</p>
      </div></footer>
    </main>
  );
}
