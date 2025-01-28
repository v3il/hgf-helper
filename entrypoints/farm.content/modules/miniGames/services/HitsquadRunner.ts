import { generateDelay } from '@farm/utils';
import { Commands, Timing } from '@farm/consts';
import {
    promisifiedSetTimeout, EventEmitter, SettingsFacade, log, UnsubscribeTrigger
} from '@components/shared';
import { StreamFacade } from '@farm/modules/stream';
import { ChatFacade } from '../../chat';

interface IParams {
    chatFacade: ChatFacade;
    streamFacade: StreamFacade;
    settingsFacade: SettingsFacade
}

interface IHitsquadRunnerState {
    isRunning: boolean,
    remainingRounds: number
}

const HITSQUAD_GAMES_ON_SCREEN = 12;

export class HitsquadRunner {
    readonly events;

    private readonly chatFacade: ChatFacade;
    private readonly streamFacade: StreamFacade;
    private readonly settingsFacade: SettingsFacade;

    private state!: IHitsquadRunnerState;
    private timeout!: number;
    private lastHitsquadRewardTimestamp!: number;
    private unsubscribe!: UnsubscribeTrigger;

    constructor({ chatFacade, streamFacade, settingsFacade }: IParams) {
        this.chatFacade = chatFacade;
        this.streamFacade = streamFacade;
        this.settingsFacade = settingsFacade;

        this.events = EventEmitter.create<{
            end: void
        }>();

        this.state = this.getState();

        if (this.state.isRunning) {
            this.start();
        }
    }

    get isRunning() {
        return this.state.isRunning;
    }

    start(rounds?: number) {
        if (rounds) {
            this.state = { isRunning: true, remainingRounds: rounds };
            this.saveState();
        }

        log(`HGF helper: start Hitsquad runner with ${this.state.remainingRounds} rounds`);

        this.listenEvents();
        this.scheduleNextRound();
    }

    stop() {
        this.state = { isRunning: false, remainingRounds: 0 };
        this.saveState();
        clearTimeout(this.timeout);
        this.unsubscribe?.();
    }

    participateOnce() {
        this.chatFacade.sendMessage(Commands.HITSQUAD);
    }

    private getState(): IHitsquadRunnerState {
        return {
            isRunning: this.settingsFacade.localSettings.hitsquad,
            remainingRounds: this.settingsFacade.localSettings.hitsquadRounds
        };
    }

    private saveState() {
        this.settingsFacade.updateLocalSettings({
            hitsquad: this.state.isRunning,
            hitsquadRounds: this.state.remainingRounds
        });
    }

    private listenEvents() {
        this.unsubscribe = this.chatFacade.observeChat(({ isHitsquadReward }) => {
            if (isHitsquadReward) {
                this.lastHitsquadRewardTimestamp = Date.now();
            }
        });
    }

    private get isBotWorking() {
        return Date.now() - this.lastHitsquadRewardTimestamp < 20 * Timing.MINUTE;
    }

    private async sendCommand(): Promise<void> {
        if (!this.streamFacade.isStreamOk) {
            await promisifiedSetTimeout(20 * Timing.SECOND);
            return this.sendCommand();
        }

        this.chatFacade.sendMessage(Commands.HITSQUAD);
        this.state.remainingRounds -= HITSQUAD_GAMES_ON_SCREEN;
        this.saveState();
    }

    private getNextRoundDelay() {
        return generateDelay(30 * Timing.SECOND, 5 * Timing.MINUTE) + 10 * Timing.MINUTE;
    }

    private scheduleNextRound() {
        this.timeout = window.setTimeout(async () => {
            if (!this.isBotWorking) {
                log('Bot is not working, scheduling next round');
                return this.scheduleNextRound();
            }

            await this.sendCommand();

            if (this.state.remainingRounds > 0) {
                return this.scheduleNextRound();
            }

            this.stop();
            this.events.emit('end');
        }, this.getNextRoundDelay());
    }
}
