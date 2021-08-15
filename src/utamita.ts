import * as Rx from "rxjs";
import * as RxOp from "rxjs/operators";
// import { MY_MUTE_FLAG, makeSessionVolume, makeLocalVolume } from './storage';
import { Keys, makeLocalVolume } from "./youtube";
import { MY_MUTE_FLAG } from "./util";
import { chromeSet } from "./chrome";

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
let video: any = document.getElementById("movie_player");
let videoSrc: any = document.getElementsByClassName(
  "video-stream html5-main-video"
)[0];
let bar: Element = document.body.getElementsByClassName(
  "ytp-play-progress ytp-swatch-background-color"
)[0];
let barStyle: CSSStyleDeclaration = getComputedStyle(bar);
let btn: Element = document.body.getElementsByClassName(
  "ytp-mute-button ytp-button"
)[0];
let volumePanel: any =
  document.body.getElementsByClassName("ytp-volume-panel")[0];
let volumeSlider: any = document.getElementsByClassName(
  "ytp-volume-slider-handle"
)[0];

/**
 * youtube上で動画のミュートがされているかどうか？
 */
function isMuted() {
  // return btn.children[0].childElementCount === 2;
  return volumeSlider.style.left[0] == "0";
}

function isAdvertisement() {
  let x = barStyle.getPropertyValue("background-color");
  console.log(x);
  return x !== "rgb(255, 0, 0)";
}

function clear() {
  for (const s of globalThis.Utamita) {
    console.log("unsubscribe");
    s.unsubscribe();
  }
  globalThis.Utamita = [];
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
  if (videoSrc === null) {
    console.log("videoSrc not found");
    videoSrc = document.getElementsByClassName(
      "video-stream html5-main-video"
    )[0];
    utamita();
    return;
  }
  if (barStyle === null) {
    console.log("barStyle not found");
    bar = document.body.getElementsByClassName(
      "ytp-play-progress ytp-swatch-background-color"
    )[0];
    barStyle = getComputedStyle(bar);
    utamita();
    return;
  }
  if (btn === null) {
    console.log("btn not found");
    btn = document.body.getElementsByClassName("ytp-mute-button ytp-button")[0];
    utamita();
    return;
  }
  if (volumePanel == null) {
    console.log("volumePanel not found");
    volumePanel = document.body.getElementsByClassName("ytp-volume-panel")[0];
    utamita();
    return;
  }
  if (volumeSlider == null) {
    console.log("volumeSlider not found");
    volumeSlider = document.getElementsByClassName(
      "ytp-volume-slider-handle"
    )[0];
    utamita();
    return;
  }

  // check btn initialized
  // utamita flag is also used as MyMuteFlag
  if ((btn as any).utamite !== true && (btn as any).utamita !== false) {
    (btn as any).utamita = false;
    console.log(`addEventListener click ${(btn as any).utamita}`);
    btn.addEventListener("click", () => {
      const muted = isMuted();
      (btn as any).utamita = muted;
      chromeSet("my-mute-flag", muted);
      console.log(`update my-mute-flag to ${muted}`);
    });
  }

  // main
  subscription.add(
    source
      .pipe(
        RxOp.map((_) => videoSrc.src),
        RxOp.pairwise(),
        RxOp.filter(([prev, next]) => prev !== next),
        RxOp.tap(([prev, next]) => {
          console.log(`mute once, p: ${prev}, n: ${next}`);
          // mute video every time video source changes
          video.mute();
        }),
        RxOp.delay(delay),
        RxOp.map((_) => isAdvertisement())
      )
      .subscribe((isAdvertisement) => {
          // true -> true
          // null | undefined | false -> false
          const myMute = (btn as any).utamita != null && (btn as any).utamita;
          
          // content -> advertisement
          if (isAdvertisement) {
            console.log("maybe advertisement");
            video.mute();
          }
          // advertisement -> content
          else {
            console.log("maybe main content");
            if (!myMute) {
              video.unMute();
              console.log("明示的にミュートしていないのでミュート解除");
            } else {
              console.log("明示的にミュートしているのでミュート解除しない");
            }
          }
      })
  );

  localStorage.setItem(MY_MUTE_FLAG, "false");

  // save volume & mute flag
  subscription.add(
    source
      .pipe(
        RxOp.map((_) => volumePanel.ariaValueNow),
        RxOp.pairwise(),
        RxOp.filter(([prev, next]) => prev !== next),
        RxOp.delay(1000), // 始めにYouTube側で値が更新される。その後上書きを行う。
        RxOp.map(([_prev, next]) => next)
      )
      .subscribe((volume) => {
        console.log(`Saved: [volume: ${volume}]`);
        localStorage.setItem(
          Keys.YT_PLAYER_VOLUME,
          makeLocalVolume(volume, true)
        );
      })
  );
}

console.log("utamita");

utamita();
