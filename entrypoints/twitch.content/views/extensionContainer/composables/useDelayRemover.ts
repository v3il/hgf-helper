import { Timing } from '@shared/consts';
import { TwitchPlayerService } from '@twitch/modules/stream';
import { Container } from 'typedi';
import { SettingsFacade } from '@shared/modules';

export interface IDelayRemover {
    destroy: () => void;
}

export const useDelayRemover = () => {
    let intervalId: number = 0;

    const settingsFacade = Container.get(SettingsFacade);
    const playerService = Container.get(TwitchPlayerService);

    if (settingsFacade.settings.decreaseStreamDelay) {
        init();
    }

    const unsubscribe = settingsFacade.onSettingChanged('decreaseStreamDelay', (isEnabled) => {
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

    return {
        destroy: () => {
            unsubscribe();
            destroy();
        }
    };
};
