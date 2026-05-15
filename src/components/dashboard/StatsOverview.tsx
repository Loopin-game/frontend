import React from 'react';
import { MapPin, Activity, Trophy, Wallet } from 'lucide-react';
import { SlideUp, StaggerContainer } from '@/components/animation/MotionWrapper';

interface UserStats {
    totalArea: string;
    gamesPlayed: number;
    gamesWon: number;
    totalEarnings: string;
}

interface StatsOverviewProps {
    stats: UserStats;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
    return (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-24" delay={0.4}>
            {/* Stat 1 */}
            <SlideUp className="group relative">
                <div className="absolute inset-0 bg-gray-100 rounded-[24px] md:rounded-[32px] transform group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300 -z-10" />
                <div className="bg-white border border-black rounded-[24px] md:rounded-[32px] p-6 md:p-8 transition-transform duration-300 h-full flex flex-col justify-between hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-[#D4FF00] transition-colors duration-300">
                            <MapPin className="w-5 h-5 md:w-6 md:h-6 text-black" />
                        </div>
                        <span className="font-display text-4xl md:text-5xl font-black text-gray-100 group-hover:text-black/5 transition-colors">01</span>
                    </div>
                    <div>
                        <div className="font-display text-3xl md:text-4xl font-black mb-1">{stats.totalArea}</div>
                        <div className="text-xs font-bold text-gray-400 tracking-widest uppercase">Total Area</div>
                    </div>
                </div>
            </SlideUp>

            {/* Stat 2 */}
            <SlideUp className="group relative">
                <div className="absolute inset-0 bg-gray-100 rounded-[24px] md:rounded-[32px] transform group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300 -z-10" />
                <div className="bg-white border border-gray-200 group-hover:border-black rounded-[24px] md:rounded-[32px] p-6 md:p-8 transition-all duration-300 h-full flex flex-col justify-between hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300">
                            <Activity className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <span className="font-display text-4xl md:text-5xl font-black text-gray-100 group-hover:text-black/5 transition-colors">02</span>
                    </div>
                    <div>
                        <div className="font-display text-3xl md:text-4xl font-black mb-1">{stats.gamesPlayed}</div>
                        <div className="text-xs font-bold text-gray-400 tracking-widest uppercase">Operations</div>
                    </div>
                </div>
            </SlideUp>

            {/* Stat 3 */}
            <SlideUp className="group relative">
                <div className="absolute inset-0 bg-gray-100 rounded-[24px] md:rounded-[32px] transform group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300 -z-10" />
                <div className="bg-white border border-gray-200 group-hover:border-black rounded-[24px] md:rounded-[32px] p-6 md:p-8 transition-all duration-300 h-full flex flex-col justify-between hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-[#D4FF00] transition-colors duration-300">
                            <Trophy className="w-5 h-5 md:w-6 md:h-6 text-black" />
                        </div>
                        <span className="font-display text-4xl md:text-5xl font-black text-gray-100 group-hover:text-black/5 transition-colors">03</span>
                    </div>
                    <div>
                        <div className="font-display text-3xl md:text-4xl font-black mb-1">{stats.gamesWon}</div>
                        <div className="text-xs font-bold text-gray-400 tracking-widest uppercase">Victories</div>
                    </div>
                </div>
            </SlideUp>

            {/* Stat 4 */}
            <SlideUp className="group relative">
                <div className="absolute inset-0 bg-gray-100 rounded-[24px] md:rounded-[32px] transform group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300 -z-10" />
                <div className="bg-[#09090B] border border-black rounded-[24px] md:rounded-[32px] p-6 md:p-8 transition-transform duration-300 h-full flex flex-col justify-between text-white hover:-translate-y-1 shadow-2xl">
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                            <Wallet className="w-5 h-5 md:w-6 md:h-6 text-[#D4FF00]" />
                        </div>
                        <span className="font-display text-4xl md:text-5xl font-black text-white/10">04</span>
                    </div>
                    <div>
                        <div className="font-display text-3xl md:text-4xl font-black mb-1 text-[#D4FF00]">{stats.totalEarnings}</div>
                        <div className="text-xs font-bold text-gray-500 tracking-widest uppercase">Earnings</div>
                    </div>
                </div>
            </SlideUp>
        </StaggerContainer>
    );
};

export default StatsOverview;
