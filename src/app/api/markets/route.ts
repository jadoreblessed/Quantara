import { getMarkets } from "@/lib/quantara/store";

export async function GET() {
  return Response.json(await getMarkets(), {
    headers: { "Cache-Control": "public, max-age=15, stale-while-revalidate=45" },
  });
}
