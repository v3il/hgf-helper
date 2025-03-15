import { Timing } from '@components/consts';
import { TwitchPlayerService } from '@twitch/modules/stream';
import { GlobalSettingsService } from '@components/settings';
import { Container } from 'typedi';

export const useDelayRemover = () => {
    let intervalId: number = 0;

    const settingsService = Container.get(GlobalSettingsService);
    const playerService = Container.get(TwitchPlayerService);

    if (settingsService.settings.decreaseStreamDelay) {
        init();
    }

    settingsService.events.on('setting-changed:decreaseStreamDelay', (isEnabled) => {
        isEnabled ? init() : destroy();
    });

    function init() {
        intervalId = window.setInterval(() => {
            playerService.decreaseVideoDelay();
        }, 5 * Timing.MINUTE);
    }

    function destroy() {
        clearInterval(intervalId);
    }
};
