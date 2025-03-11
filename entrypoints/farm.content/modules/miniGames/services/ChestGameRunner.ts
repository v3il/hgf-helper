import { ChatFacade } from '@farm/modules/chat';
import { getRandomNumber } from '@farm/utils';
import { Timing } from '@farm/consts';
import { log, SettingsFacade } from '@components/shared';

interface IParams {
    chatFacade: ChatFacade;
    settingsFacade: SettingsFacade;
}

export class ChestGameRunner {
    private readonly chatFacade: ChatFacade;
    private readonly settingsFacade: SettingsFacade;

    private isRunning!: boolean;
    private timeoutId!: number;

    timeUntilMessage!: number;

    constructor(params: IParams) {
        this.chatFacade = params.chatFacade;
        this.settingsFacade = params.settingsFacade;
    }

    start() {
        log('start Chest runner');

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
