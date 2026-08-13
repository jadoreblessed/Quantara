import { activateBlock, formatBackendError } from "@/lib/quantara/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return Response.json(await activateBlock(Number(body.size)));
  } catch (error) {
    return formatBackendError(error);
  }
}
