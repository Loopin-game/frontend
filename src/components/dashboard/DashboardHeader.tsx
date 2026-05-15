import React from 'react';
import { Wallet, ExternalLink } from 'lucide-react';
import { SlideUp, ScaleIn, GlitchText } from '@/components/animation/MotionWrapper';

export interface DashboardHeaderProps {
    /** Main wallet balance (STX or SOL depending on chain) */
    primaryBalance: number;
    primarySymbol: string;
    primaryLabel?: string;
    /** SPL $LOOPIN balance when on Solana */
    loopinBalance?: number | null;
    /** Bags API: formatted lifetime fees string */
    bagsFeesFormatted?: string | null;
    /** Link to token on Bags */
    bagsTokenUrl?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    primaryBalance,
    primarySymbol,
    primaryLabel = 'Available Balance',
    loopinBalance,
    bagsFeesFormatted,
    bagsTokenUrl,
}) => {
    return (
        <div className="mb-12 md:mb-24">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-8 md:mb-12">
                <SlideUp>
                    <h1 className="font-display text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-4 md:mb-6 uppercase">
                        <GlitchText text="COMMAND" /> <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-400">
                            <GlitchText text="CENTER" delay={0.3} />
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 font-medium max-w-md leading-relaxed">
                        Welcome back, Runner. Your territory is waiting.
                    </p>
                </SlideUp>

                <ScaleIn delay={0.2} className="bg-[#09090B] p-1.5 rounded-3xl md:rounded-full w-full md:w-auto flex flex-col gap-2">
                    <div className="px-6 md:px-8 py-4 rounded-3xl md:rounded-full bg-[#09090B] border border-white/10 flex items-center justify-between md:justify-start gap-5 shadow-2xl">
                        <div className="flex items-center gap-5">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#D4FF00] flex items-center justify-center animate-pulse shrink-0">
                                <Wallet className="w-5 h-5 md:w-6 md:h-6 text-black" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-0.5">{primaryLabel}</div>
                                <div className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight">
                                    {primaryBalance.toFixed(primarySymbol === 'STX' ? 1 : 4)} {primarySymbol}
                                </div>
                            </div>
                        </div>
                    </div>

                    {(loopinBalance != null && loopinBalance >= 0) || bagsFeesFormatted ? (
                        <div className="px-6 md:px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-gray-300 space-y-1">
                            {loopinBalance != null && (
                                <div className="flex justify-between gap-4">
                                    <span className="text-gray-500">$LOOPIN</span>
                                    <span className="font-mono text-white">{loopinBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                                </div>
                            )}
                            {bagsFeesFormatted && (
                                <div className="flex justify-between gap-4">
                                    <span className="text-gray-500">Token fees (Bags)</span>
                                    <span className="font-mono text-[#D4FF00]">{bagsFeesFormatted}</span>
                                </div>
                            )}
                            {bagsTokenUrl && (
                                <a
                                    href={bagsTokenUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-[#9945FF] hover:underline mt-1"
                                >
                                    View on Bags <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                        </div>
                    ) : null}
                </ScaleIn>
            </div>

            <SlideUp delay={0.3} className="h-px w-full bg-gray-200">
                {null}
            </SlideUp>
        </div>
    );
};

export default DashboardHeader;
