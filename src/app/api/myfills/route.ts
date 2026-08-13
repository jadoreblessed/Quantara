import { getMyFills } from "@/lib/quantara/store";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? undefined;
  return Response.json(await getMyFills(token), {
    headers: { "Cache-Control": "no-store" },
  });
}
