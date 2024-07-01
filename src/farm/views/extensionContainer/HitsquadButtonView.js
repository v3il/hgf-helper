import { Commands } from '@/farm/consts';
import { NestableView } from '@/farm/views/NestableView';

export class HitsquadButtonView extends NestableView {
    #chatFacade;
    #streamFacade;

    constructor({ el, chatFacade, streamFacade }) {
        super({ el });

        this.#chatFacade = chatFacade;
        this.#streamFacade = streamFacade;

        this.#listenEvents();
    }

    #listenEvents() {
        this.el.addEventListener('click', (event) => {
            if (this.#streamFacade.isAllowedToSendMessage || event.ctrlKey) {
                this.#chatFacade.sendMessage(Commands.HITSQUAD, true);
            }
        });
    }
}
