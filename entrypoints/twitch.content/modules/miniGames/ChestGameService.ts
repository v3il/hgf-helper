import { Timing } from '@components/consts';
import { getRandomNumber, log } from '@components/utils';
import { MessageSender } from '@twitch/modules/twitchChat';
import { Container } from 'typedi';

export class ChestGameService {
    private readonly messageSender: MessageSender;

    private isRunning!: boolean;
    private timeoutId!: number;

    timeUntilMessage!: number;

    constructor() {
        this.messageSender = Container.get(MessageSender);
    }

    start() {
        log('Start Chest runner');

        this.isRunning = true;
        this.scheduleNextRound();
    }

    stop() {
        clearTimeout(this.timeoutId);
        this.isRunning = false;
        this.timeUntilMessage = 0;
    }

    participate() {
        return this.sendCommand();
    }

    private sendCommand() {
        this.messageSender.sendMessage(`!chest${getRandomNumber(1, 8)}`);
    }

    private getDelay() {
        return getRandomNumber(30 * Timing.SECOND, 5 * Timing.MINUTE);
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
