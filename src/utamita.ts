/**
 * memo
 * - video.srcを`defineProperty`で直接監視するとYouTubeが動作しなくなる．
 * - utamita.jsは再生される動画をチェックして音量の変更を行う．
 * - isAdvertisement()を毎回呼び出すことが理想ではあるもの重たい．動作の軽さを大事にする．
 */


import * as Rx from "rxjs";
import * as RxOp from "rxjs/operators";

/**
 * ${interval}msec間隔で処理を実行する．
 */
const interval = Math.floor(1000 / 60);

/**
 * srcの変更後内容が更新されるまで待つ．保険．
 */
const delay = 3 * interval;

const source = Rx.interval(interval);
const subscription = new Rx.Subscription();

let video: any = document.getElementsByClassName('video-stream html5-main-video')[0];
let bar: Element = document.body.getElementsByClassName("ytp-play-progress ytp-swatch-background-color")[0];
let barStyle: CSSStyleDeclaration = getComputedStyle(bar);

function isAdvertisement() {
    let x = barStyle.getPropertyValue("background-color");
    console.log(x);
    return x !== "rgb(255, 0, 0)";
}

function utamita() {
    if (video === null || barStyle === null) {
        console.log("not found");
        video = document.getElementsByClassName('video-stream html5-main-video')[0];
        bar = document.body.getElementsByClassName("ytp-play-progress ytp-swatch-background-color")[0];
        barStyle = getComputedStyle(bar);
        utamita();
    }

    video.muted = isAdvertisement();

    subscription.add(
        source.pipe
            (RxOp.map(_ => video.src)
                , RxOp.pairwise()
                , RxOp.filter(([prev, next]) => prev !== next)
                , RxOp.tap(([prev, next]) => {
                    console.log(`mute once, p: ${prev}, n: ${next}`);
                    video.muted = true;
                })
                , RxOp.delay(delay)
                , RxOp.map(_ => isAdvertisement())
                , RxOp.distinctUntilChanged())
            .subscribe(isAdvertisement => {
                // content -> advertisement
                if (isAdvertisement) {
                    console.log("maybe advertisement");
                    video.muted = true;
                }
                // advertisement -> content
                else {
                    console.log("maybe main content");
                    video.muted = false;
                }
            }));
}

utamita();
