export const APP_ID = "4061c014756fab760ae16a3abf3c3b236084962e32be55dedfda48b0927159a0";

export const MY_MUTE_FLAG = "utamita-muted";

/**
 * Application mode
 */
export const AppEvent = {
    On: "on",
    Off: "off",
} as const;

export type AppEvent = typeof AppEvent[keyof typeof AppEvent];

export const strToBoolean = (v: string): boolean => v.toLowerCase() === "true";
