import { APP_ID, appEvent } from "./util";

const scriptID = APP_ID + "_script";

// inject js program from webpack.
declare const SCRIPT: string;

function addScript() {
    const inject = document.createElement("script");
    inject.appendChild(document.createTextNode(SCRIPT));
    inject.id = scriptID;
    document.body.appendChild(inject);
}

function removeScript() {
    const inject = document.getElementById(scriptID);
    if (inject === null) return;
    document.body.removeChild(inject);
}

// eventpageからの要請に応じて処理を実行．
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === appEvent.on) {
        console.log(`contant on`);
        removeScript();
        addScript();
        sendResponse();
    } else if (request.type === appEvent.off) {
        console.log(`content off`);
        removeScript();
        sendResponse();
    }
});
