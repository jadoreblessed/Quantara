import { formatBackendError, setFavorite } from "@/lib/quantara/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return Response.json(await setFavorite(String(body.ticker ?? ""), Boolean(body.favorite)));
  } catch (error) {
    return formatBackendError(error);
  }
}
