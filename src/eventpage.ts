/**
 * YouTube内で別の動画の再生が始まってもcontent_scriptsは更新されない．
 * tabsでURLを監視し，手動で内容の更新を行う．
 */
chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
    // URLがYouTubeの視聴ページだった場合，`content_scripts`経由でスクリプトを注入する．
    if (info.status === "complete" && tab.url?.indexOf("https://www.youtube.com/watch?") !== -1) {
        // 最速で反映される方法で一旦ミュート
        chrome.tabs.executeScript(tabId, { code: 'let v=document.getElementsByClassName("video-stream html5-main-video")[0];if(v!==null)v.volume=0;' }, () => { });
        chrome.tabs.sendMessage(tabId, { type: "onUpdate" }, () => { });
    }
});
