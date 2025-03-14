import { ChatFacade } from '@twitch/modules/chat';
import { Timing } from '@components/consts';
import { getRandomNumber, log } from '@components/utils';

interface IParams {
    chatFacade: ChatFacade;
}

export class ChestGameService {
    private readonly chatFacade: ChatFacade;

    private isRunning!: boolean;
    private timeoutId!: number;

    timeUntilMessage!: number;

    constructor(params: IParams) {
        this.chatFacade = params.chatFacade;
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
        this.chatFacade.sendMessage(`!chest${getRandomNumber(1, 8)}`);
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
