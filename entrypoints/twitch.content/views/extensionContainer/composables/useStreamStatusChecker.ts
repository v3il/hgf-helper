import { Timing } from '@shared/consts';
import { StreamStatusService } from '@twitch/modules/stream';
import { Container } from 'typedi';
import { useBrokenStreamHandler } from './useBrokenStreamHandler';

interface IParams {
    el: HTMLElement;
}

export interface IStreamStatusChecker {
    destroy: () => void;
}

export const useStreamStatusChecker = ({ el }: IParams): IStreamStatusChecker => {
    const streamService = Container.get(StreamStatusService);
    const brokenStreamHandler = useBrokenStreamHandler();
    let timeoutId: number;

    async function handleStreamStatusCheck() {
        await streamService.checkStreamStatus();
        renderStatus();
        brokenStreamHandler.handleBrokenVideo(streamService.isVideoBroken);

        timeoutId = window.setTimeout(() => {
            handleStreamStatusCheck();
        }, 5 * Timing.SECOND);
    }

    function renderStatus() {
        el.classList.toggle('broken', streamService.isVideoBroken);
        el.classList.toggle('safe', streamService.isStreamOk);
    }

    handleStreamStatusCheck();

    return {
        destroy: () => {
            window.clearTimeout(timeoutId);
        }
    };
};
