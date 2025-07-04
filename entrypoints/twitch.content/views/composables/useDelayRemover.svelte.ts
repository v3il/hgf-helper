import { TwitchPlayerService } from '@twitch/modules/stream';
import { Container } from 'typedi';
import { SettingsFacade } from '@shared/modules';
import { onDestroy } from 'svelte';
import { config } from '@twitch/config';

export const useDelayRemover = () => {
    let intervalId: number;

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
        }, config.delayRemoverInterval);
    }

    function destroy() {
        clearInterval(intervalId);
    }

    onDestroy(() => {
        destroy();
        unsubscribe();
    });
};
