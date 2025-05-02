import { Container } from 'typedi';
import { TwitchUIService } from '@twitch/modules';
import { SettingsFacade } from '@shared/modules';
import { onDestroy } from 'svelte';
import { debounce } from 'lodash';

export const useDaCoinzCollector = () => {
    let observer: MutationObserver | null = null;
    const settingsFacade = Container.get(SettingsFacade);
    const twitchUIService = Container.get(TwitchUIService);
    const chatInputContainerEl = twitchUIService.chatButtonsContainerEl! as HTMLElement;

    const claimChannelPoints = debounce(() => {
        const claimButtonEl = chatInputContainerEl.querySelector<HTMLButtonElement>('[aria-label="Claim Bonus"]');

        if (claimButtonEl) {
            claimButtonEl.click();
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

    onDestroy(() => {
        destroy();
        unsubscribe();
    });
};
