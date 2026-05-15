/**
 * Network utilities for Loopin
 * Handles switching between mainnet and testnet
 */

export type Network = 'mainnet' | 'testnet';

/**
 * Get current network from environment or localStorage
 */
export function getCurrentNetwork(): Network {
    // Check localStorage first (user preference)
    const storedNetwork = localStorage.getItem('loopin_network');
    if (storedNetwork === 'mainnet' || storedNetwork === 'testnet') {
        return storedNetwork;
    }

    // Fall back to environment variable
    const envNetwork = import.meta.env.VITE_NETWORK;
    return envNetwork === 'mainnet' ? 'mainnet' : 'testnet';
}

/**
 * Get wallet address for current network
 */
export function getCurrentWalletAddress(): string | null {
    const network = getCurrentNetwork();
    const address = localStorage.getItem('loopin_wallet');

    // Verify it matches the current network
    const mainnetAddr = localStorage.getItem('loopin_wallet_mainnet');
    const testnetAddr = localStorage.getItem('loopin_wallet_testnet');

    if (network === 'mainnet' && address === mainnetAddr) {
        return address;
    }
    if (network === 'testnet' && address === testnetAddr) {
        return address;
    }

    // If mismatch, return the correct one
    return network === 'mainnet' ? mainnetAddr : testnetAddr;
}

/**
 * Switch network and update wallet address
 */
export function switchNetwork(network: Network): void {
    const mainnetAddr = localStorage.getItem('loopin_wallet_mainnet');
    const testnetAddr = localStorage.getItem('loopin_wallet_testnet');

    const newAddress = network === 'mainnet' ? mainnetAddr : testnetAddr;

    if (newAddress) {
        localStorage.setItem('loopin_network', network);
        localStorage.setItem('loopin_wallet', newAddress);

        console.log(`[Network] Switched to ${network.toUpperCase()}`);
        console.log(`[Network] Using address: ${newAddress}`);

        // Reload to update UI
        window.location.reload();
    } else {
        console.error(`[Network] No ${network} address found. Please reconnect wallet.`);
    }
}

/**
 * Get network display info
 */
export function getNetworkInfo(network: Network) {
    return {
        mainnet: {
            name: 'Mainnet',
            prefix: 'SP',
            color: '#5546FF',
            explorer: 'https://explorer.hiro.so'
        },
        testnet: {
            name: 'Testnet',
            prefix: 'ST',
            color: '#FF6B35',
            explorer: 'https://explorer.hiro.so/?chain=testnet'
        }
    }[network];
}
