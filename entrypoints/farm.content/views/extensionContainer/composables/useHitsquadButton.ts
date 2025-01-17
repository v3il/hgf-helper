import { Commands, GlobalVariables } from '@farm/consts';
import { StreamFacade } from '@farm/modules/stream';
import { ChatFacade } from '@farm/modules/chat';

interface IParams {
    el: HTMLElement;
    streamFacade: StreamFacade,
    chatFacade: ChatFacade
}

export const useHitsquadButton = ({ el, streamFacade, chatFacade }: IParams) => {
    const sendHitsquadButton = el.querySelector<HTMLButtonElement>('[data-hitsquad]')!;

    sendHitsquadButton.addEventListener('click', (event) => {
        if (streamFacade.isStreamOk || event.ctrlKey) {
            chatFacade.sendMessage(Commands.HITSQUAD, event.ctrlKey);
        }
    });
};
