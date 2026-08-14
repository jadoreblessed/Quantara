import { createStop, formatBackendError, getStops } from "@/lib/quantara/store";
import type { OrderSide } from "@/lib/quantara/types";

export async function GET() {
  try {
    return Response.json(await getStops(), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return formatBackendError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return Response.json(await createStop({
      ticker: String(body.ticker ?? body.token ?? ""),
      side: String(body.side ?? "sell") as OrderSide,
      triggerPrice: Number(body.triggerPrice ?? body.price),
      amount: Number(body.amount ?? body.usd),
    }));
  } catch (error) {
    return formatBackendError(error);
  }
}
