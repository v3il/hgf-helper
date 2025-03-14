import { Timing } from '@twitch/consts';
import { StreamFacade } from '@twitch/modules/stream';
import { GlobalSettingsService } from '@components/settings';
import { Container } from 'typedi';

export const useDelayRemover = () => {
    let intervalId: number = 0;
    const settingsService = Container.get(GlobalSettingsService);

    if (settingsService.settings.decreaseStreamDelay) {
        init();
    }

    settingsService.events.on('setting-changed:decreaseStreamDelay', (isEnabled) => {
        isEnabled ? init() : destroy();
    });

    function init() {
        intervalId = window.setInterval(() => {
            StreamFacade.instance.decreaseVideoDelay();
        }, 5 * Timing.MINUTE);
    }

    function destroy() {
        clearInterval(intervalId);
    }
};
