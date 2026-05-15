import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import {
    Wallet,
    MapPin,
    Crosshair,
    Shield,
    Eye,
    Trophy,
    ChevronDown,
    ChevronUp,
    Zap
} from 'lucide-react';
import { isConnected, connect } from '@stacks/connect';
import { userSession } from '@/lib/stacks-auth';
import { cn } from '@/lib/utils';
import { MOCK_FAQS, MOCK_POWERUPS } from '@/data/mockData';
import { SlideUp, StaggerContainer, ScaleIn, GlitchText } from '@/components/animation/MotionWrapper';

const HowToPlay = () => {
    const [openFaq, setOpenFaq] = React.useState<number | null>(null);
    const [isSignedIn, setIsSignedIn] = React.useState(false);

    const faqs = MOCK_FAQS;
    const powerUps = MOCK_POWERUPS;

    React.useEffect(() => {
        // Check for Stacks session first - this is the source of truth
        if (userSession.isUserSignedIn()) {
            setIsSignedIn(true);
        } else {
            setIsSignedIn(false);
            // Clear stale data if any
            localStorage.removeItem('loopin_wallet');
        }
    }, []);

    const getPowerUpIcon = (id: string) => {
        switch (id) {
            case 'shield': return <Shield className="text-[#0047FF]" size={32} />;
            case 'ghost': return <Eye className="text-gray-600" size={32} />;
            case 'sever': return <Crosshair size={32} />;
            case 'beacon': return <Zap size={32} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-white text-[#09090B] selection:bg-[#D4FF00] selection:text-black font-sans">
            <Header />

            {/* 1. HERO: The Protocol */}
            <main className="pt-24 md:pt-32 pb-16">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="mb-12 md:mb-24 text-center">
                        <SlideUp>
                            <div className="inline-block px-4 py-1 rounded-full border border-black/10 bg-gray-50 text-gray-500 font-display text-xs font-bold tracking-widest mb-6 uppercase">
                                Operational Manual v1.0
                            </div>
                            <h1 className="font-display text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6 uppercase">
                                <GlitchText text="MASTER THE" /> <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4FF00] to-black">
                                    <GlitchText text="GRID" delay={0.3} />
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
                                Loopin is not just running. It is a high-speed territory control protocol.
                                Learn the rules. Control the map. Secure the bag.
                            </p>
                        </SlideUp>
                    </div>

                    {/* 2. CORE MECHANICS */}
                    <section className="mb-24">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight">Core Protocol</h2>
                            <div className="h-px flex-1 bg-gray-200 ml-8"></div>
                        </div>

                        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" delay={0.2}>
                            {/* Step 1 */}
                            <SlideUp className="group relative">
                                <div className="absolute inset-0 bg-gray-100 rounded-[32px] transform group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300 -z-10" />
                                <div className="bg-white border border-gray-200 group-hover:border-black rounded-[32px] p-8 transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-14 h-14 rounded-2xl bg-[#0047FF]/10 flex items-center justify-center group-hover:bg-[#0047FF] transition-colors duration-300">
                                            <Wallet className="w-7 h-7 text-[#0047FF] group-hover:text-white transition-colors" />
                                        </div>
                                        <span className="font-display text-6xl font-black text-gray-100 group-hover:text-black/5 transition-colors">01</span>
                                    </div>
                                    <h3 className="font-display text-2xl font-bold mb-4">Connect & Load</h3>
                                    <p className="text-gray-500 leading-relaxed mb-6 flex-1">
                                        Link your Hiro Wallet. You need STX to pay entry fees and buy power-ups.
                                    </p>
                                    <div className="pt-6 border-t border-gray-100">
                                        <div className="font-bold text-[#0047FF] text-sm tracking-wide uppercase">Required: 1 STX</div>
                                    </div>
                                </div>
                            </SlideUp>

                            {/* Step 2 */}
                            <SlideUp className="group relative">
                                <div className="absolute inset-0 bg-gray-100 rounded-[32px] transform group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300 -z-10" />
                                <div className="bg-white border border-gray-200 group-hover:border-black rounded-[32px] p-8 transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-14 h-14 rounded-2xl bg-[#D4FF00]/20 flex items-center justify-center group-hover:bg-[#D4FF00] transition-colors duration-300">
                                            <MapPin className="w-7 h-7 text-black" />
                                        </div>
                                        <span className="font-display text-6xl font-black text-gray-100 group-hover:text-black/5 transition-colors">02</span>
                                    </div>
                                    <h3 className="font-display text-2xl font-bold mb-4">Run & Loop</h3>
                                    <p className="text-gray-500 leading-relaxed mb-6 flex-1">
                                        Move physically. Close loops to capture territory. The bigger the loop, the more you own.
                                    </p>
                                    <div className="pt-6 border-t border-gray-100">
                                        <div className="font-bold text-black text-sm tracking-wide uppercase">1km² = 100 PTS</div>
                                    </div>
                                </div>
                            </SlideUp>

                            {/* Step 3: Safe Points */}
                            <SlideUp className="group relative">
                                <div className="absolute inset-0 bg-gray-100 rounded-[32px] transform group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300 -z-10" />
                                <div className="bg-white border border-gray-200 group-hover:border-black rounded-[32px] p-8 transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-14 h-14 rounded-2xl bg-[#D4FF00]/20 flex items-center justify-center group-hover:bg-[#D4FF00] transition-colors duration-300">
                                            <Shield className="w-7 h-7 text-black" />
                                        </div>
                                        <span className="font-display text-6xl font-black text-gray-100 group-hover:text-black/5 transition-colors">03</span>
                                    </div>
                                    <h3 className="font-display text-2xl font-bold mb-4">Secure & Bank</h3>
                                    <p className="text-gray-500 leading-relaxed mb-6 flex-1">
                                        Visit Safe Points to bank your trail. If your trail is cut before banking, you lose it.
                                    </p>
                                    <div className="pt-6 border-t border-gray-100">
                                        <div className="font-bold text-[#0047FF] text-sm tracking-wide uppercase">CHECKPOINT</div>
                                    </div>
                                </div>
                            </SlideUp>

                            {/* Step 4: Dominate */}
                            <SlideUp className="group relative">
                                <div className="absolute inset-0 bg-gray-100 rounded-[32px] transform group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300 -z-10" />
                                <div className="bg-white border border-gray-200 group-hover:border-black rounded-[32px] p-8 transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-14 h-14 rounded-2xl bg-black/5 flex items-center justify-center group-hover:bg-black transition-colors duration-300">
                                            <Trophy className="w-7 h-7 text-black group-hover:text-[#D4FF00] transition-colors" />
                                        </div>
                                        <span className="font-display text-6xl font-black text-gray-100 group-hover:text-black/5 transition-colors">04</span>
                                    </div>
                                    <h3 className="font-display text-2xl font-bold mb-4">Dominate</h3>
                                    <p className="text-gray-500 leading-relaxed mb-6 flex-1">
                                        When the 15-minute timer ends, the player with the most territory takes the pot.
                                    </p>
                                    <div className="pt-6 border-t border-gray-100">
                                        <div className="font-bold text-gray-400 text-sm tracking-wide uppercase">Winner Takes All</div>
                                    </div>
                                </div>
                            </SlideUp>
                        </StaggerContainer>
                    </section>

                    {/* 3. TACTICS & ARSENAL */}
                    <section className="mb-24">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight">Tactical Arsenal</h2>
                            <div className="h-px flex-1 bg-gray-200 ml-8"></div>
                        </div>

                        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6" delay={0.4}>
                            {powerUps.map((powerUp) => (
                                <ScaleIn key={powerUp.id} className="group relative">
                                    <div className="absolute inset-0 bg-gray-100 rounded-[32px] transform group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300 -z-10" />
                                    <div className="bg-white border border-gray-200 group-hover:border-black rounded-[32px] p-8 transition-all duration-300 h-full hover:-translate-y-1 flex flex-col md:flex-row gap-6 items-start md:items-center">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            {getPowerUpIcon(powerUp.id)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="font-display text-xl font-bold uppercase">{powerUp.name}</h3>
                                                <span className={cn(
                                                    "font-display text-sm font-bold px-3 py-1 rounded-full",
                                                    powerUp.cost === '0 STX' ? "bg-[#D4FF00] text-black" : "bg-black text-white"
                                                )}>
                                                    {powerUp.cost}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 text-sm leading-relaxed">
                                                {powerUp.description}
                                            </p>
                                        </div>
                                    </div>
                                </ScaleIn>
                            ))}
                        </StaggerContainer>
                    </section>

                    {/* 4. FAQ */}
                    <section className="mb-24">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight">System FAQ</h2>
                            <div className="h-px flex-1 bg-gray-200 ml-8"></div>
                        </div>

                        <div className="max-w-3xl mx-auto">
                            <StaggerContainer className="space-y-4" delay={0.6}>
                                {faqs.map((faq, index) => (
                                    <SlideUp
                                        key={index}
                                        className="group border border-gray-200 rounded-[24px] overflow-hidden hover:border-black transition-colors bg-white"
                                        delay={0}
                                    >
                                        <button
                                            className="w-full p-6 flex items-center justify-between text-left bg-white"
                                            onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        >
                                            <span className="font-display text-lg font-bold pr-8 uppercase">{faq.question}</span>
                                            {openFaq === index ? (
                                                <ChevronUp className="w-5 h-5 flex-shrink-0 text-black" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 flex-shrink-0 text-gray-400 group-hover:text-black transition-colors" />
                                            )}
                                        </button>
                                        {openFaq === index && (
                                            <div className="px-6 pb-6 pt-0">
                                                <p className="text-gray-500 leading-relaxed border-t border-gray-100 pt-4">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        )}
                                    </SlideUp>
                                ))}
                            </StaggerContainer>
                        </div>
                    </section>

                    {/* 5. CTA */}
                    <section className="relative rounded-[40px] bg-[#09090B] overflow-hidden text-center py-20 px-6">
                        <div className="absolute inset-0 opacity-20"
                            style={{
                                backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
                                backgroundSize: '40px 40px'
                            }}
                        />
                        <div className="relative z-10">
                            <h2 className="font-display text-5xl md:text-7xl font-black tracking-tighter mb-8 text-white uppercase">
                                Ready to <span className="text-[#D4FF00]">Run?</span>
                            </h2>
                            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
                                The grid is waiting. The prize pool is live.
                            </p>
                            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                                {!isSignedIn && (
                                    <Button
                                        variant="default"
                                        size="xl"
                                        className="h-16 px-10 text-lg bg-[#D4FF00] text-black hover:bg-[#b8dd00] font-display font-bold rounded-full shadow-[0_0_20px_rgba(212,255,0,0.3)] transition-transform hover:scale-105"
                                        onClick={async () => {
                                            try {
                                                const response = await connect({
                                                    network: 'mainnet',
                                                    appDetails: {
                                                        name: "Loopin",
                                                        icon: "https://loopin.game/logo.svg",
                                                    },
                                                    walletConnect: {
                                                        projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
                                                        metadata: {
                                                            name: "Loopin",
                                                            description: "Loopin Game",
                                                            url: "https://loopin.game",
                                                            icons: ["https://loopin.game/logo.svg"],
                                                        },
                                                    },
                                                } as any);

                                                if (response && response.addresses) {
                                                    const stxAddress = response.addresses.find((a: any) => a.symbol === 'STX' || a.address.startsWith('S'))?.address;

                                                    if (stxAddress) {
                                                        const sessionData = userSession.store.getSessionData();
                                                        const userData = sessionData.userData || { profile: {} };
                                                        userData.profile = userData.profile || {};
                                                        userData.profile.stxAddress = {
                                                            mainnet: stxAddress,
                                                            testnet: stxAddress
                                                        };

                                                        userSession.store.setSessionData({
                                                            ...sessionData,
                                                            userData
                                                        });

                                                        window.location.reload();
                                                    }
                                                }
                                            } catch (e) {
                                                console.error("Connect error:", e);
                                            }
                                        }}
                                    >
                                        CONNECT WALLET
                                    </Button>
                                )}
                                <Link to="/dashboard">
                                    <Button
                                        variant="outline"
                                        size="xl"
                                        className="h-16 px-10 text-lg border-white/20 text-white hover:bg-white/10 font-display font-bold rounded-full"
                                    >
                                        BROWSE SESSIONS
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </section>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default HowToPlay;
