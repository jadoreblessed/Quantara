import { formatBackendError, markNotificationsSeen } from "@/lib/quantara/store";

export async function POST() {
  try {
    return Response.json(await markNotificationsSeen());
  } catch (error) {
    return formatBackendError(error);
  }
}
