import { generateDelay } from '@farm/utils';
import {
    Commands, MessageTemplates, Timing, GlobalVariables
} from '@farm/consts';
import { promisifiedSetTimeout, EventEmitter, SettingsFacade } from '@components/shared';
import { StreamFacade } from '@farm/modules/stream';
import { ChatFacade, IChatMessage } from '../../chat';

interface IParams {
    chatFacade: ChatFacade;
    streamFacade: StreamFacade;
    settingsFacade: SettingsFacade
}

interface IHitsquadRunnerRound {
    remainingRounds: number,
    stopped: boolean
}

export class HitsquadRunner {
    static #ROUNDS_UNTIL_COMMAND = GlobalVariables.HITSQUAD_GAMES_ON_SCREEN - 3;

    readonly events;

    private readonly chatFacade: ChatFacade;
    private readonly streamFacade: StreamFacade;
    private readonly settingsFacade: SettingsFacade;

    private counter = { totalRounds: 0, roundsUntilCommand: 0 };
    private unsubscribe!: () => void;

    constructor({ chatFacade, streamFacade, settingsFacade }: IParams) {
        this.chatFacade = chatFacade;
        this.streamFacade = streamFacade;
        this.settingsFacade = settingsFacade;

        this.events = EventEmitter.create<{
            'hitsquadRunner:round': IHitsquadRunnerRound
        }>();
    }

    private listenEvents() {
        this.unsubscribe = this.chatFacade.observeChat((data) => {
            this.processMessage(data);
        });
    }

    private async processMessage({ message, isSystemMessage }: IChatMessage) {
        if (isSystemMessage && MessageTemplates.isHitsquadReward(message)) {
            this.counter.totalRounds--;
            this.counter.roundsUntilCommand--;
        }

        if (this.counter.totalRounds <= 0) {
            this.stop();
            this.#emitEvent();
            promisifiedSetTimeout(Timing.MINUTE).then(() => this.queueCommandSend());

            return;
        }

        if (this.counter.roundsUntilCommand === 1) {
            this.counter.roundsUntilCommand = HitsquadRunner.#ROUNDS_UNTIL_COMMAND;
            this.queueCommandSend();
            this.#emitEvent();
        }
    }

    async queueCommandSend() {
        await promisifiedSetTimeout(this.#generateDelay());
        await this.#sendCommand();
    }

    #generateDelay() {
        return generateDelay(30 * Timing.SECOND, 2 * Timing.MINUTE);
    }

    #emitEvent() {
        const remainingRounds = this.counter.totalRounds;

        this.events.emit('hitsquadRunner:round', { remainingRounds, stopped: remainingRounds <= 0 });
    }

    async #sendCommand(): Promise<void> {
        if (!this.streamFacade.isStreamOk) {
            await promisifiedSetTimeout(20 * Timing.SECOND);
            return this.#sendCommand();
        }

        this.chatFacade.sendMessage(Commands.HITSQUAD);
    }

    start({ totalRounds }: { totalRounds: number }) {
        this.counter = { totalRounds, roundsUntilCommand: HitsquadRunner.#ROUNDS_UNTIL_COMMAND };
        this.listenEvents();
    }

    stop() {
        this.unsubscribe?.();
    }
}
