export async function GET() {
  return Response.json({
    rows: [
      { rank: 1, trader: "suri.eth", pnl: 18420, winRate: 71, block: 5000 },
      { rank: 2, trader: "hoodsniper", pnl: 12380, winRate: 66, block: 3000 },
      { rank: 3, trader: "basewizard", pnl: 8910, winRate: 63, block: 3000 },
      { rank: 4, trader: "qnt.demo", pnl: 5240, winRate: 58, block: 1000 },
    ],
  }, { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" } });
}
