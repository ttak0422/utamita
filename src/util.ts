export const APP_ID =
  "4061c014756fab760ae16a3abf3c3b236084962e32be55dedfda48b0927159a0";

/**
 * Application mode
 */
export const AppEvent = {
  On: "on",
  Off: "off",
} as const;

/**
 * Application mode
 */
export type AppEvent = typeof AppEvent[keyof typeof AppEvent];

/**
 * Normal Color
 */
export const NORMAL_BAR_COLLOR = "rgb(255, 0, 0)";

/**
 * HTMLAria Wrapper
 */
export class HTMLAriaElement extends Element {
  get ariaValueNow(): string {
    return this.getAttribute("aria-valuenow") || "100";
  }
}
