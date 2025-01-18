import { generateDelay } from '@farm/utils';
import { Commands, Timing } from '@farm/consts';
import { promisifiedSetTimeout, EventEmitter, SettingsFacade } from '@components/shared';
import { StreamFacade } from '@farm/modules/stream';
import { ChatFacade } from '../../chat';

interface IParams {
    chatFacade: ChatFacade;
    streamFacade: StreamFacade;
    settingsFacade: SettingsFacade
}

interface IHitsquadRunnerState {
    isRunning: boolean,
    remainingRounds: number
}

const HITSQUAD_GAMES_ON_SCREEN = 12;

export class HitsquadRunner {
    readonly events;

    private readonly chatFacade: ChatFacade;
    private readonly streamFacade: StreamFacade;
    private readonly settingsFacade: SettingsFacade;

    private state!: IHitsquadRunnerState;
    private timeout!: number;

    constructor({ chatFacade, streamFacade, settingsFacade }: IParams) {
        this.chatFacade = chatFacade;
        this.streamFacade = streamFacade;
        this.settingsFacade = settingsFacade;

        this.events = EventEmitter.create<{
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

    start(rounds?: number) {
        if (rounds) {
            this.state = { isRunning: true, remainingRounds: rounds };
            this.saveState();
        }

        console.info(`HGF helper: start Hitsquad runner with ${this.state.remainingRounds} rounds`);

        this.scheduleNextRound();
    }

    stop() {
        this.state = { isRunning: false, remainingRounds: 0 };
        this.saveState();
        clearTimeout(this.timeout);
    }

    private getState(): IHitsquadRunnerState {
        return {
            isRunning: this.settingsFacade.getLocalSetting('hitsquad'),
            remainingRounds: this.settingsFacade.getLocalSetting('hitsquadRounds')
        };
    }

    private saveState() {
        this.settingsFacade.updateLocalSettings({
            hitsquad: this.state.isRunning,
            hitsquadRounds: this.state.remainingRounds
        });
    }

    private async sendCommand(): Promise<void> {
        if (!this.streamFacade.isStreamOk) {
            await promisifiedSetTimeout(20 * Timing.SECOND);
            return this.sendCommand();
        }

        this.chatFacade.sendMessage(Commands.HITSQUAD);
        this.state.remainingRounds -= HITSQUAD_GAMES_ON_SCREEN;
        this.saveState();
    }

    private getNextRoundDelay() {
        return generateDelay(30 * Timing.SECOND, 5 * Timing.MINUTE) + 15 * Timing.MINUTE;
    }

    private scheduleNextRound() {
        this.timeout = window.setTimeout(async () => {
            await this.sendCommand();

            if (this.state.remainingRounds > 0) {
                return this.scheduleNextRound();
            }

            this.stop();
            this.events.emit('end');
        }, this.getNextRoundDelay());
    }
}
