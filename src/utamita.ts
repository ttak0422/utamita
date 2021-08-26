import * as Rx from "rxjs";
import * as RxOp from "rxjs/operators";
import { Keys, makeLocalVolume } from "./youtube";
import { YtMuteButton, YtVideo, YtVideoSrc } from "./wrapper";
import { HTMLAriaElement, NORMAL_BAR_COLLOR } from "./util";

declare module globalThis {
  let Utamita: Rx.Subscription[];
}
// injectしたスクリプトのsubsctiptionを格納し、重複の除去に利用する。
if (globalThis.Utamita == null) {
  globalThis.Utamita = [];
}

// 一定時間ごとにsrcを確認
const interval = Math.floor(1000 / 60);
// ディレイとして用いる時間
const delay = 3 * interval;

const source = Rx.interval(interval);
const subscription = new Rx.Subscription();

let video = document.getElementById("movie_player") as YtVideo;
let videoSrc = document.getElementsByClassName("video-stream html5-main-video")[0] as YtVideoSrc;
let bar: Element = document.body.getElementsByClassName("ytp-play-progress ytp-swatch-background-color")[0];
let btn = document.body.getElementsByClassName("ytp-mute-button ytp-button")[0] as YtMuteButton;
let volumePanel = document.body.getElementsByClassName("ytp-volume-panel")[0] as HTMLAriaElement;
let barStyle: CSSStyleDeclaration | null = null;

const isAdvertisement = () => {
  if(barStyle !== null) {
    let x = barStyle.getPropertyValue("background-color");
    return x !== NORMAL_BAR_COLLOR;
  }
}


function init() {
  for (const s of globalThis.Utamita) {
    console.log("unsubscribe");
    s.unsubscribe();
  }
  globalThis.Utamita = [subscription];
  if ("utamitaMyMute" in btn) {
    //
  } else {
    btn.utamitaMyMute = false;
    btn.addEventListener("click", (_ev) => {
      const muted = video.isMuted();
      btn.utamitaMyMute = muted;
      console.log(`set my-mute to ${muted}`);
    });
  }
}

function main() {
  // main logic
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
        if (btn.utamitaMyMute) {
          // 
        } else {
          // content | advertisement -> advertisement
          if (isAdvertisement) {
            console.log("maybe advertisement");
            video.mute();
          }
          // advertisement -> content
          else {
            console.log("maybe main content");
            video.unMute();
          }
        }
      }));
  // watch volume & mute flag
  subscription.add(
    source
      .pipe(
        RxOp.map((_) => volumePanel.ariaValueNow),
        RxOp.pairwise(),
        RxOp.filter(([prev, next]) => prev !== next),
        RxOp.delay(delay), 
        RxOp.map(([_prev, next]) => next)
      )
      .subscribe((volume) => {
        console.log(`Saved: [volume: ${volume}]`);
        localStorage.setItem(
          Keys.YT_PLAYER_VOLUME,
          makeLocalVolume(Number(volume), true)
        );
      })
  );
}

if(video == null || videoSrc == null || bar == null || btn == null || volumePanel == null) {
  console.log("other page");
} else {
  console.log("watch page");
  barStyle = getComputedStyle(bar);
  init();
  main();
}
