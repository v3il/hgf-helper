import { Timing } from '@farm/consts';
import { StreamFacade } from '@farm/modules/stream';
import { useBrokenStreamHandler } from './useBrokenStreamHandler';

interface IParams {
    el: HTMLElement;
}

export const useStreamStatusChecker = ({ el }: IParams) => {
    const streamFacade = StreamFacade.instance;
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
        return 5 * Timing.SECOND;
    }

    handleStreamStatusCheck();
};
