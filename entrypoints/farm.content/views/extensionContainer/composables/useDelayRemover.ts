import { GlobalVariables } from '@farm/consts';
import { StreamFacade } from '@farm/modules/stream';

export const useDelayRemover = (streamFacade: StreamFacade) => {
    setInterval(() => {
        streamFacade.decreaseVideoDelay();
    }, GlobalVariables.DECREASE_DELAY_TIMEOUT);
};
