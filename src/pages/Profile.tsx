import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Wallet,
  Copy,
  Check,
  MapPin,
  Trophy,
  Activity,
  Zap,
  Settings,
  LogOut,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { SlideUp, StaggerContainer, ScaleIn, FadeIn } from '@/components/animation/MotionWrapper';
import { api, PlayerProfile } from '@/lib/api';
import { getSTXBalance, formatSTX } from '@/lib/stacks-utils';
import { getSOLBalance, getLoopinTokenBalance, formatSOL } from '@/lib/solana-utils';
import * as bagsApi from '@/lib/bags-api';
import { userSession } from '@/lib/stacks-auth';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { useChain } from '@/lib/chain-context';

function inferChainFromAddress(addr: string | null): 'stacks' | 'solana' {
  if (!addr) return 'solana';
  if (addr.startsWith('ST') || addr.startsWith('SP')) return 'stacks';
  return 'solana';
}

const Profile = () => {
  const navigate = useNavigate();
  const { disconnect: disconnectPhantom, connected } = useWallet();
  const { disconnect: disconnectChainContext } = useChain();
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [loopinBalance, setLoopinBalance] = useState<number>(0);
  const [claimableHint, setClaimableHint] = useState<string | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(true);

  // Edit State
  const [editUsername, setEditUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);


  // Real Data State (matches Dashboard)
  const [stats, setStats] = useState({
    totalArea: '0 km²',
    gamesPlayed: 0,
    gamesWon: 0,
    totalEarnings: '0 STX',
    winRate: '0%',
    currentStreak: 0,
    longestTrail: '0 m',
    biggestLoop: '0 m²',
    rank: 0
  });
  const [recentGames, setRecentGames] = useState<any[]>([]);

  useEffect(() => {
    // Get real wallet address
    const loopinWallet = localStorage.getItem('loopin_wallet');
    if (loopinWallet) {
      setWalletAddress(loopinWallet);
    } else if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      const address = userData.profile.stxAddress.mainnet;
      setWalletAddress(address);
      localStorage.setItem('loopin_wallet', address);
    } else {
      // No wallet connected, redirect to home
      console.log('[Profile] No wallet connected, redirecting to home');
      setIsLoading(false);
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (walletAddress) {
      fetchProfile();
      fetchBalance();
    }
  }, [walletAddress]);

  const fetchBalance = async () => {
    if (!walletAddress) return;

    setLoadingBalance(true);
    try {
      const chain = inferChainFromAddress(walletAddress);
      if (chain === 'solana') {
        const { balance: sol } = await getSOLBalance(walletAddress);
        setBalance(sol);
        const { balance: lb } = await getLoopinTokenBalance(walletAddress);
        setLoopinBalance(lb);
        if (bagsApi.isBagsConfigured()) {
          const positions = await bagsApi.getClaimablePositions(walletAddress);
          const total = positions.reduce((s, p) => s + (p.claimableAmount || 0), 0);
          setClaimableHint(total > 0 ? `${positions.length} fee position(s) on Bags` : null);
        } else {
          setClaimableHint(null);
        }
      } else {
        setLoopinBalance(0);
        setClaimableHint(null);
        const balanceData = await getSTXBalance(walletAddress);
        setBalance(balanceData.total);
      }
    } catch (error) {
      console.error('[Profile] Error fetching balance:', error);
    } finally {
      setLoadingBalance(false);
    }
  };

  const fetchProfile = async () => {
    if (!walletAddress) {
      setIsLoading(false);
      return;
    }

    console.log('[Profile] Fetching profile for wallet:', walletAddress);

    try {
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );

      // Try getting real profile with timeout
      const profilePromise = api.getPlayer(walletAddress);

      const p = await Promise.race([profilePromise, timeoutPromise])
        .catch((error) => {
          console.log('[Profile] API call failed or timed out:', error);
          return null;
        }) as PlayerProfile | null;

      if (p) {
        console.log('[Profile] Profile loaded from API:', p);
        setPlayer(p);
        setEditUsername(p.username);

        // In the future, if p contains stats, we would update them here.
        // For now, we leave them as defaults (0) to match Dashboard behavior.
      } else {
        // Fallback if user hasn't registered yet or API failed
        console.log('[Profile] Using fallback profile for wallet:', walletAddress);
        setPlayer({
          id: 'temp-id',
          wallet_address: walletAddress,
          username: 'Runner',
          avatar_seed: 'Runner',
          level: 1,
          joined_at: new Date().toISOString()
        } as PlayerProfile);
        setEditUsername('Runner');
      }
    } catch (e) {
      console.error('[Profile] Error fetching profile:', e);
      // Still create fallback profile on error
      setPlayer({
        id: 'temp-id',
        wallet_address: walletAddress,
        username: 'Runner',
        avatar_seed: 'Runner',
        level: 1,
        joined_at: new Date().toISOString()
      } as PlayerProfile);
      setEditUsername('Runner');
    } finally {
      console.log('[Profile] Setting loading to false');
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!player) return;
    navigator.clipboard.writeText(player.wallet_address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const handleSave = async () => {
    if (!player) return;
    try {
      const updated = await api.updatePlayer(player.wallet_address, editUsername);
      setPlayer(updated);
      setIsEditing(false);
    } catch (e) {
      console.error("Failed to update", e);
      // Show error toast ideally
    }
  };

  const handleCancel = () => {
    if (player) setEditUsername(player.username);
    setIsEditing(false);
  };

  const handleDisconnectProfile = async () => {
    userSession.signUserOut();
    if (connected) {
      await disconnectPhantom();
    }
    disconnectChainContext();
    localStorage.removeItem('loopin_wallet');
    localStorage.removeItem('loopin_wallet_stacks');
    localStorage.removeItem('loopin_wallet_solana');
    localStorage.removeItem('playerId');
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4FF00] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-display text-xl font-bold text-gray-400">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!player) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-white text-[#09090B] selection:bg-[#D4FF00] selection:text-black">
      <Header />

      <main className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">

            {/* 1. PROFILE HEADER */}
            <div className="flex flex-col md:flex-row gap-12 items-start mb-24">

              {/* Avatar Section */}
              <ScaleIn className="relative group mx-auto md:mx-0">
                <div className="w-32 h-32 md:w-48 md:h-48 bg-[#09090B] rounded-full flex items-center justify-center border-[6px] md:border-[8px] border-[#D4FF00] shadow-[0_0_40px_rgba(212,255,0,0.3)]">
                  <span className="font-display text-6xl md:text-8xl font-black text-white capitalize">
                    {player.avatar_seed ? player.avatar_seed.charAt(0) : player.username.charAt(0)}
                  </span>
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full border border-gray-200 shadow-lg text-xs font-bold tracking-widest uppercase whitespace-nowrap">
                  Level {player.level} Runner
                </div>
              </ScaleIn>

              {/* Info Section */}
              <SlideUp className="flex-1 space-y-6 w-full text-center md:text-left" delay={0.2}>
                <div>
                  {isEditing ? (
                    <div className="flex items-center gap-4 mb-4 justify-center md:justify-start">
                      <Input
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        className="font-display text-4xl md:text-6xl font-black h-auto py-2 px-4 w-full md:w-auto border-black"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <h1 className="font-display text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-4 break-words">
                      {player.username}
                    </h1>
                  )}

                  <div className="flex flex-col md:flex-row gap-4 md:items-center justify-center md:justify-start">
                    <button
                      onClick={handleCopy}
                      className="group flex items-center justify-center md:justify-start space-x-3 bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-full pl-6 pr-4 py-3 transition-all w-full md:w-auto"
                    >
                      <Wallet size={20} className="text-gray-400 group-hover:text-black transition-colors flex-shrink-0" />
                      <span className="font-mono text-base md:text-lg font-bold text-gray-500 group-hover:text-black transition-colors truncate">
                        {truncateAddress(player.wallet_address)}
                      </span>
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                        {copied ? <Check size={14} className="text-[#00C853]" /> : <Copy size={14} className="text-black" />}
                      </div>
                    </button>

                    <span className="text-gray-400 font-bold tracking-widest text-sm md:text-base">
                      JOINED {new Date(player.joined_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave} className="h-14 px-8 rounded-full bg-[#D4FF00] text-black font-display font-bold text-lg hover:bg-black hover:text-[#D4FF00] transition-all w-full md:w-auto">
                        <Save className="w-5 h-5 mr-2" />
                        SAVE CHANGES
                      </Button>
                      <Button onClick={handleCancel} variant="ghost" className="h-14 px-8 rounded-full font-display font-bold text-lg w-full md:w-auto">
                        <X className="w-5 h-5 mr-2" />
                        CANCEL
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="lg" className="h-14 px-8 rounded-full border-2 border-black text-black font-display font-bold text-lg hover:bg-black hover:text-white transition-all w-full md:w-auto">
                      <Edit2 className="w-5 h-5 mr-2" />
                      EDIT PROFILE
                    </Button>
                  )}

                  {!isEditing && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="lg"
                      onClick={handleDisconnectProfile}
                      className="h-14 px-8 rounded-full text-red-500 font-display font-bold text-lg hover:bg-red-50 hover:text-red-600 w-full md:w-auto"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      DISCONNECT
                    </Button>
                  )}
                </div>
              </SlideUp>

              {/* Balance Card - Floating style */}
              <ScaleIn className="w-full md:w-auto p-6 md:p-8 bg-[#09090B] text-white rounded-[32px] md:min-w-[300px] shadow-2xl relative overflow-hidden mt-6 md:mt-0" delay={0.4}>
                <div className="absolute top-0 right-0 p-8 opacity-20">
                  <Wallet size={120} className="text-[#D4FF00]" />
                </div>
                <div className="relative z-10">
                  <p className="text-gray-400 font-bold tracking-widest text-sm mb-2">TOTAL BALANCE</p>
                  <div className="flex items-baseline gap-2">
                    {loadingBalance ? (
                      <span className="font-display text-3xl font-bold text-gray-500">Loading...</span>
                    ) : (
                      <>
                        <span className="font-display text-5xl md:text-6xl font-black text-[#D4FF00] tracking-tighter">
                          {inferChainFromAddress(walletAddress) === 'solana'
                            ? formatSOL(balance)
                            : formatSTX(balance)}
                        </span>
                        <span className="font-bold text-xl text-white">
                          {inferChainFromAddress(walletAddress) === 'solana' ? 'SOL' : 'STX'}
                        </span>
                      </>
                    )}
                  </div>
                  {inferChainFromAddress(walletAddress) === 'solana' && (
                    <p className="text-sm text-gray-400 mt-2">
                      $LOOPIN:{' '}
                      <span className="text-white font-mono">{loopinBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                    </p>
                  )}
                  {claimableHint && (
                    <p className="text-xs text-[#9945FF] mt-1">{claimableHint}</p>
                  )}
                  {inferChainFromAddress(walletAddress) === 'solana' && (
                    <a
                      href={bagsApi.getLOOPINBagsUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#D4FF00] underline mt-2 inline-block"
                    >
                      View $LOOPIN on Bags
                    </a>
                  )}
                  <div className="w-full h-px bg-white/10 my-6" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-white">Lifetime Earnings</span>
                    <span className="font-mono text-[#D4FF00]">{stats.totalEarnings}</span>
                  </div>
                </div>
              </ScaleIn>
            </div>

            {/* 2. STATS GRID */}
            <div className="mb-24">
              <SlideUp className="flex items-end gap-4 mb-12">
                <h2 className="font-display text-3xl md:text-5xl font-black tracking-tighter">PERFORMANCE</h2>
                <div className="h-1 flex-1 bg-[#F3F4F6] mb-4 rounded-full" />
              </SlideUp>

              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" delay={0.5}>
                {/* Stat 1 */}
                <SlideUp className="p-6 md:p-8 bg-[#F3F4F6] rounded-[32px] hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <MapPin className="w-6 h-6 text-black" />
                  </div>
                  <p className="text-gray-500 font-bold text-sm tracking-widest mb-2">TOTAL AREA</p>
                  <p className="font-display text-3xl md:text-4xl font-black">{stats.totalArea}</p>
                </SlideUp>

                {/* Stat 2 */}
                <SlideUp className="p-6 md:p-8 bg-[#D4FF00] rounded-[32px] hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <Trophy className="w-6 h-6 text-[#D4FF00]" />
                  </div>
                  <p className="text-black/60 font-bold text-sm tracking-widest mb-2">GAMES WON</p>
                  <p className="font-display text-3xl md:text-4xl font-black text-black">{stats.gamesWon}</p>
                </SlideUp>

                {/* Stat 3 */}
                <SlideUp className="p-6 md:p-8 bg-[#F3F4F6] rounded-[32px] hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <Activity className="w-6 h-6 text-black" />
                  </div>
                  <p className="text-gray-500 font-bold text-sm tracking-widest mb-2">WIN RATE</p>
                  <p className="font-display text-3xl md:text-4xl font-black">{stats.winRate}</p>
                </SlideUp>

                {/* Stat 4 */}
                <SlideUp className="p-6 md:p-8 bg-black text-white rounded-[32px] hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6">
                    <Zap className="w-6 h-6 text-[#D4FF00]" />
                  </div>
                  <p className="text-gray-400 font-bold text-sm tracking-widest mb-2">STREAK</p>
                  <p className="font-display text-3xl md:text-4xl font-black text-[#D4FF00]">{stats.currentStreak} <span className="text-lg md:text-xl text-gray-500">WINS</span></p>
                </SlideUp>
              </StaggerContainer>

              {/* Secondary Stats */}
              <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6" delay={0.6}>
                {[
                  { label: 'GAMES PLAYED', value: stats.gamesPlayed },
                  { label: 'LONGEST TRAIL', value: stats.longestTrail },
                  { label: 'BIGGEST LOOP', value: stats.biggestLoop },
                  { label: 'RANK', value: `#${stats.rank}` }
                ].map((stat, i) => (
                  <SlideUp key={i} className="p-6 border border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center">
                    <p className="text-xs font-bold text-gray-400 tracking-widest mb-1">{stat.label}</p>
                    <p className="font-display text-2xl font-bold">{stat.value}</p>
                  </SlideUp>
                ))}
              </StaggerContainer>
            </div>

            {/* 3. GAME HISTORY */}
            <FadeIn>
              <div className="flex items-end gap-4 mb-12">
                <h2 className="font-display text-3xl md:text-5xl font-black tracking-tighter">HISTORY</h2>
                <div className="h-1 flex-1 bg-[#F3F4F6] mb-4 rounded-full" />
              </div>

              <div className="border border-gray-200 rounded-[32px] overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-8 py-6 bg-[#F8F9FA] text-xs font-black tracking-widest text-gray-400 uppercase hidden md:grid">
                  <div className="col-span-3">Date</div>
                  <div className="col-span-2 text-right">Area</div>
                  <div className="col-span-2 text-center">Rank</div>
                  <div className="col-span-2 text-center">Players</div>
                  <div className="col-span-3 text-right">Prize</div>
                </div>

                <div className="divide-y divide-gray-100">
                  {recentGames.map((game) => (
                    <div
                      key={game.id}
                      className="grid grid-cols-2 md:grid-cols-12 gap-4 px-4 py-4 md:px-8 md:py-6 items-center hover:bg-gray-50 transition-colors group"
                    >
                      <div className="col-span-2 md:col-span-3">
                        <div className="font-display text-lg font-bold">{game.date}</div>
                        <div className="text-xs text-gray-400 md:hidden">Details below</div>
                      </div>

                      <div className="col-span-1 md:col-span-2 md:text-right">
                        <span className="md:hidden text-xs text-gray-400 uppercase mr-2">Area:</span>
                        <span className="font-mono font-medium">{game.area}</span>
                      </div>

                      <div className={`col-span-1 md:col-span-2 md:text-center text-right ${game.rank === 1 ? 'text-[#00C853]' : ''}`}>
                        <span className="md:hidden text-xs text-gray-400 uppercase mr-2">Rank:</span>
                        <span className="font-display text-xl font-black">#{game.rank}</span>
                      </div>

                      <div className="hidden md:block col-span-2 text-center text-gray-400 font-mono">
                        {game.players}
                      </div>

                      <div className="col-span-2 md:col-span-3 text-right">
                        {game.prize ? (
                          <span className="inline-flex items-center px-3 py-1 bg-[#D4FF00]/20 text-black/80 rounded-full font-bold text-sm">
                            +{game.prize}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
