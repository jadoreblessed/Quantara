import { getSessionAccount } from "@/lib/quantara/store";

export async function GET() {
  return Response.json(await getSessionAccount(), {
    headers: { "Cache-Control": "no-store" },
  });
}
