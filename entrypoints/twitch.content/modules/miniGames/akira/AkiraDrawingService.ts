import { Timing } from '@components/consts';
import { Container } from 'typedi';
import { TwitchUIService } from '@twitch/modules';
import { LocalSettingsService } from '@components/settings';
import { AiGeneratorService } from '@components/services';
import { UnsubscribeTrigger } from '@components/EventEmitter';
import { getRandomNumber, log } from '@components/utils';
import { getRandomTopic } from './gameTopics';
import { ChatObserver, MessageSender } from '../../twitchChat';

interface IParams {
    settingsService: LocalSettingsService,
    aiGeneratorService: AiGeneratorService
}

export class AkiraDrawingService {
    private readonly messageSender: MessageSender;
    private readonly chatObserver: ChatObserver;
    private readonly settingsService: LocalSettingsService;
    private readonly aiGeneratorService: AiGeneratorService;
    private readonly twitchUIService: TwitchUIService;

    private _isRunning;
    private timeoutId!: number;
    private unsubscribe!: UnsubscribeTrigger;
    timeUntilMessage: number = 0;

    constructor({ settingsService, aiGeneratorService }: IParams) {
        this.settingsService = settingsService;
        this.aiGeneratorService = aiGeneratorService;

        this.twitchUIService = Container.get(TwitchUIService);
        this.messageSender = Container.get(MessageSender);
        this.chatObserver = Container.get(ChatObserver);

        this._isRunning = settingsService.settings.akiraDrawing;

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
        this.unsubscribe = this.chatObserver.observeChat(async ({ isAkiraDrawReward }) => {
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
        this.settingsService.updateSettings({
            akiraDrawing: this._isRunning
        });
    }

    private async sendCommand() {
        this.timeUntilMessage = 0;

        const question = await this.generateQuestion();

        log(`Question: ${question}`);

        if (question) {
            this.messageSender.sendMessage(this.formatQuestion(question));
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
        const game = this.twitchUIService.currentGame.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '');
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
