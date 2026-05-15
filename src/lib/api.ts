const API_BASE = import.meta.env.VITE_API_BASE || 'https://loopin-k2ph.onrender.com/api';

export interface Game {
    id: string;
    status: string;
    game_type: string;
    entry_fee: number;
    prize_pool: number;
    players: number;
    time_remaining: string;
}

export interface PlayerProfile {
    id: string;
    wallet_address: string;
    username: string;
    avatar_seed: string;
    level: number;
    joined_at: string;
    stats?: {
        total_area: number;
        games_played: number;
        games_won: number;
        total_earnings: number;
    };
    inventory?: Record<string, number>; // itemId -> quantity
}

export interface RewardStatusResponse {
    streak: number;
    claimable: boolean;
    next_reward: number;
    claimed_today: boolean;
    last_claimed_at: string | null;
}

export interface ClaimResponse {
    success: boolean;
    reward_amount: number;
    new_streak: number;
    new_total_earnings: number;
}

export const api = {
    /**
     * Authenticate user - tries login first, registers if not found
     * Returns player UUID needed for WebSocket
     */
    authenticate: async (walletAddress: string, username?: string): Promise<{
        id: string;
        wallet_address: string;
        username: string;
    }> => {
        // 1. Try Login
        try {
            const loginRes = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ wallet_address: walletAddress })
            });

            if (loginRes.ok) {
                const json = await loginRes.json();
                return json.data;
            }

            // 2. If 404, register
            if (loginRes.status === 404) {
                const registerRes = await fetch(`${API_BASE}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        wallet_address: walletAddress,
                        username: username || `Player_${walletAddress.slice(0, 6)}`
                    })
                });

                const json = await registerRes.json();
                if (!json.success) throw new Error(json.error);
                return json.data;
            }

            throw new Error('Authentication failed');
        } catch (error) {
            console.error('Auth error:', error);
            throw error;
        }
    },

    getLobby: async (): Promise<Game[]> => {
        try {
            const res = await fetch(`${API_BASE}/game/lobby`);
            const json = await res.json();
            if (!json.success) return []; // Fallback or throw

            // Map backend generic lobby objects to Game interface
            return json.data.map((g: any) => ({
                id: g.id,
                status: g.status.toUpperCase(),
                game_type: g.game_type,
                entry_fee: parseFloat(g.entry_fee),
                prize_pool: parseFloat(g.prize_pool || '0'),
                players: g.player_count || 0,
                time_remaining: g.start_time // Logic to be handled in component or utils
            }));
        } catch (e) {
            console.error("Failed to fetch lobby", e);
            return [];
        }
    },

    joinGame: async (gameId: string, playerId: string, walletAddress: string): Promise<{ status: string, player_id: string }> => {
        const res = await fetch(`${API_BASE}/game/${gameId}/confirm-join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerId, walletAddress })
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        return { status: 'joined', player_id: playerId };
    },

    getDailyRewardStatus: async (playerId: string): Promise<RewardStatusResponse> => {
        const res = await fetch(`${API_BASE}/rewards/daily/${playerId}`);
        const json = await res.json();
        return json; // Assuming direct match or data wrapper
    },

    claimDailyReward: async (playerId: string): Promise<ClaimResponse> => {
        const res = await fetch(`${API_BASE}/rewards/claim`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerId })
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);

        return {
            success: true,
            reward_amount: json.reward_amount,
            new_streak: json.new_streak,
            new_total_earnings: json.new_total_earnings
        };
    },

    getPlayer: async (walletAddress: string): Promise<PlayerProfile> => {
        const res = await fetch(`${API_BASE}/player/${walletAddress}/profile`);
        const json = await res.json();

        if (!json.success) throw new Error(json.error);

        return {
            id: json.data.id,
            wallet_address: json.data.wallet_address,
            username: json.data.username,
            avatar_seed: json.data.avatar_seed || 'A',
            level: json.data.level || 1,
            joined_at: json.data.joined_at,
            stats: json.data.stats,
            inventory: json.data.inventory || {}
        };
    },

    updatePlayer: async (walletAddress: string, data: { username?: string, avatarSeed?: string }): Promise<PlayerProfile> => {
        const res = await fetch(`${API_BASE}/player/${walletAddress}/update`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        return json.data;
    },

    buyPowerup: async (playerId: string, powerupId: string): Promise<{
        success: boolean;
        inventory: Record<string, number>;
    }> => {
        const res = await fetch(`${API_BASE}/powerup/purchase`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerId, powerupId })
        });

        const json = await res.json();
        if (!json.success) throw new Error(json.error);

        return {
            success: true,
            inventory: json.data
        };
    },

    getLeaderboard: async (type: 'all-time' | 'weekly' | 'session'): Promise<any[]> => {
        try {
            const res = await fetch(`${API_BASE}/game/leaderboard?type=${type}`);
            const json = await res.json();
            if (!json.success) return [];
            return json.data;
        } catch (e) {
            console.error("Failed to fetch leaderboard", e);
            return [];
        }
    }
};

