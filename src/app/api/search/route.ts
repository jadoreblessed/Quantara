import { getSearchResults } from "@/lib/quantara/store";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q") ?? "";
  return Response.json(await getSearchResults(query), {
    headers: { "Cache-Control": "public, max-age=10, stale-while-revalidate=30" },
  });
}
