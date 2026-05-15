import React, { useEffect, useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { api, Game } from '@/lib/api';
import * as bagsApi from '@/lib/bags-api';
import { getSOLBalance, getLoopinTokenBalance } from '@/lib/solana-utils';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsOverview from '@/components/dashboard/StatsOverview';
import DashboardActionGrid from '@/components/dashboard/DashboardActionGrid';
import ActiveSessionsList from '@/components/dashboard/ActiveSessionsList';
import RecentActivitySidebar from '@/components/dashboard/RecentActivitySidebar';

function inferChainFromAddress(addr: string | null): 'stacks' | 'solana' {
  if (!addr) return 'solana';
  if (addr.startsWith('ST') || addr.startsWith('SP')) return 'stacks';
  return 'solana';
}

const Dashboard = () => {
  const [activeSessions, setActiveSessions] = useState<Game[]>([]);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [loopinBalance, setLoopinBalance] = useState<number | null>(null);
  const [bagsFeesFormatted, setBagsFeesFormatted] = useState<string | null>(null);
  const [userStats, setUserStats] = useState({
    totalArea: '0 km²',
    gamesPlayed: 0,
    gamesWon: 0,
    totalEarnings: '0',
  });
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [recentGames, setRecentGames] = useState<any[]>([]);

  const navigate = (path: string) => {
    window.location.href = path;
  };

  const effectiveChain = useMemo(
    () => inferChainFromAddress(walletAddress),
    [walletAddress]
  );

  useEffect(() => {
    const wallet = localStorage.getItem('loopin_wallet');
    const playerId = localStorage.getItem('playerId');

    setWalletAddress(wallet);

    if (!playerId) {
      if (wallet) {
        api
          .authenticate(wallet)
          .then((p) => {
            localStorage.setItem('playerId', p.id);
          })
          .catch(() => {
            navigate('/register');
          });
      } else {
        navigate('/register');
      }
      return;
    }

    if (!wallet) return;

    const chain = inferChainFromAddress(wallet);

    if (chain === 'solana') {
      getSOLBalance(wallet).then(({ balance }) => setCurrentBalance(balance));
      getLoopinTokenBalance(wallet).then(({ balance: lb }) => setLoopinBalance(lb));
      if (bagsApi.isBagsConfigured()) {
        bagsApi.getTokenLifetimeFees().then((fees) => {
          setBagsFeesFormatted(fees?.formattedFees ?? null);
        });
      } else {
        setBagsFeesFormatted(null);
      }
    } else {
      setLoopinBalance(null);
      setBagsFeesFormatted(null);
      import('@/lib/stacks-utils').then(({ getSTXBalance }) => {
        getSTXBalance(wallet).then((balanceData) => {
          setCurrentBalance(balanceData.total);
        });
      });
    }

    api
      .getPlayer(wallet)
      .then((response) => {
        if (response) {
          const sym = chain === 'solana' ? 'SOL' : 'STX';
          setUserStats({
            totalArea: `${(response.stats?.total_area || 0).toFixed(2)} km²`,
            gamesPlayed: response.stats?.games_played || 0,
            gamesWon: response.stats?.games_won || 0,
            totalEarnings: `${(response.stats?.total_earnings || 0).toFixed(1)} ${sym}`,
          });
          setInventory(response.inventory || {});
        }
      })
      .catch((err) => {
        console.log('[Dashboard] Player not registered yet', err);
      });
  }, []);

  useEffect(() => {
    const fetchLobby = async () => {
      try {
        const games = await api.getLobby();
        setActiveSessions(games);
      } catch (e) {
        console.error('Failed to load lobby', e);
      }
    };
    fetchLobby();
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#09090B] selection:bg-[#D4FF00] selection:text-black font-sans">
      <Header />

      <main className="pt-24 md:pt-32 pb-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <DashboardHeader
            primaryBalance={currentBalance}
            primarySymbol={effectiveChain === 'solana' ? 'SOL' : 'STX'}
            loopinBalance={effectiveChain === 'solana' ? loopinBalance : undefined}
            bagsFeesFormatted={effectiveChain === 'solana' ? bagsFeesFormatted : undefined}
            bagsTokenUrl={effectiveChain === 'solana' ? bagsApi.getLOOPINBagsUrl() : undefined}
          />

          <StatsOverview stats={userStats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            <div className="lg:col-span-2 space-y-8">
              <DashboardActionGrid
                walletAddress={walletAddress || ''}
                currentBalance={currentBalance}
                onBalanceUpdate={(newBalance) => setCurrentBalance(newBalance)}
                onRewardClaimed={(amount) => setCurrentBalance((prev) => prev + amount)}
                inventory={inventory}
              />

              <ActiveSessionsList activeSessions={activeSessions} />
            </div>

            <RecentActivitySidebar recentGames={recentGames} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
