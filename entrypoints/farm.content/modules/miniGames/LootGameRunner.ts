import { ChatFacade } from '@farm/modules/chat';
import { getRandomNumber } from '@farm/utils';
import { Timing } from '@farm/consts';
import { log, SettingsFacade } from '@components/shared';

interface IParams {
    chatFacade: ChatFacade;
}

export class LootGameRunner {
    private readonly chatFacade: ChatFacade;

    private isRunning!: boolean;
    private timeoutId!: number;

    timeUntilMessage!: number;

    constructor(params: IParams) {
        this.chatFacade = params.chatFacade;
    }

    start() {
        log('Start Loot runner');

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
        this.chatFacade.sendMessage(`!loot${getRandomNumber(1, 8)}`);
    }

    private getDelay() {
        return getRandomNumber(Timing.MINUTE, 10 * Timing.MINUTE);
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
