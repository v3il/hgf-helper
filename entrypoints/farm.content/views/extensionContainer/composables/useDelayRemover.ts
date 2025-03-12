import { Timing } from '@farm/consts';
import { StreamFacade } from '@farm/modules/stream';

const DECREASE_DELAY_TIMEOUT = 5 * Timing.MINUTE;

export const useDelayRemover = () => {
    setInterval(() => {
        StreamFacade.instance.decreaseVideoDelay();
    }, DECREASE_DELAY_TIMEOUT);
};
