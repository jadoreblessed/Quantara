import { executeOrder, formatBackendError } from "@/lib/quantara/store";
import type { OrderSide } from "@/lib/quantara/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return Response.json(await executeOrder({
      ticker: String(body.ticker ?? ""),
      side: String(body.side ?? "buy") as OrderSide,
      amount: Number(body.amount),
    }));
  } catch (error) {
    return formatBackendError(error);
  }
}
