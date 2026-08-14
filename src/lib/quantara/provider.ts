import { backendConfig, isLiveBackend } from "./config";
import { blockTiers, getCandles, getHolders, getTapeTrades, getTokenDetail, searchTokens, tokens } from "./data";
import { getBirdeyeCandles, getBirdeyeCatalog, getBirdeyeHolders, getBirdeyeToken, getBirdeyeTrades } from "./birdeye";

export async function getMarketCatalog(query = "") {
  if (isLiveBackend() && backendConfig.marketDataProvider === "birdeye" && backendConfig.marketDataKey) {
    try {
      return { ...(await getBirdeyeCatalog(query)), blockTiers };
    } catch (error) {
      // Simulation fallback keeps the app usable while provider credentials, package access or rate limits are not ready.
      console.error("[quantara] Birdeye catalog fetch failed, falling back to simulation:", error);
    }
  }

  if (isLiveBackend() && backendConfig.marketDataUrl) {
    try {
      const url = new URL("/markets", backendConfig.marketDataUrl);
      if (query) url.searchParams.set("q", query);
      const response = await fetch(url, {
        headers: backendConfig.marketDataKey ? { Authorization: `Bearer ${backendConfig.marketDataKey}` } : {},
        next: { revalidate: 10 },
      });
      if (response.ok) return response.json();
    } catch {
      // Simulation fallback keeps the app usable while provider credentials are absent.
    }
  }

  const list = searchTokens(query);
  return {
    tokens: list,
    blockTiers,
    migrated: list.filter((token) => token.liqUsd >= 15000),
    almost: list.filter((token) => token.liqUsd < 15000),
    source: "simulation",
  };
}

export async function getMarketToken(identifier: string, interval?: string) {
  const detail = getTokenDetail(identifier);
  if (!detail) throw new Error("TOKEN_NOT_FOUND");
  if (isLiveBackend() && backendConfig.marketDataProvider === "birdeye" && backendConfig.marketDataKey) {
    try {
      const live = await getBirdeyeToken(identifier, detail);
      const [holders, trades, candles] = await Promise.allSettled([
        getBirdeyeHolders(identifier, live.network === "bnb" ? "bsc" : live.network),
        getBirdeyeTrades(identifier, live.network === "bnb" ? "bsc" : live.network),
        getBirdeyeCandles(identifier, interval),
      ]);
      return {
        ...live,
        holdersList: holders.status === "fulfilled" && holders.value.length ? holders.value : detail.holdersList,
        trades: trades.status === "fulfilled" && trades.value.length ? trades.value : detail.trades,
        candles: candles.status === "fulfilled" && candles.value.length ? candles.value : getCandles(identifier, interval),
      };
    } catch {
      // Fallback below.
    }
  }
  return { ...detail, candles: getCandles(identifier, interval) };
}

export async function getMarketSafety(identifier: string) {
  return (await getMarketToken(identifier)).safety;
}

export async function getMarketFills(identifier?: string) {
  if (identifier && isLiveBackend() && backendConfig.marketDataProvider === "birdeye" && backendConfig.marketDataKey) {
    try {
      const trades = await getBirdeyeTrades(identifier);
      if (trades.length) return trades;
    } catch {
      // Fallback below.
    }
  }
  return identifier ? getTapeTrades(identifier) : tokens.flatMap((token) => getTapeTrades(token.ticker).slice(0, 4));
}

export async function getMarketHolders(identifier: string) {
  if (isLiveBackend() && backendConfig.marketDataProvider === "birdeye" && backendConfig.marketDataKey) {
    try {
      const holders = await getBirdeyeHolders(identifier);
      if (holders.length) return holders;
    } catch {
      // Fallback below.
    }
  }
  return getHolders(identifier);
}
