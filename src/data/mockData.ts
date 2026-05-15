export interface UserProfile {
    username: string;
    walletAddress: string;
    avatarSeed: string; // For generating avatar initials or image
    level: number;
    joinedDate: string;
    balance: string; // STX
    inventory?: Record<string, number>;
}

export interface UserStats {
    totalArea: string;
    gamesPlayed: number;
    gamesWon: number;
    winRate: string;
    totalEarnings: string;
    longestTrail: string;
    biggestLoop: string;
    currentStreak: number;
    rank: number;
}

export interface GameSession {
    id: string;
    type: 'BLITZ' | 'ELITE' | 'CASUAL';
    players: number;
    maxPlayers?: number;
    entryFee: string;
    prizePool: string;
    timeRemaining: string; // MM:SS
}

export interface GameLog {
    id: number | string;
    date: string;
    area: string;
    rank: number;
    players?: number;
    prize: string | null; // Null if no prize won
}

export interface LeaderboardEntry {
    rank: number;
    player: string; // Username or wallet fragment
    area: string;
    gamesWon: number;
    earnings: string;
}

export interface FaqItem {
    question: string;
    answer: string;
}

export interface PowerUp {
    id: 'shield' | 'stealth' | 'ghost' | 'sever' | 'beacon';
    name: string;
    description: string;
    cost: string; // e.g. "2 STX"
    type: 'defense' | 'offense' | 'stealth' | 'bonus';
    iconName?: string; // For mapping icons in UI
}

export interface SystemStatus {
    version: string;
    runnersOnline: number;
    currentPool: string;
    totalCapturedArea: string;
    lastPayout: string;
    status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
}

// --- MOCK DATA CONSTANTS ---

export const MOCK_USER_PROFILE: UserProfile = {
    username: 'SPEEDRUNNER',
    walletAddress: 'ST1PQHQKBV3YX530PXHXSMXE7SXQ8D5X8AKQNMQM',
    avatarSeed: 'S',
    level: 12,
    joinedDate: 'DEC 2025',
    balance: '245.3',
};

export const MOCK_USER_STATS: UserStats = {
    totalArea: '2.4 km²',
    gamesPlayed: 23,
    gamesWon: 7,
    winRate: '30%',
    totalEarnings: '156.8 STX',
    longestTrail: '4.2 km',
    biggestLoop: '0.15 km²',
    currentStreak: 2,
    rank: 142,
};

export const MOCK_ACTIVE_SESSIONS: GameSession[] = [
    { id: '1', entryFee: '5 STX', players: 6, prizePool: '30 STX', timeRemaining: '12:45', type: 'BLITZ' },
    { id: '2', entryFee: '10 STX', players: 4, prizePool: '40 STX', timeRemaining: '08:22', type: 'ELITE' },
    { id: '3', entryFee: '2 STX', players: 8, prizePool: '16 STX', timeRemaining: '14:58', type: 'CASUAL' },
];

export const MOCK_GAME_HISTORY: GameLog[] = [
    { id: 1, date: 'Jan 4, 2026', area: '0.15 km²', rank: 2, players: 6, prize: null },
    { id: 2, date: 'Jan 3, 2026', area: '0.42 km²', rank: 1, players: 8, prize: '25 STX' },
    { id: 3, date: 'Jan 2, 2026', area: '0.08 km²', rank: 5, players: 5, prize: null },
    { id: 4, date: 'Jan 1, 2026', area: '0.22 km²', rank: 3, players: 7, prize: null },
    { id: 5, date: 'Dec 31, 2025', area: '0.31 km²', rank: 1, players: 4, prize: '18 STX' },
];

// Replaces MOCK_LEADERBOARD
export const MOCK_LEADERBOARD_ALL_TIME: LeaderboardEntry[] = [
    { rank: 1, player: 'ST1PQHQK...V3JP', area: '45.2 km²', gamesWon: 34, earnings: '1,250 STX' },
    { rank: 2, player: 'ST2BQ4K...M8NP', area: '38.7 km²', gamesWon: 28, earnings: '980 STX' },
    { rank: 3, player: 'ST3CRV5...Q2LK', area: '32.1 km²', gamesWon: 22, earnings: '720 STX' },
    { rank: 4, player: 'ST4DZX8...N5RJ', area: '28.4 km²', gamesWon: 19, earnings: '540 STX' },
    { rank: 5, player: 'ST5EYW9...P3TH', area: '24.8 km²', gamesWon: 16, earnings: '380 STX' },
    { rank: 6, player: 'ST6FUV1...K7WM', area: '21.3 km²', gamesWon: 14, earnings: '290 STX' },
    { rank: 7, player: 'ST7GTR2...J9XL', area: '18.9 km²', gamesWon: 12, earnings: '220 STX' },
    { rank: 8, player: 'ST8HSQ3...H2YK', area: '16.5 km²', gamesWon: 10, earnings: '180 STX' },
    { rank: 9, player: 'ST9IPP4...G5ZJ', area: '14.2 km²', gamesWon: 8, earnings: '140 STX' },
    { rank: 10, player: 'ST0JON5...F8AI', area: '12.8 km²', gamesWon: 7, earnings: '110 STX' },
];

export const MOCK_LEADERBOARD_WEEKLY: LeaderboardEntry[] = [
    { rank: 1, player: 'ST3CRV5...Q2LK', area: '12.1 km²', gamesWon: 5, earnings: '120 STX' },
    { rank: 2, player: 'ST9IPP4...G5ZJ', area: '10.5 km²', gamesWon: 4, earnings: '95 STX' },
    { rank: 3, player: 'SPEEDRUNNER', area: '9.2 km²', gamesWon: 3, earnings: '80 STX' }, // Our user is doing well this week!
    { rank: 4, player: 'ST2BQ4K...M8NP', area: '8.4 km²', gamesWon: 3, earnings: '70 STX' },
    { rank: 5, player: 'ST6FUV1...K7WM', area: '7.8 km²', gamesWon: 2, earnings: '50 STX' },
    { rank: 6, player: 'ST8HSQ3...H2YK', area: '6.5 km²', gamesWon: 2, earnings: '40 STX' },
    { rank: 7, player: 'ST0JON5...F8AI', area: '5.2 km²', gamesWon: 1, earnings: '30 STX' },
    { rank: 8, player: 'ST1PQHQK...V3JP', area: '4.9 km²', gamesWon: 1, earnings: '20 STX' },
    { rank: 9, player: 'ST7GTR2...J9XL', area: '3.1 km²', gamesWon: 1, earnings: '10 STX' },
    { rank: 10, player: 'ST5EYW9...P3TH', area: '1.5 km²', gamesWon: 0, earnings: '5 STX' },
];

export const MOCK_LEADERBOARD_SESSION: LeaderboardEntry[] = [
    { rank: 1, player: 'SPEEDRUNNER', area: '0.42 km²', gamesWon: 1, earnings: '25 STX' }, // User is crushing it right now
    { rank: 2, player: 'ST8HSQ3...H2YK', area: '0.38 km²', gamesWon: 0, earnings: '0 STX' },
    { rank: 3, player: 'ST4DZX8...N5RJ', area: '0.15 km²', gamesWon: 0, earnings: '0 STX' },
    { rank: 4, player: 'ST2BQ4K...M8NP', area: '0.12 km²', gamesWon: 0, earnings: '0 STX' },
    { rank: 5, player: 'ST9IPP4...G5ZJ', area: '0.05 km²', gamesWon: 0, earnings: '0 STX' },
    { rank: 6, player: 'ST3CRV5...Q2LK', area: '0.01 km²', gamesWon: 0, earnings: '0 STX' },
    // Only 6 active runners in this mock view
    { rank: 7, player: '---', area: '---', gamesWon: 0, earnings: '---' },
    { rank: 8, player: '---', area: '---', gamesWon: 0, earnings: '---' },
    { rank: 9, player: '---', area: '---', gamesWon: 0, earnings: '---' },
    { rank: 10, player: '---', area: '---', gamesWon: 0, earnings: '---' },
];

export const MOCK_FAQS: FaqItem[] = [
    {
        question: 'How is territory calculated?',
        answer: 'Territory is calculated by the area enclosed when you close a loop. The more loops you close and the bigger they are, the more territory you capture. Overlapping areas count only once.',
    },
    {
        question: 'What happens if my trail gets severed?',
        answer: 'If another player crosses your open trail, it gets severed from that point. You lose any unclosed loop progress and must start a new trail from your current position.',
    },
    {
        question: 'How long do game sessions last?',
        answer: 'Standard game sessions last 15 minutes. Special events may have different durations. The timer is displayed on the HUD.',
    },
    {
        question: 'What are STX nodes / beacons?',
        answer: "STX beacons appear randomly. Running through a beacon adds bonus STX to your potential winnings, even if you don't win the session.",
    },
    {
        question: 'Is GPS required at all times?',
        answer: 'Yes. We recommend playing in open areas. Indoor or underground play is not supported due to GPS signal loss.',
    },
];

export const MOCK_POWERUPS: PowerUp[] = [
    {
        id: 'shield',
        name: 'Defensive Shield',
        description: 'Protects your trail from being severed by enemies. Auto-deploys on contact.',
        cost: '2 STX',
        type: 'defense',
    },
    {
        id: 'ghost',
        name: 'Ghost Mode',
        description: 'Become invisible on the map for 60 seconds. Perfect for sneak attacks.',
        cost: '5 STX',
        type: 'stealth',
    },
    {
        id: 'sever',
        name: 'Severing Trails',
        description: "Run across an enemy's active trail to cut it. They lose all un-looped progress.",
        cost: '0 STX', // Implicit ability
        type: 'offense',
    },
    {
        id: 'beacon',
        name: 'STX Beacons',
        description: 'Random high-value nodes that drop cash instantly when collected.',
        cost: '0 STX', // Zero cost to pickup
        type: 'bonus',
    },
];

export const MOCK_SYSTEM_STATUS: SystemStatus = {
    version: 'v2.0.4',
    runnersOnline: 42,
    currentPool: '125.5 STX',
    totalCapturedArea: '50K km²',
    lastPayout: '125.5 STX',
    status: 'ONLINE',
};

// --- NEW API MOCKS ---

export const MOCK_PLAYER_PROFILE: any = {
    id: 'user-123',
    wallet_address: 'ST1PQHQKBV3YX530PXHXSMXE7SXQ8D5X8AKQNMQM',
    username: 'SPEEDRUNNER',
    avatar_seed: 'S',
    level: 12,
    joined_at: '2025-12-01T00:00:00Z',
    inventory: {
        'shield': 1,
        'ghost': 0
    }
};

export const MOCK_REWARD_STATUS = {
    streak: 3,
    claimable: true,
    next_reward: 200,
    claimed_today: false,
    last_claimed_at: '2026-01-13T10:00:00Z',
};

export const MOCK_BOTS = [
    { id: 'bot-1', position: { lat: 40.785091 + 0.001, lng: -73.968285 + 0.001 }, trail: [], is_me: false, color: '#FF4444' },
    { id: 'bot-2', position: { lat: 40.785091 - 0.001, lng: -73.968285 - 0.0005 }, trail: [], is_me: false, color: '#8844FF' },
    { id: 'bot-3', position: { lat: 40.785091 + 0.0005, lng: -73.968285 - 0.0015 }, trail: [], is_me: false, color: '#FF8844' }
];

export const DEFAULT_GAME_CONFIG = {
    startPos: [40.785091, -73.968285] as [number, number],
    durationSeconds: 1500, // 25 min
    degreeToMeters: 111320,
    captureThreshold: 10.0,
    trailBankThreshold: 2.0
};
