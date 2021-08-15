import { strToBoolean } from "./util";

/**
 * Application data keys
 */
export type AppKeys =
  | { type: "enabled"; data: boolean }
  | { type: "my-mute-flag"; data: boolean };

/**
 * get value from chrome
 * @param key the key of data
 * @returns Promise<JSON | undefined>
 */
export const chromeGet = <K extends AppKeys>(
  key: K["type"]
): Promise<K["data"]> =>
  new Promise((resolve, _reject) => {
    console.log(`chrome.storage.local.get ${key}`);
    chrome.storage.local.get(key, (items) => {
      // enabled
      if ((key = "enabled")) {
        // true | null | undefined -> enabled, false -> disabled
        const v = items[key];
        if (v == null) {
          resolve(true);
        } else {
          resolve(strToBoolean(v + ""));
        }
      }
      // my-mute-flag
      else if ((key = "my-mute-flag")) {
        // true -> enabled, false | null | undefined -> disabled
        const v = items[key];
        if (v == null) {
          resolve(false);
        } else {
          resolve(strToBoolean(v + ""));
        }
      }
    });
  });

/**
 * set value to chrome
 * @param key the key of data
 * @param value data
 * @returns Promise<void>
 */
export const chromeSet = <K extends AppKeys>(
  key: K["type"],
  value: K["data"]
): Promise<void> =>
  new Promise((resolve, _reject) => {
    let v: any = {};
    v[key] = value;
    console.log(`chrome.storage.local.set ${key}`);
    chrome.storage.local.set(v, resolve);
  });
