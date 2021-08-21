export const ChromeTabsEvents = {
  Unloaded: "unloaded",
  Loading: "loading",
  Complete: "complete",
} as const;

export type ChromeTabsEvents =
  typeof ChromeTabsEvents[keyof typeof ChromeTabsEvents];
