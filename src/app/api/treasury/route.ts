import { getTreasury } from "@/lib/quantara/store";

export async function GET() {
  return Response.json(getTreasury(), {
    headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" },
  });
}
