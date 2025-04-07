import { waitAsync } from '@utils';
import { Timing } from '@shared/consts';
import { Service } from 'typedi';

@Service()
export class TwitchUIService {
    twitchUserName!: string;

    // <div data-a-target="tw-core-button-label-text" class="Layout-sc-1xcs6mc-0 bFxzAY">Click Here to Reload Player</div>

    whenStreamReady(callback: () => void) {
        const reloadTimeout = setTimeout(() => window.location.reload(), Timing.SECOND * 30);

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
                this.userDropdownToggleEl,
                videoEl
            ];

            if (!elements.every((element) => !!element)) {
                return;
            }

            const userName = await this.getUserName();

            if (this.#isVideoPlaying(videoEl!) && this.currentGame && userName) {
                clearInterval(interval);
                clearTimeout(reloadTimeout);
                this.twitchUserName = userName;
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

    get chatContainerEl(): HTMLElement | null {
        return document.querySelector('.channel-root__right-column');
    }

    get chatInputEl() {
        return document.querySelector('[data-a-target="chat-input"]');
    }

    get userDropdownToggleEl() {
        return document.querySelector('[data-a-target="user-menu-toggle"]');
    }

    get chatScrollableAreaEl() {
        return document.querySelector('.chat-scrollable-area__message-container');
    }

    get chatButtonsContainerEl() {
        return this.chatContainerEl!.querySelector('.chat-input__buttons-container');
    }

    get currentGame() {
        return document.querySelector('[data-a-target="stream-game-link"] span')?.textContent?.toLowerCase() ?? '';
    }

    #isVideoPlaying(videoEl: HTMLVideoElement) {
        return videoEl.currentTime > 0 && !videoEl.paused && !videoEl.ended && videoEl.readyState > 2;
    }

    async getUserName(): Promise<string> {
        const userDropdownToggleEl = this.userDropdownToggleEl! as HTMLButtonElement;

        userDropdownToggleEl.click();

        await waitAsync(100);

        const userNameEl = document.querySelector('[data-a-target="user-display-name"]');
        const userName = userNameEl?.textContent!.toLowerCase() ?? '';

        userDropdownToggleEl.click();

        return userName;
    }
}
