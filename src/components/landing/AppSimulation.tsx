import React, { useState, useEffect, useRef } from 'react';
import { Zap, Shield, ChevronRight } from 'lucide-react';

// The "Slide-to-Engage" Component
export const SlideButton = ({ onComplete }: { onComplete: () => void }) => {
    const [dragX, setDragX] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [completed, setCompleted] = useState(false);

    const handleDrag = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        if (completed) return;
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent | React.MouseEvent).clientX;
        const offsetX = Math.max(0, Math.min(clientX - rect.left - 24, rect.width - 48)); // Adjusted for mobile

        setDragX(offsetX);

        // Threshold to trigger
        if (offsetX > rect.width - 60) {
            setCompleted(true);
            onComplete();
        }
    };

    const endDrag = () => {
        if (!completed) setDragX(0);
    };

    return (
        <div
            ref={containerRef}
            className="relative h-12 sm:h-14 md:h-16 bg-[#F3F4F6] rounded-full overflow-hidden select-none touch-none"
            onMouseMove={(e) => e.buttons === 1 && handleDrag(e)}
            onTouchMove={handleDrag}
            onMouseUp={endDrag}
            onTouchEnd={endDrag}
            onMouseLeave={endDrag}
        >
            {/* Background Text */}
            <div className={`absolute inset-0 flex items-center justify-center font-display font-bold text-[10px] sm:text-xs md:text-sm tracking-widest transition-opacity duration-300 ${completed ? 'opacity-0' : 'opacity-40'}`}>
                ||| SLIDE TO ENGAGE |||
            </div>

            {/* Progress Fill */}
            <div
                className="absolute left-0 top-0 h-full bg-black transition-all duration-75"
                style={{ width: `${dragX + 48}px` }}
            />

            {/* The Draggable Handle */}
            <div
                className="absolute top-1 left-1 h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full bg-[#D4FF00] shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-75 z-10"
                style={{ transform: `translateX(${dragX}px)` }}
            >
                {completed ? (
                    <Zap size={20} className="text-black sm:w-6 sm:h-6" />
                ) : (
                    <ChevronRight size={20} className="text-black sm:w-6 sm:h-6" />
                )}
            </div>
        </div>
    );
};

// The Hero/App Simulation Section
const AppSimulation = () => {
    const [speed, setSpeed] = useState(14.2);
    const [active, setActive] = useState(false);

    // Simulate speed fluctuation
    useEffect(() => {
        if (!active) return;
        const interval = setInterval(() => {
            setSpeed(prev => {
                const variance = (Math.random() - 0.5);
                const newSpeed = Math.max(0, Math.min(25, prev + variance));
                return parseFloat(newSpeed.toFixed(1));
            });
        }, 500);
        return () => clearInterval(interval);
    }, [active]);

    // Calculate font weight based on speed (0-20km/h maps to 400-800 weight)
    const fontWeight = Math.min(800, Math.max(400, 400 + (speed * 20)));
    const isSprinting = speed > 10;

    return (
        <section className="relative w-full h-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex flex-col bg-white overflow-hidden border-b border-gray-100">

            {/* 1. TOP STATUS BAR (Transparent) */}
            <div className="absolute top-12 sm:top-16 md:top-24 left-0 w-full px-3 sm:px-4 md:px-6 flex justify-between items-center z-10 pointer-events-none">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#FF2E00] animate-pulse" />
                    <span className="font-display text-[10px] sm:text-xs font-bold tracking-widest">LIVE • 3 RUNNERS</span>
                </div>
                <div className="flex space-x-0.5 sm:space-x-1">
                    {/* Signal Bars */}
                    <div className="w-0.5 sm:w-1 h-2 sm:h-3 bg-black" />
                    <div className="w-0.5 sm:w-1 h-2 sm:h-3 bg-black" />
                    <div className="w-0.5 sm:w-1 h-2 sm:h-3 bg-black" />
                    <div className="w-0.5 sm:w-1 h-2 sm:h-3 bg-black opacity-30" />
                </div>
            </div>

            {/* 2. THE VIEWPORT (Map) */}
            <div className="flex-grow relative bg-map-pattern w-full overflow-hidden min-h-[200px] sm:min-h-[280px]">

                {/* Decorative Map Elements (Blocks) */}
                <div className="absolute top-[20%] sm:top-[25%] left-[8%] sm:left-[10%] w-[12%] sm:w-[15%] h-[15%] sm:h-[20%] bg-[#F3F4F6] border border-gray-200" />
                <div className="absolute top-[28%] sm:top-[33%] right-[8%] sm:right-[10%] w-[20%] sm:w-[25%] h-[20%] sm:h-[25%] bg-[#F3F4F6] border border-gray-200" />
                <div className="absolute bottom-[28%] sm:bottom-[33%] left-[20%] sm:left-[25%] w-[16%] sm:w-[20%] h-[35%] sm:h-[40%] bg-[#F3F4F6] border border-gray-200" />

                {/* The Trail (Thick Black Line) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
                    <path
                        d="M -50 400 Q 100 350 180 500 T 400 450"
                        fill="none"
                        stroke="#09090B"
                        strokeWidth="6"
                        className="sm:stroke-[8]"
                        strokeLinecap="round"
                    />
                </svg>

                {/* Current Position (Pulsing Hyper-Volt) */}
                <div className="absolute top-[57%] left-[46%] transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                        <div className="absolute inset-0 bg-[#D4FF00] rounded-full opacity-40 animate-ping" />
                        <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-[#D4FF00] rounded-full border-2 sm:border-4 border-white shadow-[0_0_0_2px_rgba(204,255,0,0.4)] sm:shadow-[0_0_0_4px_rgba(204,255,0,0.4)]" />
                    </div>
                </div>

                {/* Beacons (Cobalt Nodes) */}
                <div className="absolute top-[35%] right-[15%] sm:right-[20%] flex flex-col items-center opacity-80">
                    <div className="w-0.5 sm:w-1 h-12 sm:h-16 md:h-20 bg-gradient-to-t from-[#0047FF] to-transparent opacity-50" />
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-[#0047FF] rounded-full animate-bounce" />
                </div>
            </div>

            {/* 3. THE ACTION DECK (Bottom Sheet) */}
            <div
                className="relative z-20 bg-white rounded-t-[20px] sm:rounded-t-[25px] md:rounded-t-[30px] pt-4 sm:pt-6 md:pt-8 px-3 sm:px-4 md:px-6 pb-6 sm:pb-8 md:pb-12 w-full shadow-[0_-5px_20px_rgba(0,0,0,0.08)] sm:shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
                style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
            >
                <div className="flex justify-between items-end mb-4 sm:mb-6 md:mb-8">
                    {/* Main Stat: Speed */}
                    <div className="flex flex-col">
                        <span className="font-display text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest mb-0.5 sm:mb-1">Velocity (km/h)</span>
                        <span
                            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none tracking-tighter text-black variable-speed-text"
                            style={{
                                fontWeight: fontWeight,
                                fontStyle: isSprinting ? 'italic' : 'normal',
                                transform: isSprinting ? 'skewX(-10deg)' : 'none'
                            }}
                        >
                            {speed.toFixed(1)}
                        </span>
                    </div>

                    {/* Secondary Stat: Earnings */}
                    <div className="flex flex-col items-end mb-1 sm:mb-2">
                        <span className="font-display text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest mb-0.5 sm:mb-1">Earned (STX)</span>
                        <span className="font-display text-lg sm:text-xl md:text-2xl font-bold text-[#0047FF]">
                            0.05
                        </span>
                    </div>
                </div>

                {/* Controls */}
                {active ? (
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                        <button onClick={() => setActive(false)} className="h-12 sm:h-14 md:h-16 rounded-xl sm:rounded-2xl border-2 border-[#09090B] flex items-center justify-center font-display font-bold text-sm sm:text-base hover:bg-gray-50 transition-colors">
                            PAUSE
                        </button>
                        <button className="h-12 sm:h-14 md:h-16 rounded-xl sm:rounded-2xl bg-[#0047FF] text-white flex items-center justify-center font-display font-bold text-sm sm:text-base shadow-lg shadow-blue-200">
                            <Shield size={16} className="mr-1.5 sm:mr-2 sm:w-5 sm:h-5" />
                            BOOST
                        </button>
                    </div>
                ) : (
                    <SlideButton onComplete={() => setActive(true)} />
                )}
            </div>
        </section>
    );
};

export default AppSimulation;
