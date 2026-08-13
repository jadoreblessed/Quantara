"use client";

import { useEffect, useRef } from "react";

type Candle = {
  x: number;
  y: number;
  width: number;
  height: number;
  wick: number;
  speed: number;
  phase: number;
  depth: number;
  positive: boolean;
};

function createCandles(width: number, height: number, compact: boolean) {
  const count = compact ? 24 : 46;
  let seed = 247;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  return Array.from({ length: count }, (_, index): Candle => {
    const depth = index % 3;
    return {
      x: random() * width,
      y: height * (.18 + random() * .66),
      width: (compact ? 3 : 4) + random() * (depth === 0 ? 8 : 5),
      height: 24 + random() * (depth === 0 ? 94 : 62),
      wick: 12 + random() * 54,
      speed: .11 + depth * .045 + random() * .08,
      phase: random() * Math.PI * 2,
      depth,
      positive: random() > .42,
    };
  });
}

export function LiquidCandles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest<HTMLElement>(".bf-hero");
    if (!canvas || !hero) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let candles: Candle[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let lastFrame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let smoothX = 0;
    let smoothY = 0;

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      candles = createCandles(width, height, width < 680);
      if (reducedMotion.matches) {
        window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(draw);
      }
    };

    const draw = (time: number) => {
      if (!visible) return;

      if (time - lastFrame < 33 && !reducedMotion.matches) {
        frame = window.requestAnimationFrame(draw);
        return;
      }
      lastFrame = time;
      smoothX += (pointerX - smoothX) * .025;
      smoothY += (pointerY - smoothY) * .025;
      context.clearRect(0, 0, width, height);

      const centerMask = context.createRadialGradient(width * .42, height * .48, 20, width * .42, height * .48, width * .46);
      centerMask.addColorStop(0, "rgba(5,7,11,.98)");
      centerMask.addColorStop(.52, "rgba(5,7,11,.62)");
      centerMask.addColorStop(1, "rgba(5,7,11,0)");

      for (const candle of candles) {
        const depthOpacity = [1, .55, .3][candle.depth];
        const drift = reducedMotion.matches ? 0 : time * candle.speed * .001;
        const x = ((candle.x - drift * 95 + width * 1.25) % (width * 1.25)) - width * .1 + smoothX * (12 - candle.depth * 3);
        const wave = reducedMotion.matches ? 0 : Math.sin(time * .00045 + candle.phase) * (15 + candle.depth * 5);
        const pulse = reducedMotion.matches ? .72 : .58 + Math.sin(time * .0007 + candle.phase) * .24;
        const y = candle.y + wave + smoothY * (9 - candle.depth * 2);
        const bodyHeight = Math.max(8, candle.height * pulse);
        const edgeFade = Math.min(1, x / 100, (width - x) / 100);
        const textClear = Math.max(.12, Math.min(1, Math.abs(x - width * .4) / (width * .24)));
        const alpha = Math.max(0, edgeFade) * textClear * depthOpacity;
        const green = candle.positive;

        context.save();
        context.globalAlpha = alpha;
        context.shadowBlur = candle.depth === 0 ? 18 : 8;
        context.shadowColor = green ? "rgba(243,186,47,.32)" : "rgba(121,247,255,.24)";

        const wickGradient = context.createLinearGradient(0, y - candle.wick, 0, y + candle.wick);
        wickGradient.addColorStop(0, green ? "rgba(243,186,47,0)" : "rgba(121,247,255,0)");
        wickGradient.addColorStop(.5, green ? "rgba(243,186,47,.55)" : "rgba(121,247,255,.46)");
        wickGradient.addColorStop(1, green ? "rgba(243,186,47,0)" : "rgba(121,247,255,0)");
        context.strokeStyle = wickGradient;
        context.lineWidth = Math.max(1, 1.4 - candle.depth * .2);
        context.beginPath();
        context.moveTo(x, y - bodyHeight / 2 - candle.wick);
        context.lineTo(x, y + bodyHeight / 2 + candle.wick * .72);
        context.stroke();

        const bodyGradient = context.createLinearGradient(x - candle.width, y, x + candle.width, y);
        bodyGradient.addColorStop(0, green ? "rgba(243,186,47,.08)" : "rgba(121,247,255,.06)");
        bodyGradient.addColorStop(.5, green ? "rgba(243,186,47,.48)" : "rgba(121,247,255,.38)");
        bodyGradient.addColorStop(1, green ? "rgba(243,186,47,.12)" : "rgba(121,247,255,.08)");
        context.fillStyle = bodyGradient;
        context.beginPath();
        context.roundRect(x - candle.width / 2, y - bodyHeight / 2, candle.width, bodyHeight, candle.width / 2);
        context.fill();
        context.restore();
      }

      context.save();
      context.globalCompositeOperation = "source-over";
      context.fillStyle = centerMask;
      context.fillRect(0, 0, width, height);
      context.restore();

      if (!reducedMotion.matches) frame = window.requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX / window.innerWidth - .5;
      pointerY = event.clientY / window.innerHeight - .5;
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(draw);
      }
    }, { threshold: .02 });
    const onMotionChange = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(draw);
    };
    const resizeObserver = new ResizeObserver(resize);
    observer.observe(hero);
    resizeObserver.observe(hero);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    reducedMotion.addEventListener("change", onMotionChange);
    resize();
    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      reducedMotion.removeEventListener("change", onMotionChange);
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="bf-liquid-candles" aria-hidden="true" />;
}
