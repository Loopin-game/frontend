import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MOCK_POWERUPS } from '@/data/mockData';
import { Shield, Ghost, Scissors, Zap, Loader2, Check } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { SlideUp, StaggerContainer } from '@/components/animation/MotionWrapper';

interface PowerupShopProps {
    walletAddress: string;
    currentBalance: number;
    onPurchaseCompelte: (newBalance: number) => void;
    inventory?: Record<string, number>;
}

const PowerupShop: React.FC<PowerupShopProps> = ({ walletAddress, currentBalance, onPurchaseCompelte, inventory }) => {
    const [purchasingId, setPurchasingId] = useState<string | null>(null);

    const getIcon = (id: string) => {
        switch (id) {
            case 'shield': return <Shield className="w-6 h-6" />;
            case 'ghost': return <Ghost className="w-6 h-6" />;
            case 'sever': return <Scissors className="w-6 h-6" />;
            case 'beacon': return <Zap className="w-6 h-6" />;
            default: return <Zap className="w-6 h-6" />;
        }
    };

    const handleBuy = async (powerup: typeof MOCK_POWERUPS[0]) => {
        if (purchasingId) return;

        const cost = parseFloat(powerup.cost.split(' ')[0]);
        if (cost > currentBalance) {
            alert("Insufficient funds!"); // Replace with better UI
            return;
        }

        setPurchasingId(powerup.id);
        try {
            const playerId = localStorage.getItem('playerId');
            if (!playerId) {
                alert("Please reload page - authenticated session missing");
                return;
            }

            const res = await api.buyPowerup(playerId, powerup.id);
            if (res.success) {
                // Manually deduct balance for UI feel, real balance updates on refresh or interval
                // Or better, trigger a balance refresh callback if we had one
                onPurchaseCompelte(currentBalance - cost);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setPurchasingId(null);
        }
    };

    const purchasable = MOCK_POWERUPS.filter(p => p.cost !== '0 STX');
    const abilities = MOCK_POWERUPS.filter(p => p.cost === '0 STX');

    const PowerupCard = ({ item }: { item: typeof MOCK_POWERUPS[0] }) => {
        const costDetails = item.cost.split(' ');
        const costVal = parseFloat(costDetails[0]);
        const canAfford = currentBalance >= costVal;
        const isFree = costVal === 0;

        return (
            <SlideUp key={item.id} className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 flex flex-col justify-between hover:border-black transition-all duration-300 group hover:-translate-y-1 h-full">
                <div>
                    <div className={cn(
                        "w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4 transition-colors duration-300",
                        isFree ? "bg-black text-white" : "bg-gray-50 group-hover:bg-[#D4FF00]"
                    )}>
                        {getIcon(item.id)}
                    </div>
                    <h3 className="font-display font-bold text-base md:text-lg mb-1 md:mb-2 leading-tight">{item.name}</h3>
                    <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-4 md:mb-6 line-clamp-3">
                        {item.description}
                    </p>
                </div>

                <div className="mt-auto">
                    {!isFree && (
                        <div className="flex items-center justify-between mb-3 md:mb-4">
                            <span className="text-[10px] md:text-xs font-bold text-gray-400 tracking-widest uppercase">COST</span>
                            <span className="font-display font-bold text-sm md:text-base text-black">{item.cost}</span>
                        </div>
                    )}

                    <Button
                        onClick={() => !isFree && handleBuy(item)}
                        disabled={isFree || !!purchasingId || !canAfford}
                        className={cn(
                            "w-full font-bold transition-all h-10 md:h-11 text-xs md:text-sm",
                            isFree
                                ? "bg-gray-100 text-gray-400 hover:bg-gray-100 cursor-default"
                                : canAfford
                                    ? "bg-black text-white hover:bg-[#D4FF00] hover:text-black"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        )}
                    >
                        {purchasingId === item.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            isFree ? "PASSIVE" : "PURCHASE"
                        )}
                    </Button>
                </div>
            </SlideUp>
        );
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="font-display text-lg font-bold uppercase mb-4 text-gray-400 tracking-widest">Shop</h3>
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {purchasable.map(item => <PowerupCard key={item.id} item={item} />)}
                </StaggerContainer>
            </div>

            <div>
                <h3 className="font-display text-lg font-bold uppercase mb-4 text-gray-400 tracking-widest">Abilities</h3>
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {abilities.map(item => <PowerupCard key={item.id} item={item} />)}
                </StaggerContainer>
            </div>
        </div>
    );
};

export default PowerupShop;
