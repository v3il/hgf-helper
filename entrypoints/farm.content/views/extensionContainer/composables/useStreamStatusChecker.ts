import { Timing } from '@farm/consts';
import { StreamFacade } from '@farm/modules/stream';
import { useBrokenStreamHandler } from './useBrokenStreamHandler';

interface IParams {
    el: HTMLElement;
    streamFacade: StreamFacade
}

const ANTI_CHEAT_DURATION = 2 * Timing.MINUTE;

export const useStreamStatusChecker = ({ el, streamFacade }: IParams) => {
    const brokenStreamHandler = useBrokenStreamHandler();

    function handleStreamStatusCheck() {
        streamFacade.checkStreamStatus();
        renderStatus();
        brokenStreamHandler.handleBrokenVideo(streamFacade.isVideoBroken);

        const nextCheckDelay = getNextCheckDelay();

        setTimeout(() => {
            handleStreamStatusCheck();
        }, nextCheckDelay);
    }

    function renderStatus() {
        el.classList.toggle('broken', streamFacade.isVideoBroken);
        el.classList.toggle('anticheat', streamFacade.isAntiCheatScreen);
        el.classList.toggle('safe', streamFacade.isStreamOk);
    }

    function getNextCheckDelay() {
        // if (streamFacade.isAntiCheatScreen) {
        //     return ANTI_CHEAT_DURATION + 10 * Timing.SECOND;
        // }

        return 5 * Timing.SECOND;
    }

    handleStreamStatusCheck();
};
