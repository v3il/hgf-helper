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

        setTimeout(() => {
            handleStreamStatusCheck();
        }, 5 * Timing.SECOND);
    }

    function renderStatus() {
        el.classList.toggle('broken', streamFacade.isVideoBroken);
        el.classList.toggle('safe', streamFacade.isStreamOk);
    }

    handleStreamStatusCheck();
};
