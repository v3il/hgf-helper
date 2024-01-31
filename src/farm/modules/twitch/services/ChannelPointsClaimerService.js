import { debounce } from '../../../utils';
import { TwitchElementsRegistry } from './TwitchElementsRegistry';

export class ChannelPointsClaimerService {
    #chatInputContainerEl;
    #observer;

    constructor(container) {
        const twitchElementsRegistry = container.get(TwitchElementsRegistry);

        this.#chatInputContainerEl = twitchElementsRegistry.chatButtonsContainerEl;
    }

    enableAutoClaim() {
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
