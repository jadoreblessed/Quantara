import { formatBackendError, getReferral } from "@/lib/quantara/store";

export async function GET() {
  try {
    return Response.json(await getReferral(), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return formatBackendError(error);
  }
}
