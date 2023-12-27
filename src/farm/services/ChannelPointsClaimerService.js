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

        this.#checkClaimButton();
        this.#checkClaimButton();
        this.#checkClaimButton();
        this.#checkClaimButton();
        this.#checkClaimButton();
    }

    #createObserver() {
        return new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    this.#checkClaimButton();
                }
            });
        });
    }

    #checkClaimButton = debounce(() => {
        const claimButtonEl = this.#chatInputContainerEl.querySelector('[aria-label="Claim Bonus"]');

        console.error('check');

        if (claimButtonEl) {
            console.error('Claim button found, clicking it');
            claimButtonEl.click();
        }
    }, 1000);
}
