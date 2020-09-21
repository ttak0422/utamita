/**
 * memo
 * - 動画の新規再生，リロード時などでコンテンツの前に動画が再生されるときにとりあえず動画をミュートする軽量スクリプト．
 * - URLの変更時にも呼び出される．
 */
function fastMute() {
    const video: any = document.getElementsByClassName('video-stream html5-main-video')[0];
    if (video === null) {
        return;
    }
    else {
        video.volume = 0; // mute
        console.log("fast mute");
    }
}

fastMute();