const date = new Date();
const lifetime = 30 * 24 * 60 * 60 * 1000; // 30 days

export const STORAGE_KEY = "yt-player-volume";

export const MY_MUTE_FLAG = "utamita-muted";

export const makeSessionVolume = (volume: number, muted: boolean) => JSON.stringify({
    data: JSON.stringify({ volume, muted }),
    creation: date.getTime(),
});

export const makeLocalVolume = (volume: number, muted: boolean) => JSON.stringify({
    data: JSON.stringify({ volume, muted }),
    expiration: date.getTime() + lifetime,
    creation: date.getTime(),
});