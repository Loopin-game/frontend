import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FadeIn, SlideUp, StaggerContainer } from '@/components/animation/MotionWrapper';

interface RecentGame {
    date: string;
    area: string;
    rank: number;
    prize: string | null;
}

interface RecentActivitySidebarProps {
    recentGames: RecentGame[];
}

const RecentActivitySidebar: React.FC<RecentActivitySidebarProps> = ({ recentGames }) => {
    return (
        <FadeIn delay={0.6} className="mt-8 lg:mt-0">
            <div className="flex items-center justify-between mb-8 md:mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight">Logs</h2>
                <Link to="/profile" className="text-xs font-bold text-gray-400 hover:text-black tracking-widest uppercase border-b border-gray-200 hover:border-black transition-colors pb-0.5">View All</Link>
            </div>

            <div className="bg-[#F8F9FA] rounded-[32px] p-6 border border-gray-100 relative overflow-hidden">
                {/* Decorative Grid */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                        backgroundSize: '20px 20px'
                    }}
                />

                <StaggerContainer className="relative z-10 space-y-3">
                    {recentGames.map((game, index) => (
                        <SlideUp key={index} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between hover:border-black transition-colors duration-300">
                            <div>
                                <div className="text-[10px] font-bold text-gray-400 tracking-widest mb-1">{game.date.toUpperCase()}</div>
                                <div className="font-display text-lg font-bold">{game.area}</div>
                            </div>
                            <div className="text-right">
                                <div className={`font-display text-lg font-black ${game.rank === 1 ? 'text-[#0047FF]' : 'text-gray-300'}`}>
                                    #{game.rank}
                                </div>
                                {game.prize && (
                                    <div className="text-[10px] font-bold text-[#D4FF00] bg-black px-1.5 py-0.5 rounded mt-1">+{game.prize}</div>
                                )}
                            </div>
                        </SlideUp>
                    ))}
                </StaggerContainer>

                <div className="mt-8 space-y-3">
                    <Link to="/leaderboard">
                        <Button className="w-full h-12 bg-white border border-black text-black hover:bg-[#D4FF00] rounded-xl justify-between font-bold text-sm shadow-sm hover:shadow-md transition-all">
                            GLOBAL RANKINGS <ChevronRight size={16} />
                        </Button>
                    </Link>
                    <Link to="/profile">
                        <Button className="w-full h-12 bg-transparent border border-gray-300 text-gray-500 hover:text-black hover:border-black rounded-xl justify-between font-bold text-sm hover:bg-white transition-all">
                            RUNNER SETTINGS <ChevronRight size={16} />
                        </Button>
                    </Link>
                </div>
            </div>
        </FadeIn>
    );
};

export default RecentActivitySidebar;
