import { Timing } from '@components/consts';
import { getRandomNumber, log, waitAsync } from '@components/utils';
import { Container } from 'typedi';
import { MessageSender } from '@twitch/modules/twitchChat';
import { TwitchUIService } from '@twitch/modules';
import { StreamStatusService } from '@twitch/modules/stream';
import { EventEmitter } from '@components/EventEmitter';

const COMMAND = '!loot';

export class LootGameService {
    private readonly messageSender: MessageSender;
    private readonly twitchUIService: TwitchUIService;
    private readonly streamStatusService: StreamStatusService;

    private timeoutId!: number;

    timeUntilMessage!: number;

    events = EventEmitter.create<{
        roundCompleted: void,
    }>();

    constructor() {
        this.messageSender = Container.get(MessageSender);
        this.twitchUIService = Container.get(TwitchUIService);
        this.streamStatusService = Container.get(StreamStatusService);
    }

    start() {
        log('Start Loot service');
        this.scheduleNextRound();
    }

    stop() {
        clearTimeout(this.timeoutId);
        this.timeUntilMessage = 0;
    }

    participate() {
        this.messageSender.sendMessage(`${COMMAND}${getRandomNumber(1, 8)}`);
    }

    private async sendCommand(): Promise<void> {
        if (this.twitchUIService.isAdsPhase || this.streamStatusService.isVideoBroken) {
            const delay = 20 * Timing.SECOND;

            this.timeUntilMessage = Date.now() + delay;
            await waitAsync(delay);
            return this.sendCommand();
        }

        this.messageSender.sendMessage(`${COMMAND}${getRandomNumber(1, 8)}`);
        this.events.emit('roundCompleted');
        this.stop();
    }

    private getDelay() {
        return getRandomNumber(Timing.MINUTE, 10 * Timing.MINUTE);
    }

    private scheduleNextRound() {
        const delay = this.getDelay();

        this.timeUntilMessage = Date.now() + delay;

        this.timeoutId = window.setTimeout(() => {
            this.sendCommand();
        }, delay);
    }
}
