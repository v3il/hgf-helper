import { StreamStatus } from '@twitch/consts';
import './style.css';
import { Container, Service } from 'typedi';
import { TwitchUIService } from '@twitch/modules';
import { ColorService } from '@shared/services';
import { logDev } from '@utils';
import { BasicView } from '@shared/views';
import { EventEmitter, UnsubscribeTrigger } from '@shared/EventEmitter';
import { Timing } from '@shared/consts';
import { antiCheatChecks, chestGameChecks, ICheck, lootGameChecks } from './checks';
import template from './template.html?raw';
import { ChatObserver } from '@twitch/modules/twitchChat';

@Service()
export class StreamStatusService extends BasicView {
    private readonly canvasEl;

    private readonly twitchUIService!: TwitchUIService;
    private readonly colorService!: ColorService;
    private readonly chatObserver: ChatObserver;

    private timeoutId!: number;
    private streamReloadTimeoutId!: number;
    private lastRewardTimestamp!: number;
    private unsubscribe!: UnsubscribeTrigger;
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
        this.chatObserver = Container.get(ChatObserver);
        this.canvasEl = this.el.querySelector<HTMLCanvasElement>('[data-canvas]')!;

        this.render();
        this.listenEvents();
        this.checkStreamStatus(true);

        this.timeoutId = window.setInterval(() => {
            this.checkStreamStatus(false);
        }, 5 * Timing.SECOND);
    }

    get isBotWorking() {
        return Date.now() - this.lastRewardTimestamp < 10 * Timing.MINUTE;
    }

    render() {
        document.body.appendChild(this.el);
    }

    checkStreamStatus(silent: boolean) {
        const { activeVideoEl } = this.twitchUIService;

        this.statuses = [StreamStatus.OK];

        if (!activeVideoEl || activeVideoEl.paused || activeVideoEl.ended) {
            this.statuses = [StreamStatus.BROKEN];

            this.streamReloadTimeoutId = window.setTimeout(() => {
                location.reload();
            }, Timing.MINUTE);

            logDev('Video is broken');
            return;
        }

        clearTimeout(this.streamReloadTimeoutId);

        this.renderVideoFrame(activeVideoEl);

        this.checkLootGame(silent);
        this.checkChestGame(silent);
        this.checkAntiCheat(silent);
    }

    private listenEvents() {
        this.unsubscribe = this.chatObserver.observeChat(({ isReward }) => {
            if (isReward) {
                this.lastRewardTimestamp = Date.now();
            }
        });
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

        this.isAntiCheat = (matchedChecks / antiCheatChecks.length) >= 0.5;

        if (previousStatus !== this.isAntiCheat && !silent) {
            this.events.emit('antiCheat', this.isAntiCheat);
        }
    }

    private checkLootGame(silent: boolean) {
        const previousStatus = this.isLootGame;
        const matchedChecks = this.checkPoints(lootGameChecks);

        this.isLootGame = (matchedChecks / lootGameChecks.length) >= 0.7;

        if (previousStatus !== this.isLootGame && !silent) {
            this.events.emit('loot', this.isLootGame);
        }
    }

    private checkChestGame(silent: boolean) {
        const previousStatus = this.isChestGame;
        const matchedChecks = this.checkPoints(chestGameChecks);

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
                similarity: this.colorService.getColorsSimilarity(color, pixelHexColor)
            };
        });

        const matchedChecks = checksResults.filter(({ similarity }) => similarity >= 0.85);

        return matchedChecks.length;
    }

    get isVideoBroken() {
        return this.statuses.includes(StreamStatus.BROKEN) || this.twitchUIService.isAdsPhase;
    }

    get isStreamOk() {
        return this.statuses.includes(StreamStatus.OK);
    }
}
