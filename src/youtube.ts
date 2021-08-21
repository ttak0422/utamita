const date = new Date();
const lifetime = 30 * 24 * 60 * 60 * 1000; // 30 day 

// youtube local, session storage keys
export const Keys = {
    YT_PLAYER_VOLUME: "yt-player-volume",
} as const;

export type Keys = typeof Keys[keyof typeof Keys];

// YouTube URLs
export const Urls = {
    TOP: "https://www.youtube.com",
    WATCH: "https://www.youtube.com",
} as const;

export type Urls = typeof Urls[keyof typeof Urls];

/**
 * Format volume & muted for YouTube LocalStorage
 * @param volume volume
 * @param muted muted
 * @returns JSON(string)
 */
export const makeLocalVolume = (volume: number, muted: boolean) => JSON.stringify({
    data: JSON.stringify({ volume, muted }),
    expiration: date.getTime() + lifetime,
    creation: date.getTime(),
});