import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Trophy, Medal, Award, Zap, ChevronRight } from 'lucide-react';
import { SlideUp, StaggerContainer, ScaleIn } from '@/components/animation/MotionWrapper';
import {
  MOCK_LEADERBOARD_ALL_TIME,
  MOCK_LEADERBOARD_WEEKLY,
  MOCK_LEADERBOARD_SESSION
} from '@/data/mockData';
import { api } from '@/lib/api';


// --- Helper Component for Counting Animation ---
const CountUpValue = ({ value, className, prefix = '' }: { value: string; className?: string; prefix?: string }) => {
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    // 1. Parse the numeric part and valid suffix from the input string
    // Examples: "45.2 km²", "1,250 STX", "980"
    const match = value.match(/([\d,.]+)(.*)/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const numberPartString = match[1]; // e.g., "1,250" or "45.2"
    const suffix = match[2]; // e.g., " km²" or " STX"

    // Remove commas for parsing
    const targetValue = parseFloat(numberPartString.replace(/,/g, ''));

    if (isNaN(targetValue)) {
      setDisplayValue(value);
      return;
    }

    const duration = 1000; // ms
    const steps = 60;
    const intervalTime = duration / steps;
    const increment = targetValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        current = targetValue;
        clearInterval(timer);
      }

      // Format back to original style
      // Check if original had decimals
      const hasDecimals = numberPartString.includes('.');
      const decimals = hasDecimals ? numberPartString.split('.')[1].length : 0;

      let formattedNumber = current.toFixed(decimals);

      // Re-add commas if original had them (simple heuristic: if > 1000)
      if (targetValue >= 1000) {
        const parts = formattedNumber.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        formattedNumber = parts.join('.');
      }

      setDisplayValue(`${prefix}${formattedNumber}${suffix}`);
    }, intervalTime);

    // Initial set to 0
    setDisplayValue(`${prefix}0${suffix}`);

    return () => clearInterval(timer);
  }, [value, prefix]);

  return <span className={className}>{displayValue}</span>;
};


const Leaderboard = () => {
  const [activeTab, setActiveTab] = React.useState<'all-time' | 'weekly' | 'session'>('all-time');
  const [leaderboardData, setLeaderboardData] = useState<any[]>(MOCK_LEADERBOARD_ALL_TIME);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await api.getLeaderboard(activeTab);
        // Fallback to mocks if empty for now, or just show empty
        if (data && data.length > 0) {
          setLeaderboardData(data);
        } else {
          // Keep default or set empty
          // setLeaderboardData([]); 
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  const handleTabChange = (tab: 'all-time' | 'weekly' | 'session') => {
    if (activeTab === tab) return;
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-white text-[#09090B] selection:bg-[#D4FF00] selection:text-black">
      <Header />

      <main className="pt-32 pb-16">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Hero Section */}
          <div className="mb-16 md:mb-24">
            <SlideUp>
              <h1 className="font-display text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 uppercase">
                Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-400">Rankings</span>
              </h1>
            </SlideUp>
            <SlideUp delay={0.2} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <p className="text-lg text-gray-500 max-w-md leading-relaxed">
                The elite tier of the Loopin network.
                Top territory holders earning meaningful yield.
              </p>

              {/* Tabs */}
              <div className="flex bg-[#F3F4F6] p-1 rounded-full">
                {(['all-time', 'weekly', 'session'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={cn(
                      "px-6 py-2 rounded-full font-display font-bold text-sm tracking-wide transition-all uppercase",
                      activeTab === tab
                        ? "bg-[#09090B] text-[#D4FF00] shadow-lg"
                        : "text-gray-400 hover:text-black"
                    )}
                  >
                    {tab.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </SlideUp>
          </div>

          {/* Podium Section - Animated Key Block */}
          {/* We use the key to force re-mounting of the entire podium block, triggering the count-up animation again */}
          <StaggerContainer key={`${activeTab}-podium`} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 items-end" delay={0.3}>
            {/* 2nd Place */}
            <SlideUp className="order-2 md:order-1 relative group" delay={0.1}>
              <div className="absolute -top-12 -left-4 font-display text-[100px] font-bold text-gray-100 select-none -z-10">2</div>
              <div className="bg-white border border-gray-200 rounded-[32px] p-8 h-[320px] flex flex-col items-center justify-between text-center shadow-lg relative overflow-hidden group-hover:-translate-y-2 transition-transform duration-300">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Medal className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <div className="font-mono text-xs text-gray-400 mb-2 truncate max-w-[150px] mx-auto">{leaderboardData[1].player}</div>
                  <CountUpValue value={leaderboardData[1].area} className="font-display text-4xl font-bold mb-1 block" />
                  <div className="font-bold text-gray-400 text-sm">CAPTURED</div>
                </div>
                <div className="w-full pt-4 border-t border-gray-100">
                  <CountUpValue value={leaderboardData[1].earnings} className="font-display text-xl font-bold text-[#09090B] block" />
                </div>
              </div>
            </SlideUp>

            {/* 1st Place */}
            <ScaleIn className="order-1 md:order-2 relative group" delay={0}>
              <div className="absolute -top-16 -left-4 font-display text-[120px] font-bold text-[#D4FF00]/20 select-none -z-10">1</div>
              <div className="bg-[#09090B] border border-black rounded-[32px] p-8 h-[380px] flex flex-col items-center justify-between text-center shadow-2xl relative overflow-hidden group-hover:-translate-y-2 transition-transform duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#D4FF00]" />
                <div className="w-24 h-24 rounded-full bg-[#D4FF00] flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(212,255,0,0.3)]">
                  <Trophy className="w-10 h-10 text-black" />
                </div>
                <div>
                  <div className="font-mono text-xs text-[#D4FF00] mb-2 truncate max-w-[150px] mx-auto">{leaderboardData[0].player}</div>
                  <CountUpValue value={leaderboardData[0].area} className="font-display text-5xl font-bold text-white mb-2 block" />
                  <div className="font-bold text-gray-500 text-sm tracking-widest">DOMINANCE LEADER</div>
                </div>
                <div className="w-full pt-6 border-t border-white/10">
                  <CountUpValue value={leaderboardData[0].earnings} className="font-display text-3xl font-bold text-[#D4FF00] block" />
                </div>
              </div>
            </ScaleIn>

            {/* 3rd Place */}
            <SlideUp className="order-3 md:order-3 relative group" delay={0.2}>
              <div className="absolute -top-12 -left-4 font-display text-[100px] font-bold text-gray-100 select-none -z-10">3</div>
              <div className="bg-white border border-gray-200 rounded-[32px] p-8 h-[280px] flex flex-col items-center justify-between text-center shadow-lg relative overflow-hidden group-hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <div className="font-mono text-xs text-gray-400 mb-2 truncate max-w-[150px] mx-auto">{leaderboardData[2].player}</div>
                  <CountUpValue value={leaderboardData[2].area} className="font-display text-3xl font-bold mb-1 block" />
                  <div className="font-bold text-gray-400 text-sm">CAPTURED</div>
                </div>
                <div className="w-full pt-4 border-t border-gray-100">
                  <CountUpValue value={leaderboardData[2].earnings} className="font-display text-xl font-bold text-[#09090B] block" />
                </div>
              </div>
            </SlideUp>
          </StaggerContainer>

          {/* Leaderboard List - Animated Key Block */}
          <div key={`${activeTab}-list`} className="max-w-5xl mx-auto">
            <SlideUp delay={0.6} className="flex items-center justify-between mb-8">
              <h2 className="font-display text-3xl font-bold uppercase">Runners List</h2>
              <div className="h-1 flex-1 mx-8 bg-gray-100 rounded-full" />
              <div className="text-xs font-bold text-gray-400 tracking-widest">TOP 100 LISTED</div>
            </SlideUp>

            <StaggerContainer className="space-y-4" delay={0.7}>
              {leaderboardData.slice(3).map((entry, index) => (
                <SlideUp
                  key={entry.rank}
                  className="group relative bg-white border border-gray-100 hover:border-black rounded-2xl p-4 md:p-6 flex items-center transition-all duration-300 hover:shadow-xl"
                >
                  <div className="font-display text-2xl font-bold text-gray-300 w-12 group-hover:text-black transition-colors">
                    {entry.rank}
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                        <Zap size={16} className="text-gray-400 group-hover:text-[#D4FF00] transition-colors" />
                      </div>
                      <span className="font-mono text-sm text-gray-600 font-medium">{entry.player}</span>
                    </div>

                    <div className="flex flex-col md:items-center">
                      <span className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">Territory</span>
                      <CountUpValue value={entry.area} className="font-display text-xl font-bold block" />
                    </div>

                    <div className="flex flex-col md:items-end">
                      <span className="text-xs font-bold text-[#D4FF00] bg-black px-2 py-0.5 rounded tracking-widest uppercase mb-1">Yield</span>
                      <CountUpValue value={entry.earnings} className="font-display text-xl font-bold block" />
                    </div>
                  </div>

                  <div className="hidden md:flex w-12 justify-end">
                    <ChevronRight className="text-gray-300 group-hover:text-black transition-colors" />
                  </div>
                </SlideUp>
              ))}
            </StaggerContainer>

            <div className="mt-12 text-center">
              <Button variant="outline" className="font-display font-bold rounded-full px-8 border-gray-200 hover:bg-black hover:text-[#D4FF00] transition-colors">
                LOAD MORE RUNNERS
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Leaderboard;
