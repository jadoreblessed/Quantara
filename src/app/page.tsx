"use client";

import { useState } from "react";

const plans = [
  { name: "Starter", balance: "$5,000", target: "$500", fee: "$69" },
  { name: "Core", balance: "$15,000", target: "$1,500", fee: "$149" },
  { name: "Scale", balance: "$50,000", target: "$5,000", fee: "$299" },
];

export default function Home() {
  const [activePlan, setActivePlan] = useState(1);
  const [notice, setNotice] = useState("");

  const start = () => setNotice("Early access is opening soon. Your spot is reserved.");

  return (
    <main>
      <nav className="nav shell">
        <a className="brand" href="#top" aria-label="Quantara home"><span>Q</span> Quantara</a>
        <div className="nav-links"><a href="#how">How it works</a><a href="#plans">Plans</a><a href="#rules">Rules</a></div>
        <button className="nav-cta" onClick={start}>Join early access <i>↗</i></button>
      </nav>

      <section className="hero shell" id="top">
        <div className="eyebrow"><b></b> Paper trading. Real standards.</div>
        <h1>Prove your edge.<br /><em>Trade your future.</em></h1>
        <p className="hero-copy">Quantara is a market-accurate trading challenge built for disciplined traders. Trade a simulated account, meet clear rules, earn your place.</p>
        <div className="hero-actions">
          <button className="primary" onClick={start}>Start a challenge <span>→</span></button>
          <a className="text-link" href="#how">Explore the platform <span>↓</span></a>
        </div>
        {notice && <p className="notice" role="status">{notice}</p>}
        <div className="market-strip" aria-label="Market status">
          <span className="pulse"></span><strong>Market simulation live</strong><span className="divider"></span><span>ETH/USD</span><b>$4,812.42</b><small className="positive">+2.38%</small><span className="divider"></span><span>Solana</span><b>$212.03</b><small className="positive">+4.12%</small>
        </div>
      </section>

      <section className="terminal-wrap shell" aria-label="Quantara trading terminal preview">
        <div className="terminal-head"><div className="dots"><i></i><i></i><i></i></div><span>Quantara Terminal</span><small>Simulated account · QNT-4892</small></div>
        <div className="terminal">
          <aside><div className="terminal-logo">Q</div><a className="active">⌁</a><a>◫</a><a>◌</a><a>◧</a><a>⚙</a></aside>
          <div className="chart-area">
            <div className="chart-head"><div><small>ETH / USD</small><strong>$4,812.42 <b className="positive">+2.38%</b></strong></div><div className="chart-tabs"><b>1H</b><span>4H</span><span>1D</span><span>1W</span></div></div>
            <div className="chart"><div className="line"></div><div className="price-tag">4,812.42</div><div className="axis">4,900<br/>4,750<br/>4,600<br/>4,450</div><div className="chart-labels"><span>10:00</span><span>12:00</span><span>14:00</span><span>16:00</span></div></div>
          </div>
          <div className="account-panel"><small>AVAILABLE BALANCE</small><h3>$15,428.60</h3><div className="upnl"><span>Unrealized P&amp;L</span><b>+$428.60</b></div><div className="risk"><div><span>Daily loss limit</span><b>$1,500</b></div><progress value="18" max="100"></progress><small>18% used</small></div><button>Buy ETH <span>↗</span></button><button className="sell">Sell ETH <span>↘</span></button></div>
        </div>
      </section>

      <section className="numbers shell"><div><b>01</b><span>clear challenge<br/>rules</span></div><div><b>24/7</b><span>simulated market<br/>access</span></div><div><b>100%</b><span>your trading<br/>performance</span></div><div><b>0</b><span>hidden rules<br/>or guesswork</span></div></section>

      <section className="how shell" id="how"><div className="section-kicker">THE QUANTARA PATH</div><div className="section-intro"><h2>Built around<br /><em>your process.</em></h2><p>A straightforward path from first trade to proven consistency. No complicated stages. No hidden criteria.</p></div><div className="steps"><article><span>01</span><h3>Choose your account</h3><p>Select a simulated balance that fits your trading style. One clear fee, transparent rules.</p></article><article><span>02</span><h3>Trade the challenge</h3><p>Execute in a realistic simulation with live market data, fees, and disciplined risk limits.</p></article><article><span>03</span><h3>Earn your seat</h3><p>Meet the target while respecting the rules. Your performance is the only thing that matters.</p></article></div></section>

      <section className="plans shell" id="plans"><div className="plan-copy"><div className="section-kicker">START WHERE YOU ARE</div><h2>One goal.<br /><em>Your pace.</em></h2><p>Every account is built on the same principles: market accuracy, room to perform, and rules you can actually understand.</p><a href="#rules" className="text-link">Read challenge rules <span>→</span></a></div><div className="plan-picker">{plans.map((plan, index) => <button key={plan.name} className={`plan ${activePlan === index ? "selected" : ""}`} onClick={() => setActivePlan(index)}><div><small>{plan.name}</small><strong>{plan.balance}</strong></div><span>Profit target <b>{plan.target}</b></span><span>Challenge fee <b>{plan.fee}</b></span><i>{activePlan === index ? "Selected" : "Choose"} <em>→</em></i></button>)}</div></section>

      <section className="rules shell" id="rules"><div><div className="section-kicker">THE STANDARD</div><h2>Simple rules.<br /><em>Serious traders.</em></h2></div><div className="rule-list"><p><span>01</span> Maximum daily loss <b>10%</b></p><p><span>02</span> Maximum drawdown <b>12%</b></p><p><span>03</span> Minimum trading days <b>5 days</b></p><p><span>04</span> Challenge window <b>30 days</b></p></div></section>

      <footer className="shell"><a className="brand" href="#top"><span>Q</span> Quantara</a><p>Simulation for traders who value the work.</p><small>© 2026 Quantara. Trading is simulated. Terms apply.</small></footer>
    </main>
  );
}
