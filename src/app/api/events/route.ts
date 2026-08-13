import { getMyFills, getSnapshot } from "@/lib/quantara/store";

export async function GET() {
  const encoder = new TextEncoder();
  const snapshot = await getSnapshot();
  const fills = await getMyFills();
  const body = [
    `event: snapshot\ndata: ${JSON.stringify({ tokens: snapshot.tokens, status: snapshot.status })}\n\n`,
    `event: fills\ndata: ${JSON.stringify(fills)}\n\n`,
  ].join("");

  return new Response(encoder.encode(body), {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store",
      Connection: "keep-alive",
    },
  });
}
