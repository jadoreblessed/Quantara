import { clearStop, formatBackendError } from "@/lib/quantara/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return Response.json(await clearStop(String(body.id ?? "")));
  } catch (error) {
    return formatBackendError(error);
  }
}
