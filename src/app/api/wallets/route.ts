import { attachWallet, formatBackendError, getSessionAccount } from "@/lib/quantara/store";
import type { WalletAccount } from "@/lib/quantara/types";

export async function GET() {
  return Response.json(await getSessionAccount(), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return Response.json(await attachWallet({
      chain: String(body.chain ?? "solana") as WalletAccount["chain"],
      address: String(body.address ?? ""),
      label: typeof body.label === "string" ? body.label : undefined,
    }));
  } catch (error) {
    return formatBackendError(error);
  }
}
