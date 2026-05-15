import { AppConfig, UserSession } from '@stacks/connect';

export const isMobileDevice = (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isIOS = (): boolean => {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
};

export const isAndroid = (): boolean => {
    return /Android/i.test(navigator.userAgent);
};

export const showMobileWalletInstructions = () => {
    const message = isIOS()
        ? 'To connect your wallet on mobile:\n\n1. Install Leather Wallet from the App Store\n2. Create or import your wallet\n3. Return to this page and try connecting again\n\nWould you like to go to the App Store now?'
        : 'To connect your wallet on mobile:\n\n1. Install Leather Wallet from the Play Store\n2. Create or import your wallet\n3. Return to this page and try connecting again\n\nWould you like to go to the Play Store now?';

    if (confirm(message)) {
        if (isIOS()) {
            window.location.href = 'https://apps.apple.com/us/app/leather-bitcoin-defi-wallet/id6499127775';
        } else if (isAndroid()) {
            window.location.href = 'https://play.google.com/store/apps/details?id=io.leather.mobilewallet';
        }
    }
};

export const connectWalletMobile = (
    authenticate: any,
    userSession: UserSession,
    onFinish?: () => void
) => {
    // Use the standard Stacks Connect flow
    // On mobile, it will redirect to the wallet app
    // handlePendingSignIn() in App.tsx will catch the return
    console.log('[Mobile Wallet] Using standard Stacks Connect flow...');
    connectWalletDesktop(authenticate, userSession, onFinish);
};

export const connectWalletDesktop = (
    authenticate: any,
    userSession: UserSession,
    onFinish?: () => void
) => {
    console.log('[Wallet] Starting authentication...');
    console.log('[Wallet] Is mobile?', isMobileDevice());
    console.log('[Wallet] User agent:', navigator.userAgent);

    authenticate({
        appDetails: {
            name: "Loopin",
            icon: window.location.origin + "/logo.svg",
        },
        onFinish: (data: any) => {
            console.log('[Wallet] ✅ onFinish called!');
            console.log('[Wallet] Data:', data);

            // Save wallet address to localStorage
            try {
                if (userSession.isUserSignedIn()) {
                    const userData = userSession.loadUserData();

                    // Get network from environment variable or default to testnet
                    const network = import.meta.env.VITE_NETWORK || 'testnet';

                    console.log('[Wallet] 🌐 Network from env:', network);
                    console.log('[Wallet] 📋 Available addresses:', {
                        mainnet: userData.profile.stxAddress.mainnet,
                        testnet: userData.profile.stxAddress.testnet
                    });

                    // Use the appropriate network address
                    const walletAddress = network === 'mainnet'
                        ? userData.profile.stxAddress.mainnet
                        : userData.profile.stxAddress.testnet;

                    console.log(`[Wallet] ✅ Selected ${network.toUpperCase()} address:`, walletAddress);

                    // Save both the address and network
                    localStorage.setItem('loopin_wallet', walletAddress);
                    localStorage.setItem('loopin_network', network);

                    // Also save both addresses for reference
                    localStorage.setItem('loopin_wallet_mainnet', userData.profile.stxAddress.mainnet);
                    localStorage.setItem('loopin_wallet_testnet', userData.profile.stxAddress.testnet);

                    console.log('[Wallet] 💾 Saved to localStorage:', {
                        loopin_wallet: walletAddress,
                        loopin_network: network
                    });
                }
            } catch (error) {
                console.error('[Wallet] ❌ Error saving wallet address:', error);
            }

            if (onFinish) {
                onFinish();
            } else {
                // Reload to update UI
                console.log('[Wallet] 🔄 Reloading page...');
                window.location.reload();
            }
        },
        onCancel: () => {
            console.log('[Wallet] User cancelled connection');
        },
        userSession,
    });
};

export const connectWallet = (
    authenticate: any,
    userSession: UserSession,
    onFinish?: () => void
) => {
    // Use the same authentication flow for both mobile and desktop
    // Stacks Connect will handle the platform-specific behavior:
    // - Desktop: Opens browser extension
    // - Mobile: Redirects to Leather app (if installed) or shows install prompt
    if (isMobileDevice()) {
        connectWalletMobile(authenticate, userSession, onFinish);
    } else {
        connectWalletDesktop(authenticate, userSession, onFinish);
    }
};
