import { generateDelay } from '../../../utils';
import {
    Commands, MessageTemplates, Timing, GlobalVariables
} from '../../../consts';
import { promisifiedSetTimeout, EventEmitter } from '@/components/shared';
import { IChatMessage } from '../../chat';

export interface IHitsquadRunnerRound {
    remainingRounds: number,
    stopped: boolean
}

export class HitsquadRunner {
    static #ROUNDS_UNTIL_COMMAND = GlobalVariables.HITSQUAD_GAMES_ON_SCREEN - 3;

    #chatFacade;
    #streamFacade;
    #events;

    #counter = { totalRounds: 0, roundsUntilCommand: 0 };

    private unsubscribe!: () => void;

    constructor({ chatFacade, streamFacade }: { chatFacade: any, streamFacade: any }) {
        this.#chatFacade = chatFacade;
        this.#streamFacade = streamFacade;
        this.#events = EventEmitter.create<{
            'hitsquadRunner:round': IHitsquadRunnerRound
        }>();
    }

    get events() {
        return this.#events;
    }

    #listenEvents() {
        this.unsubscribe = this.#chatFacade.observeChat((data: IChatMessage) => {
            this.#processMessage(data);
        });
    }

    async #processMessage({ message, isSystemMessage }: IChatMessage) {
        if (isSystemMessage && MessageTemplates.isHitsquadReward(message)) {
            this.#counter.totalRounds--;
            this.#counter.roundsUntilCommand--;
        }

        if (this.#counter.totalRounds <= 0) {
            this.stop();
            this.#emitEvent();
            promisifiedSetTimeout(Timing.MINUTE).then(() => this.#queueCommandSend());

            return;
        }

        if (this.#counter.roundsUntilCommand === 1) {
            this.#counter.roundsUntilCommand = HitsquadRunner.#ROUNDS_UNTIL_COMMAND;
            this.#queueCommandSend();
            this.#emitEvent();
        }
    }

    async #queueCommandSend() {
        await promisifiedSetTimeout(this.#generateDelay());
        await this.#sendCommand();
    }

    #generateDelay() {
        return generateDelay(30 * Timing.SECOND, 2 * Timing.MINUTE);
    }

    #emitEvent() {
        const remainingRounds = this.#counter.totalRounds;

        this.#events.emit('hitsquadRunner:round', { remainingRounds, stopped: remainingRounds <= 0 });
    }

    async #sendCommand(): Promise<void> {
        if (!this.#streamFacade.isAllowedToSendMessage) {
            await promisifiedSetTimeout(20 * Timing.SECOND);
            return this.#sendCommand();
        }

        this.#chatFacade.sendMessage(Commands.HITSQUAD);
    }

    start({ totalRounds }: { totalRounds: number }) {
        this.#counter = { totalRounds, roundsUntilCommand: HitsquadRunner.#ROUNDS_UNTIL_COMMAND };
        this.#listenEvents();
    }

    stop() {
        this.unsubscribe?.();
    }
}
