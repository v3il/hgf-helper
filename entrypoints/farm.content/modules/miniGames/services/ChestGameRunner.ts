import { ChatFacade } from '@farm/modules/chat';
import { generateDelay } from '@farm/utils';
import { Timing } from '@farm/consts';
import { log, promisifiedSetTimeout, SettingsFacade } from '@components/shared';

interface IParams {
    chatFacade: ChatFacade;
    settingsFacade: SettingsFacade;
}

export class ChestGameRunner {
    private readonly chatFacade: ChatFacade;
    private readonly settingsFacade: SettingsFacade;

    private _isRunning!: boolean;
    private timeoutId!: number;

    timeUntilMessage!: number;

    constructor(params: IParams) {
        this.chatFacade = params.chatFacade;
        this.settingsFacade = params.settingsFacade;

        this._isRunning = this.settingsFacade.localSettings.chestGame;

        if (this._isRunning) {
            this.start();
        }
    }

    get isRunning() {
        return this._isRunning;
    }

    start() {
        this.timeUntilMessage = 0;
        this._isRunning = true;

        log('HGF helper: start Chest runner');

        this.saveState();
        this.listenEvents();
    }

    stop() {
        clearTimeout(this.timeoutId);
        this._isRunning = false;
        this.timeUntilMessage = 0;
        this.saveState();
    }

    participateOnce() {
        return this.sendCommand();
    }

    private listenEvents() {
        const delay = this.getDelay();

        this.timeUntilMessage = Date.now() + delay;

        this.timeoutId = window.setTimeout(() => {
            this.sendCommand();
        }, delay);
    }

    private saveState() {
        this.settingsFacade.updateLocalSettings({
            chestGame: this._isRunning
        });
    }

    private async sendCommand() {
        this.timeUntilMessage = 0;
        this.chatFacade.sendMessage(`!chest${generateDelay(1, 8)}`);
    }

    private getDelay() {
        return generateDelay(10 * Timing.SECOND, 3 * Timing.MINUTE) + 10 * Timing.MINUTE;
    }
}
