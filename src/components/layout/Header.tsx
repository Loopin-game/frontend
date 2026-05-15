import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X, Wallet, LogOut, User, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConnect } from '@stacks/connect-react';
import { userSession } from '@/lib/stacks-auth';
import { Button } from '@/components/ui/button';
import { connectWallet } from '@/lib/wallet-utils';
import ChainSelector from '@/components/ChainSelector';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useChain } from '@/lib/chain-context';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const { authenticate } = useConnect();
  const { disconnect: disconnectPhantom, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { activeChain, disconnect: disconnectChainContext } = useChain();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isSignedIn, setIsSignedIn] = React.useState(false);
  const [userAddress, setUserAddress] = React.useState<string | null>(null);

  const location = useLocation();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const checkWalletStatus = () => {
      console.log('[Header] Checking wallet status...');

      // First check localStorage (most reliable after connection)
      const storedWallet = localStorage.getItem('loopin_wallet');
      const storedNetwork = localStorage.getItem('loopin_network');

      if (storedWallet) {
        console.log('[Header] ✅ Found wallet in localStorage:', storedWallet);
        console.log('[Header] Network:', storedNetwork);
        setIsSignedIn(true);
        setUserAddress(storedWallet);
        return;
      }

      // Fallback: Check Stacks session
      if (userSession.isUserSignedIn()) {
        console.log('[Header] ✅ Found Stacks session');
        const userData = userSession.loadUserData();
        const network = import.meta.env.VITE_NETWORK || 'testnet';
        const address = network === 'mainnet'
          ? userData.profile.stxAddress.mainnet
          : userData.profile.stxAddress.testnet;

        console.log('[Header] Using', network, 'address:', address);
        setIsSignedIn(true);
        setUserAddress(address);
        // Sync to localStorage
        localStorage.setItem('loopin_wallet', address);
        localStorage.setItem('loopin_network', network);
      } else {
        // Not signed in
        console.log('[Header] ❌ No wallet found');
        setIsSignedIn(false);
        setUserAddress(null);
      }
    };

    checkWalletStatus();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]); // Re-check on location change

  const handleConnect = async () => {
    if (activeChain === 'solana') {
      setVisible(true);
      return;
    }
    connectWallet(authenticate, userSession);
  };

  const handleDisconnect = async (e?: React.MouseEvent) => {
    console.log('[Logout] Disconnect button clicked');

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      console.log('[Logout] Signing out user...');
      userSession.signUserOut();
      if (connected) {
        await disconnectPhantom();
      }
      disconnectChainContext();
      localStorage.removeItem('loopin_wallet');
      localStorage.removeItem('loopin_wallet_stacks');
      localStorage.removeItem('loopin_wallet_solana');
      localStorage.removeItem('playerId');

      setIsSignedIn(false);
      setUserAddress(null);
      setIsMenuOpen(false);

      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error) {
      console.error('[Logout] Error during logout:', error);
      window.location.href = '/';
    }
  };

  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const navLinks = [
    // { href: '/', label: 'Home' },
    ...(isSignedIn ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/how-to-play', label: 'How to Play' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none",
      className
    )}>
      {/* Search/Status Bar Decoration (Top Border) */}
      <div className={cn(
        "h-1 w-full transition-all duration-300",
        isScrolled ? "bg-black/5" : "bg-transparent"
      )} />

      <div className={cn(
        "transition-all duration-300 pointer-events-auto",
        isScrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-black/5 py-2"
          : "bg-transparent border-transparent py-4"
      )}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src="/logo.svg"
                alt="Loopin"
                className="w-10 h-10 transform group-hover:rotate-12 transition-transform duration-300"
              />
              <span className="font-display font-black text-2xl tracking-tighter italic">
                LOOPIN
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-xs font-bold font-display tracking-[0.2em] uppercase transition-colors relative group",
                    isActive(link.href)
                      ? "text-black"
                      : "text-gray-400 hover:text-black"
                  )}
                >
                  {link.label}
                  <span className={cn(
                    "absolute -bottom-1 left-0 w-full h-[2px] bg-[#D4FF00] transform origin-left transition-transform duration-300",
                    isActive(link.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )} />
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <ChainSelector compact className="pointer-events-auto" />
              {isSignedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="bg-black hover:bg-black/80 text-white font-display font-bold tracking-widest text-xs h-10 px-6 rounded-full border-2 border-transparent hover:border-[#D4FF00] transition-all group gap-2"
                    >
                      <Wallet className="w-4 h-4 text-[#D4FF00]" />
                      {truncateAddress(userAddress || "")}
                      <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer w-full flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        handleDisconnect();
                      }}
                      className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={handleConnect}
                  className="bg-black hover:bg-black/80 text-white font-display font-bold tracking-widest text-xs h-10 px-6 rounded-full border-2 border-transparent hover:border-[#D4FF00] transition-all"
                >
                  <Wallet className="w-4 h-4 mr-2 text-[#D4FF00]" />
                  CONNECT
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-black/5 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {
        isMenuOpen && (
          <div className="absolute top-full left-0 right-0 h-screen bg-white/95 backdrop-blur-xl border-t border-black/5 animate-in slide-in-from-top-4 duration-300 pointer-events-auto">
            <nav className="container mx-auto px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "text-3xl font-display font-black tracking-tighter uppercase transition-colors",
                    isActive(link.href)
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-500"
                      : "text-gray-300 hover:text-black"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex justify-center py-2">
                <ChainSelector />
              </div>
              <div className="pt-8 border-t border-gray-100 mt-4">
                {isSignedIn ? (
                  <div className="flex flex-col gap-3">
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-white border-2 border-black text-black hover:bg-black/5 font-display font-black text-lg h-14 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
                        <User className="w-5 h-5 mr-2" />
                        PROFILE
                      </Button>
                    </Link>
                    <Button
                      onClick={handleDisconnect}
                      className="w-full bg-black text-white hover:bg-black/90 font-display font-black text-lg h-14 rounded-xl shadow-[4px_4px_0px_0px_rgba(212,255,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                    >
                      <LogOut className="w-5 h-5 mr-2 text-[#D4FF00]" />
                      LOG OUT ({truncateAddress(userAddress || "")})
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleConnect();
                    }}
                    className="w-full bg-[#D4FF00] text-black hover:bg-[#b8dd00] font-display font-black text-lg h-14 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                  >
                    <Wallet className="w-5 h-5 mr-2" />
                    CONNECT WALLET
                  </Button>
                )}
              </div>
            </nav >
          </div >
        )
      }
    </header >
  );
};

export default Header;
