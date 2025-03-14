import { Commands, Timing } from '@twitch/consts';
import {
    promisifiedSetTimeout, EventEmitter, SettingsFacade, log, UnsubscribeTrigger, getRandomNumber
} from '@components/shared';
import { StreamFacade } from '@twitch/modules/stream';
import { Container } from 'typedi';
import { TwitchElementsRegistry } from '@twitch/modules';
import { ChatFacade } from '../chat';

interface IParams {
    chatFacade: ChatFacade;
    streamFacade: StreamFacade;
    settingsFacade: SettingsFacade;
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

export class HitsquadGameService {
    readonly events;

    private readonly chatFacade: ChatFacade;
    private readonly streamFacade: StreamFacade;
    private readonly settingsFacade: SettingsFacade;
    private readonly twitchElementsRegistry: TwitchElementsRegistry;

    timeUntilMessage!: number;
    private totalRounds!: number;
    private state!: IHitsquadRunnerState;
    private timeout!: number;
    private lastHitsquadRewardTimestamp!: number;
    private unsubscribe!: UnsubscribeTrigger;

    constructor({ chatFacade, streamFacade, settingsFacade }: IParams) {
        this.chatFacade = chatFacade;
        this.streamFacade = streamFacade;
        this.settingsFacade = settingsFacade;

        this.twitchElementsRegistry = Container.get(TwitchElementsRegistry);

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

        log(`Start Hitsquad service with ${this.state.remainingRounds} rounds`);

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

    participate() {
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
        if (this.twitchElementsRegistry.isAdsPhase) {
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
        return getRandomNumber(30 * Timing.SECOND, 5 * Timing.MINUTE) + 8 * Timing.MINUTE;
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
