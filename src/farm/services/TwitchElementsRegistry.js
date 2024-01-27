export class TwitchElementsRegistry {
    onElementsReady(callback) {
        const interval = setInterval(() => {
            const videoEl = this.activeVideoEl;

            const elements = [
                this.chatContainerEl,
                this.chatInputEl,
                this.userDropdownToggleEl,
                videoEl
            ];

            if (elements.every((element) => !!element) && this.#isVideoPlaying(videoEl)) {
                clearInterval(interval);
                callback(elements);
            }
        }, 500);
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
        return this.chatContainerEl.querySelector('.chat-scrollable-area__message-container');
    }

    get chatButtonsContainerEl() {
        return this.chatContainerEl.querySelector('.chat-input__buttons-container');
    }

    #isVideoPlaying(videoEl) {
        return videoEl.currentTime > 0 && !videoEl.paused && !videoEl.ended && videoEl.readyState > 2;
    }
}
