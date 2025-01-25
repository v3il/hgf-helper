import { generateDelay } from '@farm/utils';
import { Timing } from '@farm/consts';
import {
    SettingsFacade, UnsubscribeTrigger, AiGeneratorService, log, promisifiedSetTimeout
} from '@components/shared';
import { TwitchFacade } from '@farm/modules/twitch';
import { ChatFacade } from '../../../chat';
import { getRandomTopic } from './gameTopics';

interface IParams {
    chatFacade: ChatFacade;
    twitchFacade: TwitchFacade;
    settingsFacade: SettingsFacade,
    aiGeneratorService: AiGeneratorService
}

interface IAkiraDrawRunnerState {
    isRunning: boolean,
}

export class AkirasDrawingRunner {
    private readonly chatFacade: ChatFacade;
    private readonly settingsFacade: SettingsFacade;
    private readonly aiGeneratorService: AiGeneratorService;
    private readonly twitchFacade: TwitchFacade;

    private state!: IAkiraDrawRunnerState;
    private unsubscribeTrigger!: UnsubscribeTrigger;

    constructor({
        chatFacade, settingsFacade, aiGeneratorService, twitchFacade
    }: IParams) {
        this.chatFacade = chatFacade;
        this.settingsFacade = settingsFacade;
        this.aiGeneratorService = aiGeneratorService;
        this.twitchFacade = twitchFacade;

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

        log('HGF helper: start Akira drawing runner');

        this.sendCommand();

        this.saveState();
        this.listenEvents();
    }

    stop() {
        this.state = { isRunning: false };
        this.saveState();
        this.unsubscribeTrigger?.();
    }

    private listenEvents() {
        this.unsubscribeTrigger = this.chatFacade.observeChat(({ isAkiraDrawReward }) => {
            if (isAkiraDrawReward) {
                this.sendCommand();
            }
        });
    }

    private getState(): IAkiraDrawRunnerState {
        return {
            isRunning: this.settingsFacade.localSettings.akiraDrawing
        };
    }

    private saveState() {
        this.settingsFacade.updateLocalSettings({
            akiraDrawing: this.state.isRunning
        });
    }

    private async sendCommand() {
        // await promisifiedSetTimeout(this.getDelay());

        const question = await this.generateQuestion();

        log(`Question: ${question}`);

        if (!question) {
            return;
        }

        this.chatFacade.sendMessage(`Akira, ${question}`);
    }

    private getDelay() {
        return generateDelay(1 * Timing.MINUTE, 1.5 * Timing.MINUTE);
    }

    private generatePrompt() {
        const game = this.twitchFacade.gameName.toLowerCase();
        const topic = getRandomTopic();

        return `Generate an easy question about ${topic} in the ${game} game. 50 chars max, English only.`;
    }

    private async generateQuestion(): Promise<string> {
        const prompt = this.generatePrompt();

        log(`Prompt: ${prompt}`);

        return this.aiGeneratorService.generate(prompt);
    }
}
