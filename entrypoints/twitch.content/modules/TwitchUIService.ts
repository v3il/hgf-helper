import { Timing } from '@shared/consts';
import { Service } from 'typedi';
import cookies from 'js-cookie';

@Service()
export class TwitchUIService {
    twitchUserName!: string;

    constructor() {
        this.twitchUserName = this.getUserName();
    }

    // <div data-a-target="tw-core-button-label-text" class="Layout-sc-1xcs6mc-0 bFxzAY">Click Here to Reload Player</div>

    whenStreamReady(callback: () => void) {
        const reloadTimeout = setTimeout(() => window.location.reload(), Timing.MINUTE);

        const interval = setInterval(async () => {
            const videoEl = this.activeVideoEl;
            const playerOverlayEl = document.querySelector<HTMLDivElement>('.home-live-player-overlay');

            if (playerOverlayEl) {
                return playerOverlayEl.click();
            }

            const elements = [
                this.chatContainerEl,
                this.chatInputEl,
                this.chatScrollableAreaEl,
                this.streamInfoEl,
                videoEl
            ];

            if (!elements.every((element) => !!element)) {
                return;
            }

            if (this.isVideoPlaying(videoEl!) && this.currentGame && this.twitchUserName) {
                clearInterval(interval);
                clearTimeout(reloadTimeout);
                callback();
            }
        }, Timing.SECOND);
    }

    get activeVideoEl() {
        const { mainVideoEl, adsVideoEl } = this;

        if (this.isAdsPhase && !adsVideoEl) {
            return null;
        }

        return this.isAdsPhase ? adsVideoEl : mainVideoEl;
    }

    get mainVideoEl() {
        return document.querySelector('video');
    }

    get adsVideoEl() {
        return document.querySelector<HTMLVideoElement>('.picture-by-picture-player video');
    }

    get isAdsPhase() {
        return !!document.querySelector('[data-a-target="video-ad-countdown"]');
    }

    get chatContainerEl() {
        return document.querySelector<HTMLElement>('.channel-root__right-column');
    }

    get chatInputEl() {
        return document.querySelector<HTMLElement>('[data-a-target="chat-input"]');
    }

    get chatScrollableAreaEl() {
        return document.querySelector<HTMLElement>('.chat-scrollable-area__message-container');
    }

    get chatButtonsContainerEl() {
        return this.chatContainerEl!.querySelector<HTMLElement>('.chat-input__buttons-container');
    }

    get currentGame() {
        return document.querySelector('[data-a-target="stream-game-link"] span')?.textContent?.toLowerCase() ?? '';
    }

    get streamInfoEl() {
        return document.querySelector<HTMLElement>('.channel-info-content');
    }

    private isVideoPlaying(videoEl: HTMLVideoElement) {
        return videoEl.currentTime > 0 && !videoEl.paused && !videoEl.ended && videoEl.readyState > 2;
    }

    private getUserName(): string {
        const userCookie = cookies.get('twilight-user');

        if (userCookie) {
            try {
                const { displayName } = JSON.parse(userCookie);
                return displayName.toLowerCase();
            } catch (error) {
                console.error('Failed to parse user cookie:', error);
            }
        }

        return '';
    }
}
