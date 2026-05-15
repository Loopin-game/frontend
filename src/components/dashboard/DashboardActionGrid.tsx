
import React from 'react';
import { Gift, Zap, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { SlideUp } from '@/components/animation/MotionWrapper';
import PowerupShop from './PowerupShop';
import DailyRewardCard from './DailyRewardCard';

interface DashboardActionGridProps {
    walletAddress: string;
    currentBalance: number;
    onBalanceUpdate: (newBalance: number) => void;
    onRewardClaimed: (amount: number) => void;
    inventory: Record<string, number>;
}

const DashboardActionGrid: React.FC<DashboardActionGridProps> = ({
    walletAddress,
    currentBalance,
    onBalanceUpdate,
    onRewardClaimed,
    inventory
}) => {
    // Check if on testnet (free rewards only on testnet)
    const isTestnet = import.meta.env.VITE_NETWORK === 'testnet';

    return (
        <div className={`grid ${isTestnet ? 'grid-cols-2' : 'grid-cols-1'} gap-3 md:gap-6 mb-8`}>
            {/* Daily Reward - ONLY ON TESTNET */}
            {isTestnet && (
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="cursor-pointer group h-full">
                            <SlideUp className="h-full bg-white border border-gray-200 hover:border-black rounded-[32px] p-6 md:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-black group-hover:bg-[#D4FF00] transition-colors">
                                        <Gift className="w-6 h-6" />
                                    </div>
                                    <div className="text-[10px] font-bold bg-gray-100 px-3 py-1.5 rounded-full text-gray-500 uppercase tracking-widest group-hover:bg-black group-hover:text-[#D4FF00] transition-colors">
                                        Free
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-display text-xl font-bold uppercase leading-none mb-2">Daily Drop</h3>
                                    <p className="text-gray-400 text-sm font-medium line-clamp-1">Claim STX supply.</p>
                                </div>
                            </SlideUp>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-[425px] p-0 bg-transparent border-none shadow-none focus:outline-none [&>button]:hidden">
                        <div className="bg-white rounded-[32px] overflow-hidden p-1 shadow-2xl relative">
                            <DialogClose className="absolute right-4 top-4 z-50 p-2 bg-gray-100 hover:bg-[#D4FF00] rounded-full transition-colors">
                                <X className="w-4 h-4 text-black" />
                            </DialogClose>
                            <DailyRewardCard walletAddress={walletAddress} onRewardClaimed={onRewardClaimed} variant="modal" />
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* Arsenal Trigger */}
            <Dialog>
                <DialogTrigger asChild>
                    <div className="cursor-pointer group h-full">
                        <SlideUp delay={0.1} className="h-full bg-[#09090B] border border-black hover:border-[#D4FF00] rounded-[32px] p-6 md:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#D4FF00] group-hover:bg-[#D4FF00] group-hover:text-black transition-colors">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <div className="text-[10px] font-bold bg-white/10 px-3 py-1.5 rounded-full text-gray-400 uppercase tracking-widest group-hover:bg-[#D4FF00] group-hover:text-black transition-colors">
                                    Shop
                                </div>
                            </div>

                            <div>
                                <h3 className="font-display text-xl font-bold uppercase leading-none mb-2 text-white">Arsenal</h3>
                                <p className="text-gray-500 text-sm font-medium line-clamp-1">Equip powerups.</p>
                            </div>
                        </SlideUp>
                    </div>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-[800px] bg-white rounded-[32px] p-0 border-2 border-black focus:outline-none [&>button]:hidden flex flex-col max-h-[85vh] overflow-hidden">
                    {/* Fixed Header */}
                    <div className="p-5 md:p-8 pb-2 md:pb-4 flex-shrink-0 bg-white z-20 border-b border-gray-100">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
                                <div>
                                    <h2 className="font-display text-2xl md:text-3xl font-black uppercase tracking-tight">Arsenal</h2>
                                    <p className="text-gray-500 text-sm font-medium">Dominate the grid with superior tech.</p>
                                </div>
                                <div className="self-start md:self-center px-4 py-2 bg-gray-100 rounded-full font-bold text-sm border border-gray-200">
                                    Balance: <span className="text-black">{currentBalance.toFixed(1)} STX</span>
                                </div>
                            </div>
                            <DialogClose className="p-2 bg-gray-100 hover:bg-black hover:text-white rounded-full transition-colors shrink-0">
                                <X className="w-5 h-5" />
                            </DialogClose>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto p-5 md:p-8 pt-4 space-y-8 scroll-smooth">
                        <PowerupShop
                            walletAddress={walletAddress}
                            currentBalance={currentBalance}
                            onPurchaseCompelte={onBalanceUpdate}
                            inventory={inventory}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DashboardActionGrid;
