import { Timing } from '@farm/consts';
import { TwitchFacade } from '@farm/modules/twitch';

const DECREASE_DELAY_TIMEOUT = 5 * Timing.MINUTE;

export const useDelayRemover = () => {
    setInterval(() => {
        TwitchFacade.instance.decreaseVideoDelay();
    }, DECREASE_DELAY_TIMEOUT);
};
