import { Timing } from '@farm/consts';
import {
    SettingsFacade, UnsubscribeTrigger, AiGeneratorService, log, getRandomNumber
} from '@components/shared';
import { TwitchFacade } from '@farm/modules/twitch';
import { ChatFacade } from '../../chat';
import { getRandomTopic } from './gameTopics';

interface IParams {
    chatFacade: ChatFacade;
    twitchFacade: TwitchFacade;
    settingsFacade: SettingsFacade,
    aiGeneratorService: AiGeneratorService
}

export class AkiraDrawingService {
    private readonly chatFacade: ChatFacade;
    private readonly settingsFacade: SettingsFacade;
    private readonly aiGeneratorService: AiGeneratorService;
    private readonly twitchFacade: TwitchFacade;

    private _isRunning;
    private timeoutId!: number;
    private unsubscribe!: UnsubscribeTrigger;
    timeUntilMessage: number = 0;

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
        this.timeUntilMessage = 0;
        this._isRunning = true;

        log('Start Akira drawing service');

        this.saveState();
        this.listenEvents();
    }

    stop() {
        clearTimeout(this.timeoutId);
        this._isRunning = false;
        this.timeUntilMessage = 0;
        this.saveState();
        this.unsubscribe?.();
    }

    participate() {
        return this.sendCommand();
    }

    private listenEvents() {
        this.unsubscribe = this.chatFacade.observeChat(async ({ isAkiraDrawReward }) => {
            if (isAkiraDrawReward) {
                const delay = this.getDelay();

                this.timeUntilMessage = Date.now() + delay;

                this.timeoutId = window.setTimeout(() => {
                    this.sendCommand();
                }, delay);
            }
        });
    }

    private saveState() {
        this.settingsFacade.updateLocalSettings({
            akiraDrawing: this._isRunning
        });
    }

    private async sendCommand() {
        this.timeUntilMessage = 0;

        const question = await this.generateQuestion();

        log(`Question: ${question}`);

        if (question) {
            this.chatFacade.sendMessage(this.formatQuestion(question));
        }
    }

    private getDelay() {
        return getRandomNumber(Timing.MINUTE, 30 * Timing.MINUTE);
    }

    private formatQuestion(question: string) {
        const normalizedQuestion = question.replace(/[^a-zA-Z0-9 ?]/g, '').toLowerCase();
        const hasComma = Math.random() > 0.5;

        return `Akira${hasComma ? ',' : ''} ${normalizedQuestion}`;
    }

    private generatePrompt() {
        const game = this.twitchFacade.currentGame.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '');
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
