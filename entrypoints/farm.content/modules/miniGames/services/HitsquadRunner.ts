import { generateDelay } from '@farm/utils';
import { Commands, Timing } from '@farm/consts';
import {
    promisifiedSetTimeout, EventEmitter, SettingsFacade, log, UnsubscribeTrigger
} from '@components/shared';
import { StreamFacade } from '@farm/modules/stream';
import { TwitchFacade } from '@farm/modules/twitch';
import { ChatFacade } from '../../chat';

interface IParams {
    chatFacade: ChatFacade;
    streamFacade: StreamFacade;
    settingsFacade: SettingsFacade;
    twitchFacade: TwitchFacade
}

interface IHitsquadRunnerState {
    isRunning: boolean,
    remainingRounds: number
}

interface IRoundsData {
    total: number
    left: number
}

const HITSQUAD_GAMES_ON_SCREEN = 12;

export class HitsquadRunner {
    readonly events;

    private readonly chatFacade: ChatFacade;
    private readonly streamFacade: StreamFacade;
    private readonly settingsFacade: SettingsFacade;
    private readonly twitchFacade: TwitchFacade;

    timeUntilMessage!: number;
    private totalRounds!: number;
    private state!: IHitsquadRunnerState;
    private timeout!: number;
    private lastHitsquadRewardTimestamp!: number;
    private unsubscribe!: UnsubscribeTrigger;

    constructor({
        chatFacade, streamFacade, settingsFacade, twitchFacade
    }: IParams) {
        this.chatFacade = chatFacade;
        this.streamFacade = streamFacade;
        this.settingsFacade = settingsFacade;
        this.twitchFacade = twitchFacade;

        this.events = EventEmitter.create<{
            round: void,
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

    get roundsData(): IRoundsData {
        return {
            total: this.totalRounds,
            left: this.state.remainingRounds
        };
    }

    start(rounds?: number) {
        if (rounds) {
            this.state = { isRunning: true, remainingRounds: rounds };
            this.saveState();
        }

        log(`HGF helper: start Hitsquad runner with ${this.state.remainingRounds} rounds`);

        this.totalRounds = this.state.remainingRounds;

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
        if (this.twitchFacade.isAdsPhase) {
            const delay = 20 * Timing.SECOND;

            this.timeUntilMessage = Date.now() + delay;
            await promisifiedSetTimeout(delay);
            return this.sendCommand();
        }

        this.chatFacade.sendMessage(Commands.HITSQUAD);
        this.state.remainingRounds -= HITSQUAD_GAMES_ON_SCREEN;
        this.saveState();

        if (this.state.remainingRounds > 0) {
            this.events.emit('round');
        }
    }

    private getNextRoundDelay() {
        // return generateDelay(30 * Timing.SECOND, Timing.MINUTE) + 3 * Timing.MINUTE;
        return generateDelay(30 * Timing.SECOND, 5 * Timing.MINUTE) + 8 * Timing.MINUTE;
    }

    private scheduleNextRound() {
        const delay = this.getNextRoundDelay();

        this.timeUntilMessage = Date.now() + delay;

        this.timeout = window.setTimeout(async () => {
            if (!this.isBotWorking) {
                log('Bot is not working, scheduling next round');
                return this.scheduleNextRound();
            }

            await this.sendCommand();

            if (this.state.remainingRounds > 0) {
                return this.scheduleNextRound();
            }

            this.timeUntilMessage = 0;
            this.stop();
            this.events.emit('end');
        }, delay);
    }
}
