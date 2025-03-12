import { debounce } from '@farm/utils';
import { ContainerInstance, Service } from 'typedi';
import { TwitchElementsRegistry } from './TwitchElementsRegistry';

@Service()
export class ChannelPointsClaimerService {
    private readonly twitchElementsRegistry!: TwitchElementsRegistry;
    private chatInputContainerEl!: HTMLElement;
    private observer!: MutationObserver;

    constructor(container: ContainerInstance) {
        this.twitchElementsRegistry = container.get(TwitchElementsRegistry);
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
