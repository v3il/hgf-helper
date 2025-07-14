import { MessageSender } from '@twitch/modules/twitchChat';
import { StreamStatusService } from '@twitch/modules/stream';
import { LocalSettingsService } from '@shared/services';
import { ITwitchLocalSettings } from '@twitch/modules';
import { Container } from 'typedi';
import { random } from 'lodash';
import { Timing } from '@shared/consts';
import { wait } from '@utils';

interface IMiniGameServiceParams {
    localSettingsService: LocalSettingsService<ITwitchLocalSettings>;
}

export abstract class MiniGameBaseServiceSvelte {
    abstract readonly command: string;

    protected readonly messageSender: MessageSender;
    protected readonly streamStatusService: StreamStatusService;
    protected readonly localSettingsService: LocalSettingsService<ITwitchLocalSettings>;

    timeUntilMessage = $state(0);

    constructor({ localSettingsService }: IMiniGameServiceParams) {
        this.localSettingsService = localSettingsService;
        this.messageSender = Container.get(MessageSender);
        this.streamStatusService = Container.get(StreamStatusService);
    }

    sendCommand() {
        this.messageSender.sendMessage(this.buildCommand());
    }

    abstract init(): void;
    abstract stop(): void;
    abstract destroy(): void;

    protected get shouldHandleGame() {
        return false;
    }

    protected abstract completeRound(): void;
    protected abstract buildCommand(): string;
    protected abstract getDelay(): number;
    protected abstract saveState(): void;
    protected abstract scheduleRound(): void;

    protected async processRound() {
        if (!this.streamStatusService.isBotWorking) {
            return;
        }

        while (!this.streamStatusService.isMiniGamesAllowed) {
            const delay = random(10 * Timing.SECOND, 30 * Timing.SECOND);

            this.timeUntilMessage = Date.now() + delay;

            while (Date.now() < this.timeUntilMessage) {
                if (!this.shouldHandleGame) {
                    return;
                }

                await wait(Timing.SECOND * 0.1);
            }
        }

        if (!this.shouldHandleGame) {
            return;
        }

        this.completeRound();
    }
}
