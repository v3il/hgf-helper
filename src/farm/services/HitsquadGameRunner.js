import { Commands, MessageTemplates } from '../consts';
import { promisifiedSetTimeout } from '../utils/promisifiedSetTimeout';

export class HitsquadGameRunner {
    static create({ twitchChatObserver, twitchChatService, streamStatusService }) {
        return new HitsquadGameRunner({ twitchChatObserver, twitchChatService, streamStatusService });
    }

    #completedGamesCount = 0;
    #twitchChatObserver;
    #twitchChatService;
    #streamStatusService;

    constructor({ twitchChatObserver, twitchChatService, streamStatusService }) {
        this.#twitchChatObserver = twitchChatObserver;
        this.#twitchChatService = twitchChatService;
        this.#streamStatusService = streamStatusService;

        this.#listenEvents();
    }

    #listenEvents() {
        this.#twitchChatObserver.events.on('message', ({ userName, message }) => {
            this.#processMessage({ userName, message });
        });
    }

    async #processMessage({ userName, message }) {
        if (userName === 'hitsquadgodfather' && message.includes(MessageTemplates.HITSQUAD_REWARD.toLowerCase())) {
            this.#completedGamesCount++;
        }

        if (this.#completedGamesCount === 1) {
            this.#completedGamesCount = 0;

            if (this.#streamStatusService.isBanPhase) {
                await promisifiedSetTimeout(5 * 60 * 1000);
            }

            this.#sendCommands();
        }
    }

    async #sendCommands() {
        this.#twitchChatService.sendMessage(Commands.HITSQUAD);
    }
}
