import { getPortfolio, getSnapshot } from "@/lib/quantara/store";

export async function GET() {
  const [portfolio, snapshot] = await Promise.all([getPortfolio(), getSnapshot()]);
  return Response.json({
    account: portfolio.session,
    risk: portfolio.risk,
    activeBlock: portfolio.portfolio.activeBlock,
    treasury: snapshot.treasury,
    verdict: portfolio.risk.breached ? "breached" : portfolio.portfolio.activeBlock ? "active" : "no-block",
  }, { headers: { "Cache-Control": "no-store" } });
}
