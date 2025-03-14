import { Timing } from '@twitch/consts';
import { StreamFacade } from '@twitch/modules/stream';
import { SettingsFacade } from '@components/shared';

export const useDelayRemover = () => {
    let intervalId: number = 0;

    if (SettingsFacade.instance.globalSettings.decreaseStreamDelay) {
        init();
    }

    SettingsFacade.instance.globalSettingsEvents.on('setting-changed:decreaseStreamDelay', (isEnabled) => {
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
