chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
    // URLがYouTubeの視聴ページだった場合，`content_scripts`経由でスクリプトを注入する．
    if (info.status === "complete" && tab.url?.indexOf("https://www.youtube.com/watch?") !== -1) {
        chrome.tabs.sendMessage(tabId, { type: "onUpdate" }, () => {
        });
    }
});