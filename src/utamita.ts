/**
 * memo
 * - video.srcを`defineProperty`で直接監視するとYouTubeが動作しなくなる．
 * - utamita.jsは再生される動画をチェックして音量の変更を行う．
 * - isAdvertisement()を毎回呼び出すことが理想ではあるもの重たい．動作の軽さを大事にする．
 */


import * as Rx from "rxjs";
import * as RxOp from "rxjs/operators";
import { STORAGE_KEY, MY_MUTE_FLAG, makeSessionVolume, makeLocalVolume } from "./storage";

// injectしたスクリプトのsubsctiptionを格納し、重複の除去に利用する。
declare module globalThis {
    let Utamita: Rx.Subscription[];
}

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
if (globalThis.Utamita == null) {
    globalThis.Utamita = [];
}

let video: any = document.getElementsByClassName('video-stream html5-main-video')[0];
let bar: Element = document.body.getElementsByClassName("ytp-play-progress ytp-swatch-background-color")[0];
let barStyle: CSSStyleDeclaration = getComputedStyle(bar);
let btn: Element = document.body.getElementsByClassName("ytp-mute-button ytp-button")[0];
let volumePanel: any = document.body.getElementsByClassName("ytp-volume-panel")[0];
let volumeSlider: any = document.getElementsByClassName("ytp-volume-slider-handle")[0];

/**
 * youtube上で動画のミュートがされているかどうか？
 */
function isMuted() {
    // return btn.children[0].childElementCount === 2;
    return volumeSlider.style.left[0] == "0";
}

/**
 * utamitaによってではなくユーザは自主的に音量をミュートしているかどうか？
 */
function isMyMuted() {
    const f = localStorage.getItem(MY_MUTE_FLAG);
    if (f == null) {
        return false;
    } else {
        return f === "true";
    }
}

function isAdvertisement() {
    let x = barStyle.getPropertyValue("background-color");
    console.log(x);
    return x !== "rgb(255, 0, 0)";
}

function clear() {
   for(const s of globalThis.Utamita) {
       console.log("unsubscribe");
       s.unsubscribe();
   }
}

function register() {
    globalThis.Utamita.push(subscription);
}

function utamita() {
    clear();
    register();
    if (video === null) {
        console.log("video not found");
        video = document.getElementById("movie_player");
        utamita();
        return;
    }
    if(barStyle === null) {
        console.log("barStyle not found");
        bar = document.body.getElementsByClassName("ytp-play-progress ytp-swatch-background-color")[0];
        barStyle = getComputedStyle(bar);
        utamita();
        return;
    }
    if(btn === null) {
        console.log("btn not found");
        btn = document.body.getElementsByClassName("ytp-mute-button ytp-button")[0];
        utamita();
        return;
    }
    if(volumePanel == null) {
        console.log("volumePanel not found");
        volumePanel = document.body.getElementsByClassName("ytp-volume-panel")[0];
        utamita();
        return;
    }
    if(volumeSlider == null) {
        console.log("volumeSlider not found");
        volumeSlider = document.getElementsByClassName("ytp-volume-slider-handle")[0];
        utamita();
        return;
    }
    
    

    /*
    
    const myMuted = isMyMuted();
    if(!myMuted) {
        const advertisement = isAdvertisement();
        video.muted = advertisement;
        console.log(`initialized... (not mute), ad: ${advertisement}`);
    } else {
        // video.muted = true;
        console.log(`initialized... (mute)`)
    }

    subscription.add(
        source.pipe
            (RxOp.map(_ => video.src)
                , RxOp.pairwise()
                , RxOp.filter(([prev, next]) => prev !== next)
                , RxOp.tap(([prev, next]) => {
                    console.log(`mute once, p: ${prev}, n: ${next}`);
                    video.muted = true;
                    // srcが変化するたびに現場の音量をもとに、muteされた設定を保存
                    const volume = volumePanel.ariaValueNow;
                    // sessionStorage.setItem(STORAGE_KEY, makeSessionVolume(volume, true));
                    // localStorage.setItem(STORAGE_KEY, makeLocalVolume(volume, true));
                })
                , RxOp.delay(delay)
                , RxOp.map(_ => isAdvertisement()))
            .subscribe(isAdvertisement => {
                // content -> advertisement
                if (isAdvertisement) {
                    console.log("maybe advertisement");
                    video.muted = true;
                }
                // advertisement -> content
                else {
                    console.log("maybe main content");
                    if(!isMyMuted()) {
                        console.log("明示的にミュートしていないのでミュート解除");
                        video.muted = false;
                    } else {
                        console.log("明示的にミュートしているのでミュート解除しない");
                    }
                }
            }));
    
    */
    
    // storageの情報をもとに新規タブでの音量の初期値設定が行われる。
    subscription.add(
        source.pipe
            (RxOp.map(_ => [ volumePanel.ariaValueNow, isMuted() ])
                , RxOp.pairwise()
                , RxOp.filter(([[prevVolume, prevMuted], [nextVolume, nextMuted]]) => prevVolume !== nextVolume || prevMuted !== nextMuted)
                , RxOp.delay(1000)
                , RxOp.map(([_prev, next ]) => next)
                )
            .subscribe(([volume, muted]) => {
                console.log(`Saved: [volume: ${volume}]`);
                // 明示的なミュート状態を更新
                localStorage.setItem(MY_MUTE_FLAG, muted);
                // 現在の音量をもとに、muteされた設定を保存
                sessionStorage.setItem(STORAGE_KEY, makeSessionVolume(volume, true));
                localStorage.setItem(STORAGE_KEY, makeLocalVolume(volume, true));
            }));
}

console.log("utamita");

utamita();

