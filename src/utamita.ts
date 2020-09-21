/**
 * memo
 * - video.srcを`defineProperty`で直接監視するとYouTubeが動作しなくなる．
 */

// TODO: ミュート時の音量の調整．あくまで音量調節を行う拡張として開発．
// TODO: 普段の音量の調整
// TODO: isAdvertisementの高速化

import * as Rx from "rxjs";
import * as RxOp from "rxjs/operators";

const fps = Math.floor(1000 / 60);
const threshold = 100; 
const source = Rx.interval(fps);
const subscription = new Rx.Subscription();

let isPlayingAdvertisement = true;
// 本編のシーク位置を保持．
let memTime = 0.0;

function isAdvertisement() {
    return document.getElementsByClassName("ytp-ad-preview-container").length > 0;
}

function utamita() {
    const video: any = document.getElementsByClassName('video-stream html5-main-video')[0];
    if (video === null) return;
    video.volume = 0; // mute
    subscription.add(
        source
            .pipe(RxOp.map(x => [x, video.getCurrentTime()]))
            .pipe(RxOp.pairwise())
            .pipe(RxOp.filter(x => {
                const prev = x[0];
                const next = x[1];
                // はじめ一定時間は監視を行う．
                if (prev[0] < threshold) return true;
                
                // 動画の再生位置が0に戻った．つまり
                // 本編から広告，広告から広告に移り変わったとき．
                const f1 = prev[1] > next[1];
                // TODO: refactor 広告から本編に移り変わったことを検出．
                const f2 = isPlayingAdvertisement && memTime - 1.0 < next[1] && next[1] < memTime + 1.0;
                return f1 || f2;
            }))
            .subscribe(_ => {
                const time = video.getCurrentTime();
                isPlayingAdvertisement = isAdvertisement();
                if (isPlayingAdvertisement) {
                    video.volume = 0.0;
                    console.log("maybe advertisement");
                } else {
                    memTime = video.getCurrentTime();
                    video.volume = 1.0;
                    console.log("maybe main content");
                }
            }));
}

utamita();