import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SlideUp } from '@/components/animation/MotionWrapper';
import { Wallet, User, Loader2, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { useConnect } from '@stacks/connect-react';
import { userSession } from '@/lib/stacks-auth';
import { connectWallet } from '@/lib/wallet-utils';
import { useChain } from '@/lib/chain-context';

const Register = () => {
    const { authenticate } = useConnect();
    const navigate = useNavigate();
    const { publicKey, connected, connecting, disconnect } = useWallet();
    const { setVisible } = useWalletModal();
    const { setWalletForChain } = useChain();

    const [step, setStep] = useState(1);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const syncSolanaFromAdapter = useCallback(() => {
        if (connected && publicKey) {
            const addr = publicKey.toBase58();
            setWalletForChain('solana', addr);
            setWalletAddress(addr);
            setStep(2);
        }
    }, [connected, publicKey, setWalletForChain]);

    useEffect(() => {
        const loopinWallet = localStorage.getItem('loopin_wallet');
        if (loopinWallet) {
            navigate('/dashboard');
            return;
        }

        if (userSession.isUserSignedIn()) {
            const userData = userSession.loadUserData();
            const address = userData.profile.stxAddress.mainnet;
            setWalletForChain('stacks', address);
            setWalletAddress(address);
            setStep(2);
        }
    }, [navigate, setWalletForChain]);

    useEffect(() => {
        syncSolanaFromAdapter();
    }, [syncSolanaFromAdapter]);

    const handleConnectStacks = () => {
        setIsLoading(true);
        connectWallet(
            authenticate,
            userSession,
            () => {
                if (userSession.isUserSignedIn()) {
                    const userData = userSession.loadUserData();
                    const address = userData.profile.stxAddress.mainnet;
                    setWalletForChain('stacks', address);
                    setWalletAddress(address);
                    setStep(2);
                    setIsLoading(false);
                } else {
                    setIsLoading(false);
                }
            }
        );
    };

    const handleConnectPhantom = async () => {
        setError('');
        try {
            setVisible(true);
        } catch (e: any) {
            setError(e?.message || 'Could not open wallet modal');
        }
    };

    const handleDisconnectSolana = async () => {
        await disconnect();
        setWalletAddress(null);
        setWalletForChain('solana', null);
        setStep(1);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!walletAddress || !username) return;

        setIsLoading(true);
        setError('');
        try {
            const player = await api.authenticate(walletAddress, username);
            localStorage.setItem('playerId', player.id);
            localStorage.setItem('loopin_wallet', walletAddress);
            navigate('/dashboard');
        } catch (err: any) {
            if (err.message && err.message.includes('already exists')) {
                try {
                    const player = await api.authenticate(walletAddress);
                    localStorage.setItem('playerId', player.id);
                    localStorage.setItem('loopin_wallet', walletAddress);
                    navigate('/dashboard');
                } catch {
                    setError('Account exists but login failed');
                }
                return;
            }
            setError(err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const isSolanaFlow = connected && publicKey && walletAddress === publicKey.toBase58();

    return (
        <div className="min-h-screen bg-white text-[#09090B] font-sans selection:bg-[#D4FF00] selection:text-black">
            <Header />

            <main className="pt-32 pb-16 min-h-[80vh] flex items-center justify-center">
                <div className="container mx-auto px-6 max-w-lg">
                    <SlideUp>
                        <div className="bg-white border border-black rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                <User size={200} />
                            </div>

                            <div className="relative z-10">
                                <h1 className="font-display text-4xl md:text-5xl font-black mb-2 uppercase tracking-tighter">
                                    Initialize
                                </h1>
                                <p className="text-gray-500 font-medium mb-10">
                                    {step === 1 ? 'Connect your wallet to begin your journey.' : 'Create your runner identity.'}
                                </p>

                                {step === 1 ? (
                                    <div className="space-y-4">
                                        <Button
                                            onClick={handleConnectStacks}
                                            disabled={isLoading || connecting}
                                            className="w-full h-16 bg-black hover:bg-[#D4FF00] hover:text-black text-white rounded-2xl text-lg font-bold transition-all shadow-lg flex items-center justify-between px-8"
                                        >
                                            <span>CONNECT STACKS</span>
                                            {isLoading ? <Loader2 className="animate-spin" /> : <Wallet />}
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleConnectPhantom}
                                            disabled={connecting}
                                            className="w-full h-16 border-2 border-black rounded-2xl text-lg font-bold flex items-center justify-between px-8 hover:bg-[#9945FF]/10"
                                        >
                                            <span>CONNECT PHANTOM (SOLANA)</span>
                                            {connecting ? <Loader2 className="animate-spin" /> : <span className="text-xl">◎</span>}
                                        </Button>

                                        <p className="text-xs text-center text-gray-400 font-bold uppercase tracking-widest mt-6">
                                            Stacks: Leather, Xverse · Solana: Phantom
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleRegister} className="space-y-6">
                                        {error && (
                                            <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-bold border border-red-100">
                                                {error}
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                                                Wallet Connected
                                            </label>
                                            <div className="w-full bg-gray-100 text-gray-500 px-4 py-3 rounded-xl font-mono text-sm border border-transparent break-all">
                                                {walletAddress}
                                            </div>
                                        </div>

                                        {isSolanaFlow && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                className="text-sm text-gray-500"
                                                onClick={handleDisconnectSolana}
                                            >
                                                Use a different wallet
                                            </Button>
                                        )}

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-black uppercase tracking-widest ml-1">
                                                Username
                                            </label>
                                            <Input
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                placeholder="Enter alias..."
                                                className="h-14 rounded-xl border-gray-200 focus:border-black font-display font-bold text-lg"
                                                autoFocus
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isLoading || !username}
                                            className="w-full h-16 bg-[#D4FF00] hover:bg-black hover:text-white text-black rounded-2xl text-lg font-bold transition-all shadow-lg flex items-center justify-between px-8 mt-8"
                                        >
                                            <span>CREATE PROFILE</span>
                                            {isLoading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </SlideUp>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Register;
