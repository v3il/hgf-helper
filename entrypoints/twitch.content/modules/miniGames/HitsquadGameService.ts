import { Container } from 'typedi';
import { TwitchUIService } from '@twitch/modules';
import { EventEmitter, UnsubscribeTrigger } from '@shared/EventEmitter';
import { getRandomNumber, log, waitAsync } from '@utils';
import { Timing } from '@shared/consts';
import { ChatObserver, MessageSender } from '@twitch/modules/twitchChat';
import { StreamStatusService } from '@twitch/modules/stream';
import { SettingsFacade } from '@shared/modules';

interface IHitsquadRunnerState {
    isRunning: boolean,
    remainingRounds: number
}

interface IRoundsData {
    total: number
    left: number
}

const HITSQUAD_GAMES_ON_SCREEN = 12;
const COMMAND = '!hitsquad';

export class HitsquadGameService {
    readonly events;

    private readonly messageSender: MessageSender;
    private readonly chatObserver: ChatObserver;
    private readonly twitchUIService: TwitchUIService;
    private readonly streamStatusService: StreamStatusService;
    private readonly settingsFacade: SettingsFacade;

    timeUntilMessage!: number;
    private totalRounds!: number;
    private state!: IHitsquadRunnerState;
    private timeout!: number;
    private lastHitsquadRewardTimestamp!: number;
    private unsubscribe!: UnsubscribeTrigger;

    constructor() {
        this.settingsFacade = Container.get(SettingsFacade);
        this.messageSender = Container.get(MessageSender);
        this.chatObserver = Container.get(ChatObserver);
        this.twitchUIService = Container.get(TwitchUIService);
        this.streamStatusService = Container.get(StreamStatusService);

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
        this.messageSender.sendMessage(COMMAND);
    }

    private getState(): IHitsquadRunnerState {
        return {
            isRunning: this.settingsFacade.settings.hitsquad,
            remainingRounds: this.settingsFacade.settings.hitsquadRounds
        };
    }

    private saveState() {
        this.settingsFacade.updateSettings({
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
        if (this.twitchUIService.isAdsPhase || this.streamStatusService.isVideoBroken) {
            const delay = 20 * Timing.SECOND;

            this.timeUntilMessage = Date.now() + delay;
            await waitAsync(delay);
            return this.sendCommand();
        }

        this.messageSender.sendMessage(COMMAND);
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
