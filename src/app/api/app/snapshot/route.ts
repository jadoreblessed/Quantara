import { getSnapshot } from "@/lib/quantara/store";

export async function GET() {
  return Response.json(await getSnapshot(), {
    headers: { "Cache-Control": "no-store" },
  });
}
