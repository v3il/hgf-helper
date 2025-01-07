import { debounce } from '../../../utils';

export class ChannelPointsClaimerService {
    #twitchElementsRegistry;
    #chatInputContainerEl;
    #observer;

    constructor({ twitchElementsRegistry }) {
        this.#twitchElementsRegistry = twitchElementsRegistry;
    }

    enableAutoClaim() {
        this.#chatInputContainerEl = this.#twitchElementsRegistry.chatButtonsContainerEl;

        this.#observer = this.#createObserver();
        this.#observer.observe(this.#chatInputContainerEl, { childList: true, subtree: true });

        this.#claimChannelPoints();
    }

    #createObserver() {
        return new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    this.#claimChannelPoints();
                }
            });
        });
    }

    #claimChannelPoints = debounce(() => {
        const claimButtonEl = this.#chatInputContainerEl.querySelector('[aria-label="Claim Bonus"]');

        if (claimButtonEl) {
            claimButtonEl.click();
        }
    }, 2000);
}
