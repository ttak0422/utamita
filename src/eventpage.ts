import { AppEvent } from "./util";
import { chromeGet } from "./chrome";
import { Keys, makeLocalVolume, Urls } from "./youtube";

const ChromeTabsEvents = {
  Unloaded: "unloaded",
  Loading: "loading",
  Complete: "complete",
} as const;

type ChromeTabsEvents = typeof ChromeTabsEvents[keyof typeof ChromeTabsEvents];

// App status
let enabled = true;
// YouTube watch pages
let watchList: number[] = [];

chromeGet("enabled").then((savedEnabled) => {
  console.log(`load enabled: ${savedEnabled}`);
  for (let tabId of watchList) {
    chrome.tabs.sendMessage(
      tabId,
      { type: savedEnabled ? AppEvent.On : AppEvent.Off },
      () => {}
    );
  }
});

chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  // set default mute
  if (
    info.status === ChromeTabsEvents.Loading &&
    tab.url?.indexOf(Urls.TOP) !== -1
  ) {
    let json = localStorage.getItem(Keys.YT_PLAYER_VOLUME);
    if (json == null) {
      localStorage.setItem(Keys.YT_PLAYER_VOLUME, makeLocalVolume(100, true));
    } else {
      let v = JSON.parse(json);
      localStorage.setItem(
        Keys.YT_PLAYER_VOLUME,
        makeLocalVolume(v.volume || 100, true)
      );
    }
  }
  // URLがYouTubeの視聴ページだった場合，`content_scripts`経由でスクリプトを注入する．
  if (
    info.status === ChromeTabsEvents.Complete &&
    tab.url?.indexOf(Urls.WATCH) !== -1
  ) {
    console.log("loaded");
    chrome.pageAction.show(tabId);
    if (enabled) {
      watchList.push(tabId);
      chrome.tabs.sendMessage(tabId, { type: AppEvent.On }, () => {});
    }
  } else if (
    info.status === ChromeTabsEvents.Unloaded &&
    tab.url?.indexOf(Urls.WATCH) !== -1
  ) {
    console.log("Unloaded");
    watchList = watchList.filter((x) => x !== tabId);
  }
});

chrome.storage.onChanged.addListener((changes, _ns) => {
  if (changes["enabled"]) {
    enabled = changes["enabled"].newValue as boolean;
    console.log(`changed enabled: ${enabled}`);
    for (let tabId of watchList) {
      chrome.tabs.sendMessage(
        tabId,
        { type: enabled ? AppEvent.On : AppEvent.Off },
        () => {}
      );
    }
  }
});
