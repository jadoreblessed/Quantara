import { SolanaWalletProvider } from "@/components/solana-wallet-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <SolanaWalletProvider>{children}</SolanaWalletProvider>;
}
