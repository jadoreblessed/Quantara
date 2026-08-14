import { backendConfig } from "./config";
import type { Candle, Holder, OrderSide, TapeTrade, Token, TokenDetail } from "./types";

const BIRDEYE_BASE_URL = "https://public-api.birdeye.so";

type JsonRecord = Record<string, unknown>;

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" ? value as JsonRecord : {};
}

function asNumber(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function dataOf(payload: unknown) {
  return asRecord(asRecord(payload).data);
}

function chainToQuantara(chain: string): Token["chain"] {
  if (chain === "base") return "BASE";
  if (chain === "bsc" || chain === "bnb") return "BNB";
  if (chain === "hood") return "hood";
  return "SOL";
}

function networkToQuantara(chain: string): Token["network"] {
  if (chain === "base") return "base";
  if (chain === "bsc" || chain === "bnb") return "bnb";
  if (chain === "hood") return "hood";
  return "solana";
}

function birdeyeHeaders(chain = backendConfig.marketDataChain) {
  return {
    accept: "application/json",
    "X-API-KEY": backendConfig.marketDataKey,
    "x-chain": chain,
  };
}

async function birdeyeGet(path: string, params: Record<string, string | number | boolean | undefined> = {}, chain = backendConfig.marketDataChain) {
  if (!backendConfig.marketDataKey) throw new Error("BIRDEYE_KEY_MISSING");
  const url = new URL(path, BIRDEYE_BASE_URL);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }
  const response = await fetch(url, {
    headers: birdeyeHeaders(chain),
    next: { revalidate: 10 },
  });
  if (!response.ok) throw new Error(`BIRDEYE_${response.status}`);
  return response.json();
}

function tokenFromBirdeye(row: JsonRecord, chain = backendConfig.marketDataChain): Token {
  const address = asString(row.address ?? row.token_address ?? row.mint);
  const symbol = asString(row.symbol ?? row.ticker, address.slice(0, 6).toUpperCase());
  const name = asString(row.name, symbol);
  const liquidity = asNumber(row.liquidity ?? row.liquidity_usd ?? row.liquidityUsd);
  const marketCap = asNumber(row.mc ?? row.market_cap ?? row.marketCap ?? row.fdv, liquidity * 4);
  const price = asNumber(row.price ?? row.priceUsd ?? row.value, marketCap ? marketCap / 1_000_000_000 : 0);
  const holders = asNumber(row.holder ?? row.holders ?? row.holder_count);
  const volume = asNumber(row.volume_24h_usd ?? row.v24hUSD ?? row.volume24hUSD ?? row.volume);
  const change = asNumber(row.price_change_1h_percent ?? row.priceChange1hPercent ?? row.price_change_24h_percent);
  const ageSec = Math.max(0, Math.floor(Date.now() / 1000) - asNumber(row.creation_time ?? row.listing_time ?? row.recent_listing_time, Math.floor(Date.now() / 1000)));

  return {
    token: address,
    ticker: symbol,
    name,
    chain: chainToQuantara(chain),
    network: networkToQuantara(chain),
    launchpad: asString(row.source ?? row.launchpad, "Birdeye"),
    dex: asString(row.dex ?? row.market_source, "Birdeye"),
    ageMinutes: Math.max(1, Math.floor(ageSec / 60)),
    ageSec,
    liquidity,
    liqUsd: liquidity,
    holders,
    top10: 0,
    top10Pct: asNumber(row.top10HolderPercent ?? row.top10_pct, 0),
    marketCap,
    mcUsd: marketCap,
    volume,
    priceUsd: price,
    change,
    price,
    pool: asString(row.market_address ?? row.pair_address ?? row.pool),
    tradeable: liquidity > 0 && price > 0,
    links: {
      dexscreener: address ? `https://dexscreener.com/${chain === "solana" ? "solana" : chain}/${address}` : undefined,
      explorer: chain === "solana" ? `https://solscan.io/token/${address}` : undefined,
    },
  };
}

export async function getBirdeyeCatalog(query = "") {
  const chain = backendConfig.marketDataChain;
  const path = query ? "/defi/v3/search" : "/defi/v2/tokens/new_listing";
  const payload = await birdeyeGet(path, query ? { keyword: query, limit: 50 } : { limit: 50 }, chain);
  const data = dataOf(payload);
  const rawItems = data.items ?? data.tokens ?? data;
  const items = Array.isArray(rawItems) ? rawItems : [];
  const liveTokens = items.map((item) => tokenFromBirdeye(asRecord(item), chain)).filter((token) => token.token);
  return {
    tokens: liveTokens,
    migrated: liveTokens.filter((token) => token.liqUsd >= 15000),
    almost: liveTokens.filter((token) => token.liqUsd < 15000),
    source: "birdeye",
  };
}

export async function getBirdeyeToken(identifier: string, fallback: TokenDetail) {
  const chain = fallback.network === "bnb" ? "bsc" : fallback.network;
  const [overviewResult, securityResult] = await Promise.allSettled([
    birdeyeGet("/defi/token_overview", { address: identifier }, chain),
    birdeyeGet("/defi/token_security", { address: identifier }, chain),
  ]);
  const overview = overviewResult.status === "fulfilled" ? dataOf(overviewResult.value) : {};
  const security = securityResult.status === "fulfilled" ? dataOf(securityResult.value) : {};
  const merged = tokenFromBirdeye({ ...overview, address: identifier }, chain);
  const top10Pct = asNumber(security.top10HolderPercent ?? security.top10_pct, fallback.top10Pct);

  return {
    ...fallback,
    ...merged,
    top10: top10Pct,
    top10Pct,
    safety: {
      ...fallback.safety,
      top10Pct,
      devWalletPct: asNumber(security.creatorPercentage ?? security.devWalletPct, fallback.safety.devWalletPct),
      liquidityUsd: merged.liqUsd || fallback.safety.liquidityUsd,
      score: Math.max(20, Math.min(98, 100 - top10Pct - (merged.liqUsd < 10000 ? 12 : 0))),
    },
  };
}

export async function getBirdeyeHolders(identifier: string, chain = backendConfig.marketDataChain): Promise<Holder[]> {
  const payload = await birdeyeGet("/defi/v3/token/holder", { address: identifier, limit: 20 }, chain);
  const items = dataOf(payload).items;
  if (!Array.isArray(items)) return [];
  return items.map((item, index) => {
    const row = asRecord(item);
    return {
      wallet: asString(row.owner ?? row.wallet ?? row.address),
      rank: index + 1,
      balance: asNumber(row.amount ?? row.balance ?? row.uiAmount),
      percent: asNumber(row.percentage ?? row.percent),
      valueUsd: asNumber(row.valueUsd ?? row.value_usd),
    };
  }).filter((holder) => holder.wallet);
}

export async function getBirdeyeTrades(identifier: string, chain = backendConfig.marketDataChain): Promise<TapeTrade[]> {
  const payload = await birdeyeGet("/defi/txs/token/seek_by_time", { address: identifier, limit: 30 }, chain);
  const items = dataOf(payload).items;
  if (!Array.isArray(items)) return [];
  return items.map((item, index) => {
    const row = asRecord(item);
    const side = asString(row.side ?? row.tx_type, "buy").toLowerCase().includes("sell") ? "sell" : "buy";
    const usd = asNumber(row.volumeUSD ?? row.volume_usd ?? row.amount_usd);
    const priceUsd = asNumber(row.price ?? row.priceUsd);
    return {
      id: asString(row.txHash ?? row.tx_hash ?? row.signature, `${identifier}-${index}`),
      token: identifier,
      wallet: asString(row.owner ?? row.wallet ?? row.source, "unknown"),
      side: side as OrderSide,
      usd,
      priceUsd,
      quantity: priceUsd > 0 ? usd / priceUsd : asNumber(row.amount),
      ageSec: Math.max(0, Math.floor(Date.now() / 1000) - asNumber(row.blockUnixTime ?? row.block_unix_time, Math.floor(Date.now() / 1000))),
      tx: asString(row.txHash ?? row.tx_hash ?? row.signature, `${identifier}-${index}`),
    };
  });
}

export async function getBirdeyeCandles(identifier: string, interval = "1m", chain = backendConfig.marketDataChain): Promise<Candle[]> {
  const now = Math.floor(Date.now() / 1000);
  const payload = await birdeyeGet("/defi/ohlcv", {
    address: identifier,
    type: interval,
    time_from: now - 60 * 60 * 12,
    time_to: now,
  }, chain);
  const items = dataOf(payload).items;
  if (!Array.isArray(items)) return [];
  return items.map((item) => {
    const row = asRecord(item);
    return {
      time: asNumber(row.unixTime ?? row.time),
      open: asNumber(row.o ?? row.open),
      high: asNumber(row.h ?? row.high),
      low: asNumber(row.l ?? row.low),
      close: asNumber(row.c ?? row.close),
      volume: asNumber(row.v ?? row.volume),
    };
  });
}
