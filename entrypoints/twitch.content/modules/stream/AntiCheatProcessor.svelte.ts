import { MessageSender } from '@twitch/modules/twitchChat';
import { Container, ContainerInstance, Service } from 'typedi';
import { TwitchUIService } from '@twitch/modules';
import { OnScreenTextRecognizer } from '@shared/services';
import { getRandomNumber, logDev } from '@utils';
import { Timing } from '@shared/consts';
import { StreamStatusService } from './streamStatus';
import { UnsubscribeTrigger } from '@shared/EventEmitter';
import { OffscreenStreamRenderer } from './OffscreenStreamRenderer';

const antiCheatNameBounds = {
    x: 20.539546290619253,
    y: 82.00654307524536,
    width: 59.28915573267933,
    height: 7.324972737186473
}

@Service()
export class AntiCheatProcessor {
    private readonly offscreenStreamRenderer!: OffscreenStreamRenderer;
    private readonly twitchUIService!: TwitchUIService;
    private readonly messageSender!: MessageSender;
    private readonly textDecoderService!: OnScreenTextRecognizer;
    private readonly streamStatusService!: StreamStatusService;

    private intervalId!: number;
    private unsubscribe!: UnsubscribeTrigger;

    constructor(container: ContainerInstance) {
        this.offscreenStreamRenderer = Container.get(OffscreenStreamRenderer);
        this.twitchUIService = Container.get(TwitchUIService);
        this.messageSender = Container.get(MessageSender);
        this.textDecoderService = container.get(OnScreenTextRecognizer);
        this.streamStatusService = container.get(StreamStatusService);
    }

    start() {
        this.unsubscribe = this.streamStatusService.events.on('antiCheat', (isAntiCheat?: boolean) => {
            isAntiCheat ? this.startAntiCheatProcessing() : this.stopAntiCheatProcessing();
        });
    }

    destroy() {
        this.stopAntiCheatProcessing();
        this.unsubscribe();
    }

    private startAntiCheatProcessing() {
        this.processAntiCheat();

        this.intervalId = window.setInterval(() => {
            this.processAntiCheat();
        }, 10 * Timing.SECOND);
    }

    private stopAntiCheatProcessing() {
        clearInterval(this.intervalId);
    }

    private async processAntiCheat() {
        const result = await this.checkUserName();

        logDev(`Anticheat result: ${result}`);

        if (result > 0.7) {
            const delay = getRandomNumber(2 * Timing.SECOND, 5 * Timing.SECOND);

            logDev(`Send anticheat in ${delay}!`);

            setTimeout(() => {
                this.messageSender.sendMessage('!anticheat');
            }, delay);

            this.stopAntiCheatProcessing();
        }
    }

    private async checkUserName() {
        const { x, y, width, height } = antiCheatNameBounds;
        const imageData = this.offscreenStreamRenderer.getImageDataPercent(
            x,
            y,
            width,
            height
        );

        return this.textDecoderService.checkOnScreen(imageData, this.twitchUIService.twitchUserName);
    }
}
