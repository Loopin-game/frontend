import React, { useEffect, useState } from 'react';
import { api, RewardStatusResponse } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Gift, Calendar, Check, Loader2 } from 'lucide-react';
import { SlideUp } from '@/components/animation/MotionWrapper';
import { cn } from '@/lib/utils'; // Assuming cn exists, else I'll use template literals

interface DailyRewardCardProps {
    walletAddress: string;
    onRewardClaimed?: (amount: number) => void;
    variant?: 'card' | 'modal';
}

const DailyRewardCard: React.FC<DailyRewardCardProps> = ({ walletAddress, onRewardClaimed, variant = 'card' }) => {
    const [status, setStatus] = useState<RewardStatusResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [claiming, setClaiming] = useState(false);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await api.getDailyRewardStatus(walletAddress);

                // Check localStorage for last claim date as backup
                const lastClaimDate = localStorage.getItem(`daily_drop_${walletAddress}`);
                const today = new Date().toDateString();

                if (lastClaimDate === today) {
                    // Already claimed today (localStorage backup)
                    setStatus({
                        ...res,
                        claimable: false,
                        claimed_today: true
                    });
                } else {
                    setStatus(res);
                }
            } catch (error) {
                console.error("Failed to fetch reward status", error);
            } finally {
                setLoading(false);
            }
        };

        if (walletAddress) {
            fetchStatus();
        }
    }, [walletAddress]);

    const handleClaim = async () => {
        if (!status?.claimable) return;

        // Double-check localStorage before claiming
        const lastClaimDate = localStorage.getItem(`daily_drop_${walletAddress}`);
        const today = new Date().toDateString();

        if (lastClaimDate === today) {
            // Already claimed - just update UI state
            setStatus(prev => prev ? { ...prev, claimable: false, claimed_today: true } : null);
            return;
        }

        setClaiming(true);
        try {
            const res = await api.claimDailyReward(walletAddress);
            if (res.success) {
                // Save claim date to localStorage
                localStorage.setItem(`daily_drop_${walletAddress}`, today);

                setStatus(prev => prev ? {
                    ...prev,
                    claimable: false,
                    claimed_today: true,
                    streak: res.new_streak,
                    next_reward: 100 + ((res.new_streak) * 50) // Estimate next
                } : null);

                if (onRewardClaimed) onRewardClaimed(res.reward_amount);
            }
        } catch (error) {
            console.error("Failed to claim reward", error);
        } finally {
            setClaiming(false);
        }
    };

    if (loading) {
        return (
            <div className={cn(
                "flex items-center justify-center",
                variant === 'card' ? "bg-white border border-gray-200 rounded-[24px] p-6 h-full" : "min-h-[200px]"
            )}>
                <Loader2 className="animate-spin text-gray-400" />
            </div>
        );
    }

    if (!status) return null; // Or error state

    const content = (
        <div className="flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-6 md:mb-8">
                <div className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-colors duration-300",
                    status.claimable ? "bg-[#D4FF00] text-black animate-pulse" : "bg-gray-50 text-gray-400"
                )}>
                    <Gift className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="text-right">
                    <div className="text-[10px] md:text-xs font-bold text-gray-400 tracking-widest uppercase">Day Streak</div>
                    <div className="font-display text-3xl md:text-4xl font-black">{status.streak}</div>
                </div>
            </div>

            <div>
                <h3 className="font-display text-xl md:text-2xl font-bold mb-2">Daily Drop</h3>
                <p className="text-xs md:text-sm text-gray-500 mb-6 font-medium leading-relaxed">
                    {status.claimable
                        ? `You have a pending reward of ${status.next_reward} STX waiting for you. Claim it to keep your streak alive!`
                        : status.claimed_today
                            ? (() => {
                                const now = new Date();
                                const tomorrow = new Date(now);
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                tomorrow.setHours(0, 0, 0, 0);
                                const hoursLeft = Math.floor((tomorrow.getTime() - now.getTime()) / (1000 * 60 * 60));
                                const minutesLeft = Math.floor(((tomorrow.getTime() - now.getTime()) % (1000 * 60 * 60)) / (1000 * 60));
                                return `You've dominated the daily drop today. Next claim in ${hoursLeft}h ${minutesLeft}m.`;
                            })()
                            : "Reward available soon."}
                </p>

                <Button
                    onClick={handleClaim}
                    disabled={!status.claimable || claiming}
                    className={cn(
                        "w-full h-11 md:h-12 font-bold transition-all text-sm tracking-wide",
                        status.claimable
                            ? "bg-black text-[#D4FF00] hover:bg-[#D4FF00] hover:text-black shadow-lg"
                            : "bg-gray-100 text-gray-400 hover:bg-gray-100 cursor-not-allowed"
                    )}
                >
                    {claiming ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : status.claimable ? (
                        "CLAIM REWARD"
                    ) : (
                        <>
                            <Check className="w-4 h-4 mr-2" /> CLAIMED
                        </>
                    )}
                </Button>
            </div>
        </div>
    );

    if (variant === 'modal') {
        return (
            <div className="bg-white p-5 md:p-8">
                <SlideUp>
                    {content}
                </SlideUp>
            </div>
        );
    }

    return (
        <SlideUp className="group relative h-full">
            <div className="absolute inset-0 bg-gray-100 rounded-[24px] transform group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300 -z-10" />
            <div className="bg-white border border-gray-200 group-hover:border-black rounded-[24px] p-6 transition-all duration-300 h-full hover:-translate-y-1">
                {content}
            </div>
        </SlideUp>
    );
};

export default DailyRewardCard;
