import { clearJournal, formatBackendError } from "@/lib/quantara/store";

export async function DELETE() {
  try {
    return Response.json(await clearJournal());
  } catch (error) {
    return formatBackendError(error);
  }
}
