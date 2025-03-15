import { Commands } from '@twitch/consts';
import { StreamFacade } from '@twitch/modules/stream';
import { Container } from 'typedi';
import { TwitchUIService } from '@twitch/modules';
import { LocalSettingsService } from '@components/settings';
import { EventEmitter, UnsubscribeTrigger } from '@components/EventEmitter';
import { getRandomNumber, log, promisifiedSetTimeout } from '@components/utils';
import { Timing } from '@components/consts';
import { ChatObserver, MessageSender } from '@twitch/modules/twitchChat';

interface IParams {
    streamFacade: StreamFacade;
    settingsService: LocalSettingsService;
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

    private readonly messageSender: MessageSender;
    private readonly chatObserver: ChatObserver;
    private readonly streamFacade: StreamFacade;
    private readonly settingsService: LocalSettingsService;
    private readonly twitchUIService: TwitchUIService;

    timeUntilMessage!: number;
    private totalRounds!: number;
    private state!: IHitsquadRunnerState;
    private timeout!: number;
    private lastHitsquadRewardTimestamp!: number;
    private unsubscribe!: UnsubscribeTrigger;

    constructor({ streamFacade, settingsService }: IParams) {
        this.streamFacade = streamFacade;
        this.settingsService = settingsService;

        this.messageSender = Container.get(MessageSender);
        this.chatObserver = Container.get(ChatObserver);
        this.twitchUIService = Container.get(TwitchUIService);

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
        this.messageSender.sendMessage(Commands.HITSQUAD);
    }

    private getState(): IHitsquadRunnerState {
        return {
            isRunning: this.settingsService.settings.hitsquad,
            remainingRounds: this.settingsService.settings.hitsquadRounds
        };
    }

    private saveState() {
        this.settingsService.updateSettings({
            hitsquad: this.state.isRunning,
            hitsquadRounds: this.state.remainingRounds
        });
    }

    private listenEvents() {
        this.unsubscribe = this.chatObserver.observeChat(({ isHitsquadReward }) => {
            if (isHitsquadReward) {
                this.lastHitsquadRewardTimestamp = Date.now();
            }
        });
    }

    private get isBotWorking() {
        return Date.now() - this.lastHitsquadRewardTimestamp < 20 * Timing.MINUTE;
    }

    private async sendCommand(): Promise<void> {
        if (this.twitchUIService.isAdsPhase) {
            const delay = 20 * Timing.SECOND;

            this.timeUntilMessage = Date.now() + delay;
            await promisifiedSetTimeout(delay);
            return this.sendCommand();
        }

        this.messageSender.sendMessage(Commands.HITSQUAD);
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
