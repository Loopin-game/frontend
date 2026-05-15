/**
 * Solana Wallet Utilities
 * Handles Phantom/Solana wallet connection flow
 * Mirror of wallet-utils.ts for Solana ecosystem
 */

import { WalletName } from '@solana/wallet-adapter-base';

export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Check if Phantom wallet is installed
 */
export const isPhantomInstalled = (): boolean => {
  const phantom = (window as any).phantom?.solana;
  return phantom?.isPhantom === true;
};

/**
 * Get Phantom deep link for mobile
 */
export const getPhantomDeepLink = (redirectUrl: string): string => {
  const encodedUrl = encodeURIComponent(redirectUrl);
  return `https://phantom.app/ul/browse/${encodedUrl}`;
};

/**
 * Show mobile wallet install instructions
 */
export const showMobileWalletInstructions = () => {
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  const message = isIOS
    ? 'To connect your wallet on mobile:\n\n1. Install Phantom Wallet from the App Store\n2. Open this page inside Phantom\'s browser\n3. Connect your wallet\n\nWould you like to go to the App Store now?'
    : 'To connect your wallet on mobile:\n\n1. Install Phantom Wallet from the Play Store\n2. Open this page inside Phantom\'s browser\n3. Connect your wallet\n\nWould you like to go to the Play Store now?';

  if (confirm(message)) {
    if (isIOS) {
      window.location.href = 'https://apps.apple.com/app/phantom-solana-wallet/id1598432977';
    } else {
      window.location.href = 'https://play.google.com/store/apps/details?id=app.phantom';
    }
  }
};

/**
 * Connect Solana wallet using wallet adapter
 * This is called from components that have access to the useWallet hook
 */
export const connectSolanaWallet = async (
  select: (walletName: WalletName) => void,
  connect: () => Promise<void>,
  onSuccess?: (publicKey: string) => void,
  onError?: (error: Error) => void
) => {
  try {
    console.log('[Solana Wallet] Starting connection...');
    console.log('[Solana Wallet] Is mobile?', isMobileDevice());

    if (isMobileDevice() && !isPhantomInstalled()) {
      showMobileWalletInstructions();
      return;
    }

    // Select Phantom wallet
    select('Phantom' as WalletName);

    // Wait for selection then connect
    await connect();

    console.log('[Solana Wallet] ✅ Connected!');
  } catch (error) {
    console.error('[Solana Wallet] ❌ Connection error:', error);
    if (onError) {
      onError(error as Error);
    }
  }
};

/**
 * Disconnect Solana wallet
 */
export const disconnectSolanaWallet = async (
  disconnect: () => Promise<void>
) => {
  try {
    await disconnect();
    localStorage.removeItem('loopin_wallet_solana');
    localStorage.removeItem('loopin_wallet');
    localStorage.removeItem('playerId');
    console.log('[Solana Wallet] ✅ Disconnected');
  } catch (error) {
    console.error('[Solana Wallet] ❌ Disconnect error:', error);
  }
};
