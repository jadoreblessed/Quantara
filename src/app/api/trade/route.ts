import { executeTrade, formatBackendError } from "@/lib/quantara/store";
import type { OrderSide } from "@/lib/quantara/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return Response.json(await executeTrade({
      token: String(body.token ?? body.ticker ?? ""),
      side: String(body.side ?? "buy") as OrderSide,
      amount: Number(body.amount ?? body.usd),
    }));
  } catch (error) {
    return formatBackendError(error);
  }
}
