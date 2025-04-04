import { StreamStatus } from '@twitch/consts';
import './style.css';
import { MessageSender } from '@twitch/modules/twitchChat';
import { Container, ContainerInstance, Service } from 'typedi';
import { TwitchUIService } from '@twitch/modules';
import { ColorService, OnScreenTextRecognizer } from '@components/services';
import { getRandomNumber, logDev } from '@components/utils';
import { BasicView } from '@components/BasicView';
import { EventEmitter } from '@components/EventEmitter';
import { Timing } from '@components/consts';
import { antiCheatChecks, anticheatName, chestGameChecks, ICheck, lootGameChecks } from './checks';
import template from './template.html?raw';

@Service()
export class StreamStatusService extends BasicView {
    private readonly canvasEl;

    private readonly twitchUIService!: TwitchUIService;
    private readonly messageSender!: MessageSender;
    private readonly colorService!: ColorService;
    private readonly textDecoderService!: OnScreenTextRecognizer;

    private statuses!: StreamStatus[];

    private isLootGame?: boolean;
    private isChestGame?: boolean;

    readonly events = new EventEmitter<{
        loot: boolean,
        chest: boolean
    }>();

    private anticheatHandled = false;

    constructor(container: ContainerInstance) {
        super(template);

        this.twitchUIService = Container.get(TwitchUIService);
        this.messageSender = Container.get(MessageSender);
        this.colorService = Container.get(ColorService);
        this.textDecoderService = container.get(OnScreenTextRecognizer);
        this.canvasEl = this.el.querySelector<HTMLCanvasElement>('[data-canvas]')!;

        this.mount(document.body);
    }

    async checkStreamStatus() {
        const { activeVideoEl } = this.twitchUIService;

        this.statuses = [StreamStatus.OK];

        if (!activeVideoEl || activeVideoEl.paused || activeVideoEl.ended) {
            this.statuses = [StreamStatus.BROKEN];
            logDev('Video is broken');
            return;
        }

        this.renderVideoFrame(activeVideoEl);

        this.checkLootGame();
        this.checkChestGame();

        const isAntiCheat = this.isAntiCheat();

        if (isAntiCheat) {
            this.startAntiCheatProcessing();
        } else {
            this.anticheatHandled = false;
        }
    }

    private async startAntiCheatProcessing() {
        if (this.anticheatHandled) {
            return;
        }

        const result = await this.recognize();

        logDev(`Anticheat result: ${result}`);

        if (result > 0.7) {
            const delay = getRandomNumber(2 * Timing.SECOND, 8 * Timing.SECOND);

            this.anticheatHandled = true;
            logDev(`Send anticheat in ${delay}!`);

            setTimeout(() => {
                this.messageSender.sendMessage('!anticheat');
            }, delay);
        }
    }

    async recognize() {
        return this.recognizeText(anticheatName, this.twitchUIService.twitchUserName);
    }

    private async recognizeText(points: ICheck[], str: string) {
        const x = Math.floor((points[0].xPercent * this.canvasEl.width) / 100);
        const y = Math.floor((points[0].yPercent * this.canvasEl.height) / 100);
        const width = Math.floor((points[1].xPercent * this.canvasEl.width) / 100) - x;
        const height = Math.floor((points[2].yPercent * this.canvasEl.height) / 100) - y;

        const ctx = this.canvasEl.getContext('2d')!;
        const imageData = ctx.getImageData(x, y, width, height);

        return this.textDecoderService.checkOnScreen(imageData, str);
    }

    private renderVideoFrame(videoEl: HTMLVideoElement) {
        this.canvasEl.width = videoEl.clientWidth;
        this.canvasEl.height = videoEl.clientHeight;

        const ctx = this.canvasEl.getContext('2d')!;

        ctx.drawImage(videoEl, 0, 0, this.canvasEl.width, this.canvasEl.height);
    }

    private isAntiCheat() {
        const failedChecks = this.checkPoints(antiCheatChecks);

        return (failedChecks / antiCheatChecks.length) >= 0.5;
    }

    private checkLootGame() {
        const previousStatus = this.isLootGame;
        const failedChecks = this.checkPoints(lootGameChecks);

        this.isLootGame = (failedChecks / lootGameChecks.length) >= 0.7;

        if (previousStatus !== this.isLootGame) {
            this.events.emit('loot', this.isLootGame);
        }
    }

    private checkChestGame() {
        const previousStatus = this.isChestGame;
        const failedChecks = this.checkPoints(chestGameChecks);

        this.isChestGame = (failedChecks / chestGameChecks.length) >= 0.7;

        if (previousStatus !== this.isChestGame) {
            this.events.emit('chest', this.isChestGame);
        }
    }

    private checkPoints(points: ICheck[]): number {
        const { width, height } = this.canvasEl;

        const checksResults = points.map(({ xPercent, yPercent, color }) => {
            const x = Math.floor((xPercent * width) / 100);
            const y = Math.floor((yPercent * height) / 100);

            const context = this.canvasEl.getContext('2d', { willReadFrequently: true })!;
            const [r, g, b] = context.getImageData(x, y, 1, 1).data;
            const pixelHexColor = this.colorService.rgbToHex(r, g, b);

            return {
                expected: color,
                actual: pixelHexColor,
                similarity: this.colorService.getColorsSimilarity(color, pixelHexColor)
            };
        });

        const failedChecks = checksResults.filter(({ similarity, actual }) => {
            const isBlack = actual === '000000';
            return isBlack ? true : similarity >= 0.85;
        });

        return failedChecks.length;
    }

    get isVideoBroken() {
        return this.statuses.includes(StreamStatus.BROKEN);
    }

    get isStreamOk() {
        return this.statuses.includes(StreamStatus.OK);
    }
}
