import { backendConfig, isLiveBackend } from "@/lib/quantara/config";
import { getBirdeyeCatalog } from "@/lib/quantara/birdeye";

export async function GET() {
  const report = {
    mode: backendConfig.mode,
    isLive: isLiveBackend(),
    provider: backendConfig.marketDataProvider,
    chain: backendConfig.marketDataChain,
    hasKey: Boolean(backendConfig.marketDataKey),
    keyPreview: backendConfig.marketDataKey ? `${backendConfig.marketDataKey.slice(0, 4)}...${backendConfig.marketDataKey.slice(-4)}` : null,
  };

  if (!isLiveBackend()) {
    return Response.json({ ...report, result: "SKIPPED", reason: "QUANTARA_BACKEND_MODE is not 'live'" });
  }
  if (backendConfig.marketDataProvider !== "birdeye") {
    return Response.json({ ...report, result: "SKIPPED", reason: `marketDataProvider is '${backendConfig.marketDataProvider}', not 'birdeye'` });
  }
  if (!backendConfig.marketDataKey) {
    return Response.json({ ...report, result: "SKIPPED", reason: "QUANTARA_MARKET_DATA_KEY is empty" });
  }

  try {
    const catalog = await getBirdeyeCatalog();
    return Response.json({ ...report, result: "OK", tokenCount: catalog.tokens.length, sample: catalog.tokens.slice(0, 3) });
  } catch (error) {
    return Response.json({
      ...report,
      result: "ERROR",
      error: error instanceof Error ? error.message : String(error),
    }, { status: 200 });
  }
}