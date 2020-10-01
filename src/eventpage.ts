/**
 * YouTube内で別の動画の再生が始まってもcontent_scriptsは更新されない．
 * tabsでURLを監視し，手動で内容の更新を行う．
 */

import { keys, appEvent } from "./util";

const chromeTabsEvents = {
    unloaded: "unloaded",
    loading: "loading",
    complete: "complete",
}

let enabled = true;
let watchList: number[] = [];

chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
    // URLがYouTubeの視聴ページだった場合，`content_scripts`経由でスクリプトを注入する．
    if (info.status === chromeTabsEvents.complete && tab.url?.indexOf("https://www.youtube.com/watch?") !== -1) {
        console.log("loaded");
        chrome.pageAction.show(tabId);
        if (enabled) {
            watchList.push(tabId);
            // 最速で反映される方法で一旦ミュート
            chrome.tabs.executeScript(tabId, { code: 'let v=document.getElementsByClassName("video-stream html5-main-video")[0];if(v!==null)v.volume=0;' }, () => { });
            chrome.tabs.sendMessage(tabId, { type: "onUpdate" }, () => { });
            chrome.tabs.sendMessage(tabId, { type: appEvent.on }, () => { });
        }
    }
    else if (info.status === chromeTabsEvents.unloaded && tab.url?.indexOf("https://www.youtube.com/watch?") !== -1) {
        console.log("unloaded");
        watchList = watchList.filter(x => x !== tabId);
    }
});

chrome.storage.onChanged.addListener((changes, ns) => {
    if (changes[keys.enabled]) {
        enabled = changes[keys.enabled].newValue as boolean;
        console.log(`changed enabled: ${enabled}`);
        for (let tabId of watchList) {
            chrome.tabs.sendMessage(tabId, { type: enabled ? appEvent.on : appEvent.off }, () => { });
        }
    }
});