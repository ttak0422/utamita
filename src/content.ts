// TODO: content_scriptsの軽量化かSCRIPTの読み込み方法の改善．
// 現状，注入するスクリプトを文字列として保持するので読み込みに時間がかかり，動画再生と
// 同時に再生される広告で若干処理が間に合わない． 

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

function mute() {
    const video: any = document.getElementsByClassName('video-stream html5-main-video')[0];
    if (video === null) return;
    video.volume = 0.0;
}

// eventpageからの要請に応じて処理を実行．
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "onUpdate") {
        console.log("execute utamita");
        mute();
        removeScript();
        addScript();
    }
});