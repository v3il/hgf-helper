import { Container, Service } from 'typedi';
import { TwitchUIService } from '@twitch/modules';
import { ColorService } from '@shared/services';
import { logDev } from '@utils';
import { EventEmitter, UnsubscribeTrigger } from '@shared/EventEmitter';
import { Timing } from '@shared/consts';
import { antiCheatChecks, chestGameChecks, ICheck, lootGameChecks } from './checks';
import { ChatObserver } from '@twitch/modules/twitchChat';
import { OffscreenStreamRenderer } from '../OffscreenStreamRenderer';

@Service()
export class StreamStatusService {
    private readonly offscreenStreamRenderer!: OffscreenStreamRenderer;
    private readonly twitchUIService!: TwitchUIService;
    private readonly colorService!: ColorService;
    private readonly chatObserver: ChatObserver;

    private timeoutId!: number;
    private streamReloadTimeoutId!: number;
    private lastRewardTimestamp: number = Date.now();
    private unsubscribe!: UnsubscribeTrigger;

    isLootGame = false;
    isAntiCheat = false;
    isChestGame = false;
    isBotWorking = $state(true);
    isStreamOk = $state(true);

    readonly events = new EventEmitter<{
        loot: boolean,
        chest: boolean,
        antiCheat: boolean,
    }>();

    constructor() {
        this.offscreenStreamRenderer = Container.get(OffscreenStreamRenderer);
        this.twitchUIService = Container.get(TwitchUIService);
        this.colorService = Container.get(ColorService);
        this.chatObserver = Container.get(ChatObserver);

        this.listenEvents();
        this.checkStreamStatus(true);

        this.timeoutId = window.setInterval(() => {
            this.checkStreamStatus(false);
        }, 5 * Timing.SECOND);
    }

    checkStreamStatus(silent: boolean) {
        const { activeVideoEl } = this.twitchUIService;

        if (!activeVideoEl || activeVideoEl.paused || activeVideoEl.ended) {
            this.isStreamOk = false;

            clearTimeout(this.streamReloadTimeoutId);

            this.streamReloadTimeoutId = window.setTimeout(() => {
                location.reload();
            }, Timing.MINUTE);

            logDev('Video is broken');
            return;
        }

        clearTimeout(this.streamReloadTimeoutId);

        this.checkLootGame(silent);
        this.checkChestGame(silent);
        this.checkAntiCheat(silent);

        this.isStreamOk = true;
        this.isBotWorking = (Date.now() - this.lastRewardTimestamp) < 10 * Timing.MINUTE;
    }

    private listenEvents() {
        this.unsubscribe = this.chatObserver.observeChat(({ isReward }) => {
            if (isReward) {
                this.lastRewardTimestamp = Date.now();
            }
        });
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
        const checksResults = points.map(({ xPercent, yPercent, color }) => {
            const pixelHexColor = this.offscreenStreamRenderer.getColorAtPointPercent(xPercent, yPercent);

            return {
                expected: color,
                similarity: this.colorService.getColorsSimilarity(color, pixelHexColor)
            };
        });

        const matchedChecks = checksResults.filter(({ similarity }) => similarity >= 0.85);

        return matchedChecks.length;
    }

    get isVideoBroken() {
        return !this.isStreamOk || this.twitchUIService.isAdsPhase;
    }
}
