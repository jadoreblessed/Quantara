import { getMarkets } from "@/lib/quantara/store";

export async function GET() {
  return Response.json(getMarkets(), {
    headers: { "Cache-Control": "public, max-age=15, stale-while-revalidate=45" },
  });
}
