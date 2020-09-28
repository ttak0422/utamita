// inject js program from webpack.
declare const SCRIPT: string;

const ID = "4061c014756fab760ae16a3abf3c3b236084962e32be55dedfda48b0927159a0";

function addScript() {
    const inject = document.createElement("script");
    inject.appendChild(document.createTextNode(SCRIPT));
    inject.id = ID;
    document.body.appendChild(inject);
}

function removeScript() {
    const inject = document.getElementById(ID);
    if (inject === null) return;
    document.body.removeChild(inject);
}

// eventpageからの要請に応じて処理を実行．
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "onUpdate") {
        console.log("execute utamita");
        removeScript();
        addScript();
    }
});
