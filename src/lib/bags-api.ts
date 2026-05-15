/**
 * Bags.fm API Client
 * Integrates with Bags platform for $LOOPIN token operations
 * 
 * Docs: https://docs.bags.fm/
 * Base URL: https://public-api-v2.bags.fm/api/v1
 */

const BAGS_API_BASE = 'https://public-api-v2.bags.fm/api/v1';
const BAGS_API_KEY = import.meta.env.VITE_BAGS_API_KEY || '';
const LOOPIN_TOKEN_MINT = import.meta.env.VITE_LOOPIN_TOKEN_MINT || 'GnPwqMJiHCVoQ1KrunqNz9JJV4jXh7cYjjLvue3zBAGS';

interface BagsHeaders {
  'x-api-key': string;
  'Content-Type': string;
}

function getHeaders(): BagsHeaders {
  return {
    'x-api-key': BAGS_API_KEY,
    'Content-Type': 'application/json',
  };
}

// ─────────────────────────────────────────────────────────────
// Token Info
// ─────────────────────────────────────────────────────────────

export interface TokenInfo {
  mint: string;
  name: string;
  symbol: string;
  description: string;
  image: string;
  lifetimeFees: number;
}

/**
 * Get $LOOPIN token lifetime fees (total volume indicator)
 */
export async function getTokenLifetimeFees(): Promise<{
  totalFees: number;
  formattedFees: string;
} | null> {
  if (!LOOPIN_TOKEN_MINT) {
    console.warn('[Bags] No LOOPIN_TOKEN_MINT configured');
    return null;
  }

  try {
    const res = await fetch(
      `${BAGS_API_BASE}/token/${LOOPIN_TOKEN_MINT}/lifetime-fees`,
      { headers: getHeaders() }
    );

    if (!res.ok) throw new Error(`Bags API error: ${res.status}`);
    const data = await res.json();

    return {
      totalFees: data.totalFees || 0,
      formattedFees: formatSOLAmount(data.totalFees || 0),
    };
  } catch (error) {
    console.error('[Bags] Error fetching lifetime fees:', error);
    return null;
  }
}

/**
 * Get token creators/deployers
 */
export async function getTokenCreators(): Promise<Array<{
  wallet: string;
  username?: string;
  provider?: string;
}>> {
  if (!LOOPIN_TOKEN_MINT) return [];

  try {
    const res = await fetch(
      `${BAGS_API_BASE}/token/${LOOPIN_TOKEN_MINT}/creators`,
      { headers: getHeaders() }
    );

    if (!res.ok) throw new Error(`Bags API error: ${res.status}`);
    const data = await res.json();
    return data.creators || [];
  } catch (error) {
    console.error('[Bags] Error fetching creators:', error);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────
// Trading
// ─────────────────────────────────────────────────────────────

export interface TradeQuote {
  inputMint: string;
  outputMint: string;
  inputAmount: number;
  outputAmount: number;
  priceImpact: number;
  slippage: number;
}

/**
 * Get a trade quote for buying/selling $LOOPIN
 */
export async function getTradeQuote(
  inputMint: string,
  outputMint: string,
  amount: number,
  slippageBps: number = 100 // 1%
): Promise<TradeQuote | null> {
  try {
    const res = await fetch(
      `${BAGS_API_BASE}/trade/quote?` +
      `inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`,
      { headers: getHeaders() }
    );

    if (!res.ok) throw new Error(`Bags API error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('[Bags] Error getting trade quote:', error);
    return null;
  }
}

/**
 * Create a swap transaction (needs to be signed by user wallet)
 */
export async function createSwapTransaction(
  quoteId: string,
  userPublicKey: string
): Promise<{ transaction: string } | null> {
  try {
    const res = await fetch(`${BAGS_API_BASE}/trade/swap`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        quoteId,
        userPublicKey,
      }),
    });

    if (!res.ok) throw new Error(`Bags API error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('[Bags] Error creating swap:', error);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Token Launch Feed
// ─────────────────────────────────────────────────────────────

export interface TokenLaunch {
  mint: string;
  name: string;
  symbol: string;
  image: string;
  status: string;
  createdAt: string;
}

/**
 * Get the token launch feed (recent launches)
 */
export async function getTokenLaunchFeed(limit: number = 20): Promise<TokenLaunch[]> {
  try {
    const res = await fetch(
      `${BAGS_API_BASE}/token/feed?limit=${limit}`,
      { headers: getHeaders() }
    );

    if (!res.ok) throw new Error(`Bags API error: ${res.status}`);
    const data = await res.json();
    return data.tokens || [];
  } catch (error) {
    console.error('[Bags] Error fetching launch feed:', error);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────
// Fee Sharing / Claims
// ─────────────────────────────────────────────────────────────

/**
 * Get claimable fee positions for a wallet
 */
export async function getClaimablePositions(walletAddress: string): Promise<Array<{
  tokenMint: string;
  claimableAmount: number;
}>> {
  try {
    const res = await fetch(
      `${BAGS_API_BASE}/claim/positions?wallet=${walletAddress}`,
      { headers: getHeaders() }
    );

    if (!res.ok) throw new Error(`Bags API error: ${res.status}`);
    const data = await res.json();
    return data.positions || [];
  } catch (error) {
    console.error('[Bags] Error fetching claimable positions:', error);
    return [];
  }
}

/**
 * Get claim events for $LOOPIN token
 */
export async function getTokenClaimEvents(limit: number = 20): Promise<Array<{
  claimer: string;
  amount: number;
  timestamp: string;
}>> {
  if (!LOOPIN_TOKEN_MINT) return [];

  try {
    const res = await fetch(
      `${BAGS_API_BASE}/token/${LOOPIN_TOKEN_MINT}/claim-events?limit=${limit}`,
      { headers: getHeaders() }
    );

    if (!res.ok) throw new Error(`Bags API error: ${res.status}`);
    const data = await res.json();
    return data.events || [];
  } catch (error) {
    console.error('[Bags] Error fetching claim events:', error);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────
// Pool Info
// ─────────────────────────────────────────────────────────────

/**
 * Get Bags pool info for $LOOPIN token
 */
export async function getTokenPool(): Promise<{
  poolKey: string;
  tokenMint: string;
  dammV2PoolKey?: string;
} | null> {
  if (!LOOPIN_TOKEN_MINT) return null;

  try {
    const res = await fetch(
      `${BAGS_API_BASE}/pool/token/${LOOPIN_TOKEN_MINT}`,
      { headers: getHeaders() }
    );

    if (!res.ok) throw new Error(`Bags API error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('[Bags] Error fetching pool info:', error);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────

/**
 * Format SOL amount for display
 */
function formatSOLAmount(lamports: number): string {
  const sol = lamports / 1_000_000_000;
  return sol.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }) + ' SOL';
}

/**
 * Get the $LOOPIN token mint address
 */
export function getLOOPINMint(): string {
  return LOOPIN_TOKEN_MINT;
}

/**
 * Get the Bags token page URL for $LOOPIN
 */
export function getLOOPINBagsUrl(): string {
  return `https://bags.fm/${LOOPIN_TOKEN_MINT}`;
}

/**
 * Check if Bags API is configured
 */
export function isBagsConfigured(): boolean {
  return !!BAGS_API_KEY && !!LOOPIN_TOKEN_MINT;
}
