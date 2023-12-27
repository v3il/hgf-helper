import { debounce } from '../utils';

export class ChannelPointsClaimerService {
    static create(chatInputContainerEl) {
        return new ChannelPointsClaimerService({ chatInputContainerEl });
    }

    #chatInputContainerEl;
    #observer;

    constructor({ chatInputContainerEl }) {
        this.#chatInputContainerEl = chatInputContainerEl;

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
