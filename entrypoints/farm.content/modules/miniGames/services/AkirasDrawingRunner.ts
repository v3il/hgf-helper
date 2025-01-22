import { generateDelay } from '@farm/utils';
import { Commands, Timing } from '@farm/consts';
import {
    promisifiedSetTimeout, SettingsFacade, UnsubscribeTrigger
} from '@components/shared';
import { ChatFacade } from '../../chat';

interface IParams {
    chatFacade: ChatFacade;
    settingsFacade: SettingsFacade
}

interface IAkiraDrawRunnerState {
    isRunning: boolean,
}

export class AkirasDrawingRunner {
    private readonly chatFacade: ChatFacade;
    private readonly settingsFacade: SettingsFacade;

    private state!: IAkiraDrawRunnerState;
    private unsubscribeTrigger!: UnsubscribeTrigger;

    constructor({ chatFacade, settingsFacade }: IParams) {
        this.chatFacade = chatFacade;
        this.settingsFacade = settingsFacade;

        this.state = this.getState();

        if (this.state.isRunning) {
            this.start();
        }
    }

    get isRunning() {
        return this.state.isRunning;
    }

    start() {
        this.state.isRunning = true;

        console.info('HGF helper: start Akira drawing runner');

        this.saveState();
        this.listenEvents();
    }

    stop() {
        this.state = { isRunning: false };
        this.saveState();
        this.unsubscribeTrigger?.();
    }

    private listenEvents() {
        this.chatFacade.observeChat(({ isAkiraDrawReward }) => {
            if (isAkiraDrawReward) {
                this.sendCommand();
            }
        });
    }

    private getState(): IAkiraDrawRunnerState {
        return {
            isRunning: this.settingsFacade.getLocalSetting('akiraDrawing')
        };
    }

    private saveState() {
        this.settingsFacade.updateLocalSettings({
            akiraDrawing: this.state.isRunning
        });
    }

    private async sendCommand() {
        await promisifiedSetTimeout(this.getDelay());
        this.chatFacade.sendMessage('Akira, hey!');
    }

    private getDelay() {
        return generateDelay(30 * Timing.SECOND, 5 * Timing.MINUTE);
    }
}
