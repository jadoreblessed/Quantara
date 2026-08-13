import { logout } from "@/lib/quantara/store";

export async function POST() {
  return Response.json(await logout());
}
