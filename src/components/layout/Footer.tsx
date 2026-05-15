import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Zap, Hexagon, Shield, Activity } from 'lucide-react';
import { userSession } from '@/lib/stacks-auth';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  const [isSignedIn, setIsSignedIn] = React.useState(false);

  React.useEffect(() => {
    const loopinWallet = localStorage.getItem('loopin_wallet');
    const isStacksSignedIn = userSession.isUserSignedIn();
    setIsSignedIn(!!loopinWallet || isStacksSignedIn);
  }, []);

  return (
    <footer className={cn("bg-[#09090B] border-t border-white/10 text-white relative overflow-hidden", className)}>
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand Column - Spans 4 columns */}
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <img src="/logo.svg" alt="Loopin" className="w-8 h-8" />
              <span className="font-display font-black text-3xl tracking-tighter text-white group-hover:text-[#D4FF00] transition-colors">
                LOOPIN
              </span>
            </Link>
            <p className="text-gray-500 max-w-sm mb-8 font-mono text-sm leading-relaxed">
              // DECENTRALIZED FITNESS PROTOCOL
              <br />
              Where reality becomes territory. Run, capture, and compete for crypto prizes.
            </p>

            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#D4FF00]/10 rounded-full border border-[#D4FF00]/20">
              <div className="w-2 h-2 bg-[#D4FF00] rounded-full animate-pulse" />
              <span className="font-display text-[10px] font-bold text-[#D4FF00] tracking-widest">SYSTEM ONLINE</span>
            </div>
          </div>

          {/* Spacer */}
          <div className="md:col-span-1" />

          {/* Links Columns */}
          <div className="md:col-span-2">
            <h4 className="font-display font-bold text-lg mb-6 text-white uppercase tracking-wider">Protocol</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/how-to-play" className="text-gray-400 hover:text-[#D4FF00] transition-colors font-medium text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-transparent group-hover:bg-[#D4FF00] rounded-full transition-colors" />
                  How to Play
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-gray-400 hover:text-[#D4FF00] transition-colors font-medium text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-transparent group-hover:bg-[#D4FF00] rounded-full transition-colors" />
                  Leaderboard
                </Link>
              </li>
              {/* Only show Dashboard if signed in, otherwise show Connect or similar if we wanted, 
                  but user asked to remove "Connect Wallet" option when signed in. 
                  Actually, the footer links are generic. Let's make "Mission Control" go to Dashboard if signed in, 
                  or Register if not. 
              */}
              <li>
                <Link to={isSignedIn ? "/dashboard" : "/register"} className="text-gray-400 hover:text-[#D4FF00] transition-colors font-medium text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-transparent group-hover:bg-[#D4FF00] rounded-full transition-colors" />
                  {isSignedIn ? "Mission Control" : "Join the Grid"}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-display font-bold text-lg mb-6 text-white uppercase tracking-wider">Resources</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#D4FF00] transition-colors font-medium text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-transparent group-hover:bg-[#D4FF00] rounded-full transition-colors" />
                  Whitepaper
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#D4FF00] transition-colors font-medium text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-transparent group-hover:bg-[#D4FF00] rounded-full transition-colors" />
                  Smart Contracts
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#D4FF00] transition-colors font-medium text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-transparent group-hover:bg-[#D4FF00] rounded-full transition-colors" />
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-display font-bold text-lg mb-6 text-white uppercase tracking-wider">Network</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#D4FF00] transition-colors font-medium text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-transparent group-hover:bg-[#D4FF00] rounded-full transition-colors" />
                  Twitter / X
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#D4FF00] transition-colors font-medium text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-transparent group-hover:bg-[#D4FF00] rounded-full transition-colors" />
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#D4FF00] transition-colors font-medium text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-transparent group-hover:bg-[#D4FF00] rounded-full transition-colors" />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600 font-mono">
            © 2026 LOOPIN PROTOCOL. ALL RIGHTS RESERVED.
          </p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 tracking-widest uppercase">
              <Shield size={12} />
              <span>Secured by Stacks</span>
            </div>
            <div className="h-3 w-px bg-white/10" />
            <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-wider font-bold">
              Privacy
            </a>
            <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-wider font-bold">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
