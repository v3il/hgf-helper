import { Timing } from '@twitch/consts';
import { StreamFacade } from '@twitch/modules/stream';

const DECREASE_DELAY_TIMEOUT = 5 * Timing.MINUTE;

export const useDelayRemover = () => {
    setInterval(() => {
        StreamFacade.instance.decreaseVideoDelay();
    }, DECREASE_DELAY_TIMEOUT);
};
