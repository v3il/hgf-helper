import { promisifiedSetTimeout } from '@components/shared';
import { Timing } from '@farm/consts';

export class TwitchElementsRegistry {
    onElementsReady(callback: (elements: Element[]) => void) {
        const reloadTimeout = setTimeout(() => window.location.reload(), Timing.SECOND * 30);

        const interval = setInterval(async () => {
            const videoEl = this.activeVideoEl;

            const elements = [
                this.chatContainerEl,
                this.chatInputEl,
                this.chatScrollableAreaEl,
                this.userDropdownToggleEl,
                videoEl
            ];

            if (
                elements.every((element) => !!element)
                && this.#isVideoPlaying(videoEl!)
                && this.currentGame
                && await this.getUserName()
            ) {
                clearInterval(interval);
                clearTimeout(reloadTimeout);
                callback(elements);
            }
        }, Timing.SECOND);
    }

    get activeVideoEl() {
        const [mainVideoEl, alternativeVideoEl] = document.querySelectorAll('video');

        if (this.#isAdsPhase && !alternativeVideoEl) {
            return null;
        }

        return this.#isAdsPhase ? alternativeVideoEl : mainVideoEl;
    }

    get #isAdsPhase() {
        return !!document.querySelector('[data-a-target="video-ad-countdown"]');
    }

    get chatContainerEl() {
        return document.querySelector('.chat-shell');
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

    async getUserName() {
        const userDropdownToggleEl = this.userDropdownToggleEl! as HTMLButtonElement;

        userDropdownToggleEl.click();

        await promisifiedSetTimeout(100);

        const userNameEl = document.querySelector('[data-a-target="user-display-name"]');
        const userName = userNameEl?.textContent!.toLowerCase() ?? '';

        userDropdownToggleEl.click();

        return userName;
    }
}
