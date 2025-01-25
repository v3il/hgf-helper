import { generateDelay } from '@farm/utils';
import { Timing } from '@farm/consts';
import {
    SettingsFacade, UnsubscribeTrigger, AiGeneratorService, log
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

export class AkirasDrawingRunner {
    private readonly chatFacade: ChatFacade;
    private readonly settingsFacade: SettingsFacade;
    private readonly aiGeneratorService: AiGeneratorService;
    private readonly twitchFacade: TwitchFacade;

    private _isRunning;
    private timeoutId!: number;
    private unsubscribe!: UnsubscribeTrigger;

    constructor({
        chatFacade, settingsFacade, aiGeneratorService, twitchFacade
    }: IParams) {
        this.chatFacade = chatFacade;
        this.settingsFacade = settingsFacade;
        this.aiGeneratorService = aiGeneratorService;
        this.twitchFacade = twitchFacade;

        this._isRunning = this.settingsFacade.localSettings.akiraDrawing;

        if (this._isRunning) {
            this.start();
        }
    }

    get isRunning() {
        return this._isRunning;
    }

    start() {
        this._isRunning = true;

        log('HGF helper: start Akira drawing runner');

        this.saveState();
        this.listenEvents();
    }

    stop() {
        clearTimeout(this.timeoutId);
        this._isRunning = false;
        this.saveState();
        this.unsubscribe?.();
    }

    participateOnce() {
        return this.sendCommand();
    }

    private listenEvents() {
        this.unsubscribe = this.chatFacade.observeChat(async ({ isAkiraDrawReward }) => {
            if (isAkiraDrawReward) {
                this.timeoutId = window.setTimeout(() => {
                    this.sendCommand();
                }, this.getDelay());
            }
        });
    }

    private saveState() {
        this.settingsFacade.updateLocalSettings({
            akiraDrawing: this._isRunning
        });
    }

    private async sendCommand() {
        const question = await this.generateQuestion();

        log(`Question: ${question}`);

        if (question) {
            this.chatFacade.sendMessage(this.formatQuestion(question));
        }
    }

    private getDelay() {
        return generateDelay(1 * Timing.MINUTE, 25 * Timing.MINUTE);
    }

    private formatQuestion(question: string) {
        if (Math.random() > 0.5) {
            return `Akira, ${question.toLowerCase()}`;
        }

        return `${question.slice(0, -1)}, Akira?`;
    }

    private generatePrompt() {
        const game = this.twitchFacade.currentGame.toLowerCase();
        const topic = getRandomTopic();

        // eslint-disable-next-line max-len
        return `Generate an easy question about ${topic} in the ${game} game. 50 chars max, English only, should mandatory contain the game name.`;
    }

    private async generateQuestion(): Promise<string> {
        const prompt = this.generatePrompt();

        log(`Prompt: ${prompt}`);

        return this.aiGeneratorService.generate(prompt);
    }
}
