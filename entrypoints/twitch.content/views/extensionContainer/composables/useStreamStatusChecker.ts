import { Timing } from '@components/consts';
import { StreamStatusService } from '@twitch/modules/stream';
import { Container } from 'typedi';
import { useBrokenStreamHandler } from './useBrokenStreamHandler';

interface IParams {
    el: HTMLElement;
}

export const useStreamStatusChecker = ({ el }: IParams) => {
    const streamService = Container.get(StreamStatusService);
    const brokenStreamHandler = useBrokenStreamHandler();

    async function handleStreamStatusCheck() {
        await streamService.checkStreamStatus();
        renderStatus();
        brokenStreamHandler.handleBrokenVideo(streamService.isVideoBroken);

        setTimeout(() => {
            handleStreamStatusCheck();
        }, 5 * Timing.SECOND);
    }

    function renderStatus() {
        el.classList.toggle('broken', streamService.isVideoBroken);
        el.classList.toggle('safe', streamService.isStreamOk);
    }

    handleStreamStatusCheck();
};
