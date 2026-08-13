export async function GET() {
  return Response.json({
    ok: true,
    service: "quantara-backend",
    mode: "simulation",
    timestamp: new Date().toISOString(),
  });
}
