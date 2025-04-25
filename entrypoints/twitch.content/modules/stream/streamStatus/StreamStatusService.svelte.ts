import { StreamStatus } from '@twitch/consts';
import './style.css';
import { MessageSender } from '@twitch/modules/twitchChat';
import { Container, ContainerInstance, Service } from 'typedi';
import { TwitchUIService } from '@twitch/modules';
import { ColorService, OnScreenTextRecognizer } from '@shared/services';
import { logDev } from '@utils';
import { BasicView } from '@shared/views';
import { EventEmitter } from '@shared/EventEmitter';
import { Timing } from '@shared/consts';
import { antiCheatChecks, chestGameChecks, ICheck, lootGameChecks } from './checks';
import template from './template.html?raw';

@Service()
export class StreamStatusService extends BasicView {
    private readonly canvasEl;

    private readonly twitchUIService!: TwitchUIService;
    private readonly colorService!: ColorService;

    private timeoutId!: number;
    private statuses!: StreamStatus[];

    isLootGame = false;
    isAntiCheat = false;
    isChestGame = false;

    readonly events = new EventEmitter<{
        loot: boolean,
        chest: boolean,
        antiCheat: boolean,
    }>();

    constructor() {
        super(template);

        this.twitchUIService = Container.get(TwitchUIService);
        this.colorService = Container.get(ColorService);
        this.canvasEl = this.el.querySelector<HTMLCanvasElement>('[data-canvas]')!;

        this.render();
        this.checkStreamStatus(true);

        this.timeoutId = window.setInterval(() => {
            this.checkStreamStatus(false);
        }, 5 * Timing.SECOND);
    }

    render() {
        document.body.appendChild(this.el);
    }

    checkStreamStatus(silent: boolean) {
        const { activeVideoEl } = this.twitchUIService;

        this.statuses = [StreamStatus.OK];

        if (!activeVideoEl || activeVideoEl.paused || activeVideoEl.ended) {
            this.statuses = [StreamStatus.BROKEN];
            logDev('Video is broken');
            return;
        }

        this.renderVideoFrame(activeVideoEl);

        this.checkLootGame(silent);
        this.checkChestGame(silent);
        this.checkAntiCheat(silent);

        console.error('\n')
    }

    private renderVideoFrame(videoEl: HTMLVideoElement) {
        this.canvasEl.width = videoEl.clientWidth;
        this.canvasEl.height = videoEl.clientHeight;

        const ctx = this.canvasEl.getContext('2d', { willReadFrequently: true })!;

        ctx.drawImage(videoEl, 0, 0, this.canvasEl.width, this.canvasEl.height);
    }

    private checkAntiCheat(silent: boolean = false) {
        const previousStatus = this.isAntiCheat;
        const matchedChecks = this.checkPoints(antiCheatChecks);

        console.error(`Anticheat checks: ${matchedChecks} / ${antiCheatChecks.length}`);

        this.isAntiCheat = (matchedChecks / antiCheatChecks.length) >= 0.5;

        if (previousStatus !== this.isAntiCheat && !silent) {
            this.events.emit('antiCheat', this.isAntiCheat);
        }
    }

    private checkLootGame(silent: boolean) {
        const previousStatus = this.isLootGame;
        const matchedChecks = this.checkPoints(lootGameChecks);

        console.error(`Loot game checks: ${matchedChecks} / ${lootGameChecks.length}`);

        this.isLootGame = (matchedChecks / lootGameChecks.length) >= 0.7;

        if (previousStatus !== this.isLootGame && !silent) {
            this.events.emit('loot', this.isLootGame);
        }
    }

    private checkChestGame(silent: boolean) {
        const previousStatus = this.isChestGame;
        const matchedChecks = this.checkPoints(chestGameChecks);

        console.error(`Chest game checks: ${matchedChecks} / ${chestGameChecks.length}`);

        this.isChestGame = (matchedChecks / chestGameChecks.length) >= 0.7;

        if (previousStatus !== this.isChestGame && !silent) {
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

        const failedChecks = checksResults.filter(({ similarity }) => {
            return similarity >= 0.85;
        });

        return failedChecks.length;
    }

    get isVideoBroken() {
        return this.statuses.includes(StreamStatus.BROKEN) || this.twitchUIService.isAdsPhase;
    }

    get isStreamOk() {
        return this.statuses.includes(StreamStatus.OK);
    }
}
