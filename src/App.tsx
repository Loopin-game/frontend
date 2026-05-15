import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { userSession } from "@/lib/stacks-auth";
import { ChainProvider } from "@/lib/chain-context";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import GamePage from "./pages/GamePage";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import HowToPlay from "./pages/HowToPlay";
import NotFound from "./pages/NotFound";

// Import Solana wallet adapter styles
import "@solana/wallet-adapter-react-ui/styles.css";

const queryClient = new QueryClient();

const SolanaProviders = ({ children }: { children: React.ReactNode }) => {
  const network = (import.meta.env.VITE_SOLANA_NETWORK || "mainnet-beta") as any;
  const endpoint = useMemo(
    () => import.meta.env.VITE_SOLANA_RPC_URL || clusterApiUrl(network),
    [network]
  );
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const App = () => {
  // CRITICAL: Handle mobile wallet redirect on app load (Stacks flow)
  useEffect(() => {
    // Check if user just came back from wallet app (mobile redirect flow)
    if (userSession.isSignInPending()) {
      console.log('[Auth] Detected pending sign-in from mobile wallet redirect...');

      userSession.handlePendingSignIn()
        .then((userData) => {
          console.log('[Auth] Mobile wallet authentication successful!', userData);

          // Store wallet address
          const walletAddress = userData.profile.stxAddress.mainnet;
          localStorage.setItem('loopin_wallet', walletAddress);
          localStorage.setItem('loopin_wallet_stacks', walletAddress);

          // Clean up URL (remove auth token)
          window.history.replaceState({}, document.title, "/");

          // Reload to update UI
          window.location.reload();
        })
        .catch((error) => {
          console.error('[Auth] Error handling pending sign-in:', error);
        });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SolanaProviders>
        <ChainProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/game/:sessionId" element={<GamePage />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/how-to-play" element={<HowToPlay />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ChainProvider>
      </SolanaProviders>
    </QueryClientProvider>
  );
};

export default App;
