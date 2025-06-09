import { StreamStatus } from '@twitch/consts';
import './style.css';
import { Container, Service } from 'typedi';
import { TwitchUIService } from '@twitch/modules';
import { ColorService } from '@components/services';
import { logDev } from '@components/utils';
import { BasicView } from '@components/BasicView';
import { EventEmitter } from '@components/EventEmitter';
import { Timing } from '@components/consts';
import { antiCheatChecks, chestGameChecks, ICheck, lootGameChecks } from './checks';
import template from './template.html?raw';

@Service()
export class StreamStatusService extends BasicView {
    private readonly canvasEl;

    private readonly twitchUIService!: TwitchUIService;
    private readonly colorService!: ColorService;

    private statuses!: StreamStatus[];

    private isLootGame?: boolean;
    private isChestGame?: boolean;
    private isAntiCheat: boolean = false;
    private isAntiCheatProcessing: boolean = false;

    readonly events = new EventEmitter<{
        loot: boolean,
        chest: boolean
    }>();

    constructor() {
        super(template);

        this.twitchUIService = Container.get(TwitchUIService);
        this.colorService = Container.get(ColorService);
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

        if (this.isAntiCheatProcessing) {
            return;
        }

        this.isAntiCheat = this.checkAntiCheat();

        if (this.isAntiCheat) {
            this.isAntiCheatProcessing = true;

            setTimeout(() => {
                this.isAntiCheatProcessing = false;
            }, 2 * Timing.MINUTE + 10 * Timing.SECOND);
        }
    }

    private renderVideoFrame(videoEl: HTMLVideoElement) {
        this.canvasEl.width = videoEl.clientWidth;
        this.canvasEl.height = videoEl.clientHeight;

        const ctx = this.canvasEl.getContext('2d')!;

        ctx.drawImage(videoEl, 0, 0, this.canvasEl.width, this.canvasEl.height);
    }

    private checkAntiCheat() {
        const failedChecks = this.checkPoints(antiCheatChecks);

        return (failedChecks / antiCheatChecks.length) >= 0.7;
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

    get isMiniGamesAllowed() {
        return !(this.isVideoBroken || this.isAntiCheat);
    }
}
