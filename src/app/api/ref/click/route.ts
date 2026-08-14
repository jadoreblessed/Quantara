import { trackReferralClick } from "@/lib/quantara/store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return Response.json(trackReferralClick(String(body.code ?? "")));
}
