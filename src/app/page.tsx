"use client";

import Link from "next/link";
import { useState } from "react";

const plans = [
  { capital: "$1,000", target: "$2,000", loss: "$800", fee: "$99" },
  { capital: "$3,000", target: "$3,000", loss: "$2,400", fee: "$179", popular: true },
  { capital: "$5,000", target: "$5,000", loss: "$4,000", fee: "$249" },
];

export default function Home() {
  const [menu, setMenu] = useState(false);
  return <main>
    <div className="announcement">QUANTARA PRIVATE BETA — EARLY ACCESS IS OPEN <button aria-label="Dismiss">×</button></div>
    <nav className="nav shell"><Link className="brand" href="/"><span>Q</span>QUANTARA_</Link><button className="menu" onClick={()=>setMenu(!menu)}>MENU</button><div className={menu?"navlinks open":"navlinks"}><a href="#how">HOW IT WORKS</a><a href="#plans">CHALLENGES</a><Link href="/rules">RULES</Link><Link href="/docs">DOCS</Link></div><Link className="button small" href="/terminal">LAUNCH APP ↗</Link></nav>
    <section className="hero shell">
      <div className="hero-tags"><span>UP TO $5K SIMULATED CAPITAL</span><span>90% REWARD SPLIT</span></div>
      <h1>PROVE YOUR EDGE<br/><em>IN THE WILD.</em></h1>
      <p>Pass one transparent trading challenge using live market data. Keep your risk controlled, reach the target, and qualify for Quantara’s funded simulation.</p>
      <div className="actions"><Link className="button lime" href="/challenges">CHOOSE A CHALLENGE →</Link><Link className="button ghost" href="/terminal">TRY THE TERMINAL</Link></div>
      <small>{"// simulated execution · real market data · no custody of trader funds"}</small>
      <div className="ticker"><b><i></i> MARKET FEED LIVE</b><span>SOL / USD <strong>$182.46</strong> <em>+4.18%</em></span><span>ETH / USD <strong>$4,224.18</strong> <em>+2.07%</em></span><span>BTC / USD <strong>$117,840</strong> <em>+1.32%</em></span></div>
    </section>
    <section id="how" className="section dark"><div className="shell"><p className="kicker">{"// THE PROCESS"}</p><div className="sectionhead"><h2>FUNDED IN<br/><em>THREE MOVES.</em></h2><p>No vague criteria and no hidden daily limit. Your full route from selection to qualification is visible before you start.</p></div><div className="steps">{[
      ["01","PICK YOUR CHALLENGE","Choose $1K, $3K, or $5K in simulated capital and pay one flat evaluation fee.","~2 MIN · EMAIL ACCOUNT"],
      ["02","TRADE THE MARKET","Open simulated positions against live prices with modeled slippage, fees, and liquidity.","30 DAYS · NO DAILY LIMIT"],
      ["03","QUALIFY & SCALE","Reach the profit target without breaching max loss, then enter the funded simulation.","90% REWARD SPLIT"],
    ].map(x=><article key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p><small>{x[3]}</small></article>)}</div></div></section>
    <section id="plans" className="section plans shell"><p className="kicker">{"// CHOOSE YOUR LEVEL"}</p><div className="sectionhead"><h2>ONE FEE.<br/><em>YOUR ARENA.</em></h2><p>Each challenge uses the same transparent rule engine. Select the amount of virtual buying power that matches your style.</p></div><div className="plan-grid">{plans.map(p=><article className={p.popular?"plan popular":"plan"} key={p.capital}>{p.popular&&<b className="badge">MOST POPULAR</b>}<small>SIMULATED ACCOUNT</small><h3>{p.capital}</h3><dl><div><dt>PROFIT TARGET</dt><dd>{p.target}</dd></div><div><dt>MAX LOSS</dt><dd>{p.loss}</dd></div><div><dt>REWARD SPLIT</dt><dd>90%</dd></div></dl><Link href={`/challenges?plan=${p.capital.replace(/\D/g,"")}`}>{p.fee} · START →</Link></article>)}</div><p className="fine">30 days to pass. No daily loss rule. Optional reset pricing is always shown before purchase. Challenge trading is simulated.</p></section>
    <section className="section compare"><div className="shell"><p className="kicker">{"// CONTROL THE DOWNSIDE"}</p><h2>SAME EXPOSURE.<br/><em>DIFFERENT RISK.</em></h2><div className="compare-grid"><article><small>TRADING YOUR OWN CAPITAL</small><h3>$5,000 AT RISK</h3><ul><li>Every loss leaves your wallet</li><li>Wallets, gas and bridges to manage</li><li>No automatic risk guardrails</li><li>Emotion decides when to stop</li></ul></article><article className="highlight"><small>QUANTARA $5K CHALLENGE</small><h3>$249 MAXIMUM COST</h3><ul><li>Your challenge fee is your only cost</li><li>Live-price simulated execution</li><li>Built-in maximum-loss controls</li><li>Keep 90% of eligible rewards</li></ul></article></div></div></section>
    <section className="section payouts shell"><p className="kicker">{"// TRANSPARENCY FIRST"}</p><div className="sectionhead"><h2>EVERY REWARD.<br/><em>VERIFIABLE.</em></h2><p>If Quantara begins issuing crypto rewards, every completed payout will be listed with its public transaction receipt. Until then, we show the honest state.</p></div><div className="empty"><span>TRADER</span><span>REWARD</span><span>NETWORK</span><span>RECEIPT</span><p>No payouts yet — Quantara is currently in private beta.</p></div></section>
    <section className="cta"><p>YOUR PROCESS. YOUR EDGE.</p><h2>READY TO PROVE IT?</h2><Link className="button lime" href="/challenges">GET YOUR CHALLENGE →</Link></section>
    <footer className="shell"><Link className="brand" href="/"><span>Q</span>QUANTARA_</Link><div><Link href="/rules">RULES</Link><Link href="/docs">DOCS</Link><Link href="/legal">TERMS & PRIVACY</Link></div><small>© 2026 QUANTARA · SIMULATED TRADING ONLY</small></footer>
  </main>
}
