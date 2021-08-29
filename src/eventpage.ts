import { AppEvent } from "./util";
import { Keys, makeLocalVolume, Urls } from "./youtube";
import { ChromeTabsEvents } from "./chrome";

// YouTube watch pages
let watchList: number[] = [];

// WIP
// watch page transition
chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (
    info.status === ChromeTabsEvents.Loading &&
    tab.url?.indexOf(Urls.TOP) !== -1
  ) {
    // set mute
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
  else if (
    info.status === ChromeTabsEvents.Complete &&
    tab.url?.indexOf(Urls.WATCH) !== -1
  ) {
    // inject code
    console.log("loaded");
    chrome.pageAction.show(tabId);
    watchList.push(tabId);
    chrome.tabs.executeScript(tabId, { code: 'document.getElementById("movie_player")?.mute();' }, () => { });
    chrome.tabs.sendMessage(
      tabId,
      { type: AppEvent.On },
      () => {}
    );
  } else if (
    info.status === ChromeTabsEvents.Unloaded &&
    tab.url?.indexOf(Urls.WATCH) !== -1
  ) {
    // remove injected code
    console.log("Unloaded");
    watchList = watchList.filter((x) => x !== tabId);
    chrome.tabs.sendMessage(
      tabId,
      { type: AppEvent.Off },
      () => {}
    );
  }
});