import { debounce, SettingsFacade } from '@components/shared';
import { TwitchFacade } from '@twitch/modules/twitch';

export const useDaCoinzCollector = () => {
    let observer: MutationObserver | null = null;
    const chatInputContainerEl = TwitchFacade.instance.chatButtonsContainerEl! as HTMLElement;

    const claimChannelPoints = debounce(() => {
        const claimButtonEl = chatInputContainerEl.querySelector('[aria-label="Claim Bonus"]');

        if (claimButtonEl) {
            (claimButtonEl as HTMLButtonElement).click();
        }
    }, 2000);

    if (SettingsFacade.instance.globalSettings.collectDaCoinz) {
        init();
    }

    SettingsFacade.instance.globalSettingsEvents.on('setting-changed:collectDaCoinz', (isEnabled) => {
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
