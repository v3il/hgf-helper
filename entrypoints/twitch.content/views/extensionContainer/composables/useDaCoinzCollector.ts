import { Container } from 'typedi';
import { TwitchElementsRegistry } from '@twitch/modules';
import { debounce } from '@components/utils';
import { GlobalSettingsService } from '@components/settings';

export const useDaCoinzCollector = () => {
    let observer: MutationObserver | null = null;
    const twitchElementsRegistry = Container.get(TwitchElementsRegistry);
    const settingsService = Container.get(GlobalSettingsService);
    const chatInputContainerEl = twitchElementsRegistry.chatButtonsContainerEl! as HTMLElement;

    const claimChannelPoints = debounce(() => {
        const claimButtonEl = chatInputContainerEl.querySelector('[aria-label="Claim Bonus"]');

        if (claimButtonEl) {
            (claimButtonEl as HTMLButtonElement).click();
        }
    }, 2000);

    if (settingsService.settings.collectDaCoinz) {
        init();
    }

    settingsService.events.on('setting-changed:collectDaCoinz', (isEnabled) => {
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
};
