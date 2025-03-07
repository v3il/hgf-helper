import { debounce } from '../../../utils';
import { TwitchElementsRegistry } from './TwitchElementsRegistry';

export class ChannelPointsClaimerService {
    private twitchElementsRegistry;
    private chatInputContainerEl!: HTMLElement;
    private observer!: MutationObserver;

    constructor({ twitchElementsRegistry }: { twitchElementsRegistry: TwitchElementsRegistry }) {
        this.twitchElementsRegistry = twitchElementsRegistry;
    }

    enableAutoClaim() {
        this.chatInputContainerEl = this.twitchElementsRegistry.chatButtonsContainerEl! as HTMLElement;

        this.observer = this.#createObserver();
        this.observer.observe(this.chatInputContainerEl, { childList: true, subtree: true });

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
        const claimButtonEl = this.chatInputContainerEl.querySelector('[aria-label="Claim Bonus"]');

        if (claimButtonEl) {
            (claimButtonEl as HTMLButtonElement).click();
        }
    }, 2000);
}
