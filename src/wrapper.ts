//////////////////////////////////////////////
// Unsafe Wrapper
//////////////////////////////////////////////

export interface YtVideo extends HTMLElement {
    mute: () => void,
    unMute: () => void,
    isMuted: () => boolean,
}
    
export interface YtVideoSrc extends Element {
    src: string,
}

export interface YtMuteButton extends Element {
    /**
     * clickEvent registered?
     */
    utamitaMyMute?: boolean
}