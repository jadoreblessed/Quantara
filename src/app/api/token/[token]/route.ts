import { formatBackendError, getTokenRoute } from "@/lib/quantara/store";

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    return Response.json(getTokenRoute(decodeURIComponent(token)), {
      headers: { "Cache-Control": "public, max-age=10, stale-while-revalidate=30" },
    });
  } catch (error) {
    return formatBackendError(error);
  }
}
