import { claimReferral, formatBackendError } from "@/lib/quantara/store";

export async function POST() {
  try {
    return Response.json(await claimReferral());
  } catch (error) {
    return formatBackendError(error);
  }
}
