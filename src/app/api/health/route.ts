import { backendConfig } from "@/lib/quantara/config";

export async function GET() {
  return Response.json({
    ok: true,
    service: "quantara-backend",
    mode: backendConfig.mode,
    provider: backendConfig.marketDataProvider,
    marketDataConfigured: Boolean(backendConfig.marketDataKey),
    heliusConfigured: Boolean(backendConfig.heliusApiKey || backendConfig.solanaRpcUrl),
    moralisConfigured: Boolean(backendConfig.moralisApiKey),
    chain: backendConfig.marketDataChain,
    timestamp: new Date().toISOString(),
  });
}
