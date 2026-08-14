import { formatBackendError, getTokenRoute } from "@/lib/quantara/store";

export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const interval = new URL(request.url).searchParams.get("interval") ?? "1m";
    const detail = await getTokenRoute(decodeURIComponent(token), interval);
    return Response.json({ candles: detail.candles }, {
      headers: { "Cache-Control": "public, max-age=10, stale-while-revalidate=30" },
    });
  } catch (error) {
    return formatBackendError(error);
  }
}
