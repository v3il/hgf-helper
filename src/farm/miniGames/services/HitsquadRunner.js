import { Container } from 'typedi';
import { generateMiniGameDelay, promisifiedSetTimeout } from '../../utils';
import {
    Commands, InjectionTokens, MessageTemplates, Timing, GlobalVariables
} from '../../consts';
import { SettingsFacade } from '../../settings';

export class HitsquadRunner {
    static #ENTRIES_COUNT_TARGET = GlobalVariables.HITSQUAD_GAMES_ON_SCREEN - 3;

    #completedGamesCount = 0;

    #twitchChatObserver;
    #twitchChatService;
    #streamStatusService;

    #isPaused = true;

    constructor(c/* { twitchChatObserver, twitchChatService, streamStatusService } */) {
        console.error(c);

        console.error('sf', c.get(SettingsFacade).getLocalSetting('hitsquadRunner'));

        // this.#twitchChatObserver = twitchChatObserver;
        // this.#twitchChatService = twitchChatService;
        // this.#streamStatusService = streamStatusService;

        // this.#listenEvents();
    }

    #listenEvents() {
        this.#twitchChatObserver.events.on('message', (data) => {
            if (!this.#isPaused) {
                this.#processMessage(data);
            } else {
                this.#completedGamesCount = 0;
            }
        });
    }

    #processMessage({ message, isSystemMessage }) {
        if (isSystemMessage && MessageTemplates.isHitsquadReward(message)) {
            this.#completedGamesCount++;
        }

        if (this.#completedGamesCount > 0 && this.#completedGamesCount % HitsquadRunner.#ENTRIES_COUNT_TARGET === 0) {
            this.#completedGamesCount = 0;
            this.#startNewRound();
        }
    }

    async #startNewRound() {
        await promisifiedSetTimeout(generateMiniGameDelay());
        await this.#sendCommands();
    }

    async #sendCommands() {
        if (this.#isPaused) {
            return;
        }

        if (!this.#streamStatusService.isAllowedToSendMessage) {
            await promisifiedSetTimeout(20 * Timing.SECOND);
            return this.#sendCommands();
        }

        this.#twitchChatService.sendMessage(Commands.HITSQUAD);
    }

    start() {
        this.#isPaused = false;
    }

    stop() {
        this.#isPaused = true;
        this.#completedGamesCount = 0;
    }
}
