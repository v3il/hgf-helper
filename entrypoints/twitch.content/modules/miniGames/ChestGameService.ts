import { Timing } from '@components/consts';
import { getRandomNumber, log, waitAsync } from '@components/utils';
import { MessageSender } from '@twitch/modules/twitchChat';
import { Container } from 'typedi';
import { TwitchUIService } from '@twitch/modules';
import { StreamStatusService } from '@twitch/modules/stream';

export class ChestGameService {
    private readonly messageSender: MessageSender;
    private readonly twitchUIService: TwitchUIService;
    private readonly streamStatusService: StreamStatusService;

    private timeoutId!: number;

    timeUntilMessage!: number;

    constructor() {
        this.messageSender = Container.get(MessageSender);
        this.twitchUIService = Container.get(TwitchUIService);
        this.streamStatusService = Container.get(StreamStatusService);
    }

    start() {
        log('Start Chest runner');
        this.scheduleNextRound();
    }

    stop() {
        clearTimeout(this.timeoutId);
        this.timeUntilMessage = 0;
    }

    participate() {
        return this.sendCommand();
    }

    private async sendCommand(): Promise<void> {
        if (this.twitchUIService.isAdsPhase || this.streamStatusService.isVideoBroken) {
            const delay = 20 * Timing.SECOND;

            this.timeUntilMessage = Date.now() + delay;
            await waitAsync(delay);
            return this.sendCommand();
        }

        this.messageSender.sendMessage(`!chest${getRandomNumber(1, 8)}`);
    }

    private getDelay() {
        return getRandomNumber(30 * Timing.SECOND, 1 * Timing.MINUTE);
    }

    private scheduleNextRound() {
        const delay = this.getDelay();

        this.timeUntilMessage = Date.now() + delay;

        this.timeoutId = window.setTimeout(() => {
            this.sendCommand();
            this.stop();
        }, delay);
    }
}
