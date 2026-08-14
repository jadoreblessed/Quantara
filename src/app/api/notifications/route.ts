import { formatBackendError, getNotifications } from "@/lib/quantara/store";

export async function GET() {
  try {
    return Response.json(await getNotifications(), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return formatBackendError(error);
  }
}
