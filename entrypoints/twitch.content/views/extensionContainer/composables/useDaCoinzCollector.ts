import { Container } from 'typedi';
import { TwitchUIService } from '@twitch/modules';
import { debounce } from '@utils';
import { SettingsFacade } from '@shared/modules';

export interface IDaCoinzCollector {
    destroy: () => void;
}

export const useDaCoinzCollector = (): IDaCoinzCollector => {
    let observer: MutationObserver | null = null;
    const settingsFacade = Container.get(SettingsFacade);
    const twitchUIService = Container.get(TwitchUIService);
    const chatInputContainerEl = twitchUIService.chatButtonsContainerEl! as HTMLElement;

    const claimChannelPoints = debounce(() => {
        const claimButtonEl = chatInputContainerEl.querySelector('[aria-label="Claim Bonus"]');

        if (claimButtonEl) {
            (claimButtonEl as HTMLButtonElement).click();
        }
    }, 2000);

    if (settingsFacade.settings.collectDaCoinz) {
        init();
    }

    const unsubscribe = settingsFacade.onSettingChanged('collectDaCoinz', (isEnabled) => {
        isEnabled ? init() : destroy();
    });

    function createObserver() {
        return new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    claimChannelPoints();
                }
            });
        });
    }

    function init() {
        observer = createObserver();
        observer.observe(chatInputContainerEl, { childList: true, subtree: true });
        claimChannelPoints();
    }

    function destroy() {
        observer?.disconnect();
    }

    return {
        destroy: () => {
            unsubscribe();
            destroy();
        }
    };
};
