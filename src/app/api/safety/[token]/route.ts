import { formatBackendError, getSafetyRoute } from "@/lib/quantara/store";

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    return Response.json(getSafetyRoute(decodeURIComponent(token)), {
      headers: { "Cache-Control": "public, max-age=15, stale-while-revalidate=45" },
    });
  } catch (error) {
    return formatBackendError(error);
  }
}
