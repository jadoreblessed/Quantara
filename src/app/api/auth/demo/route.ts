import { createSession, getSnapshot } from "@/lib/quantara/store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  await createSession(
    typeof body.email === "string" ? body.email : undefined,
    typeof body.provider === "string" ? body.provider : undefined,
  );
  return Response.json(await getSnapshot());
}
