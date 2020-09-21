/**
 * memo
 * - video.srcを`defineProperty`で直接監視するとYouTubeが動作しなくなる．
 * - utamita.jsは再生される動画をチェックして音量の変更を行う．
 * - isAdvertisement()を毎回呼び出すことが理想ではあるもの重たい．動作の軽さを大事にする．
 */

// TODO: ミュート時の音量の調整．あくまで音量調節を行う拡張として開発．
// TODO: 普段の音量の調整
// TODO: isAdvertisementの高速化

import * as Rx from "rxjs";
import * as RxOp from "rxjs/operators";

/**
 * ${interval}msec間隔で処理を実行する．
 */
const interval = Math.floor(1000 / 60);

/**
 * mediaのsrcが変わった瞬間に広告要素が構築されない．
 * 広告要素をもとに今何を再生しているか判定するため，
 * mediaのsrcが変化してから${delay}msec待機し判定につなぐ．
 */
const delay = 60 * interval;

const source = Rx.interval(interval);
const subscription = new Rx.Subscription();

function isAdvertisement() {
    return document.getElementsByClassName("ytp-ad-preview-container").length > 0;
}

function utamita() {
    const video: any = document.getElementsByClassName('video-stream html5-main-video')[0];
    if (video === null) return;

    function updateVolume() {
        if (isAdvertisement()) {
            video.volume = 0.0;
            console.log("maybe advertisement");
        } else {
            video.volume = 1.0;
            console.log("maybe main content");
        }
    }

    updateVolume();
    console.log("subscription");
    subscription.add(
        source.pipe
            (RxOp.map(_ => video.src)
                , RxOp.pairwise()
                , RxOp.filter(([prev, next]) => prev !== next)
                , RxOp.tap(_ => {
                    console.log("mute once");
                    video.volume = 0.0;
                })
                // TODO: delayで拾いきれないケースへの対応．(t, 2t, 4tで実行とか)
                , RxOp.delay(delay))
            .subscribe(_ => updateVolume()));
}

console.log("utamita");
utamita();