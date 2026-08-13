import { getPortfolio } from "@/lib/quantara/store";

export async function GET() {
  return Response.json(await getPortfolio(), {
    headers: { "Cache-Control": "no-store" },
  });
}
