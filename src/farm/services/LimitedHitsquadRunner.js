import { Commands, MessageTemplates, Timing } from '../consts';
import { generateDelay, promisifiedSetTimeout } from '../utils';

export class LimitedHitsquadRunner {
    #twitchChatObserver;
    #streamStatusService;
    #twitchChatService;

    #lastBattleRoyalTime = 0;
    #lastHitsquadTimes = [0, 0, 0, 0, 0];

    constructor({ twitchChatObserver, streamStatusService, twitchChatService }) {
        this.#twitchChatObserver = twitchChatObserver;
        this.#streamStatusService = streamStatusService;
        this.#twitchChatService = twitchChatService;

        this.#listenEvents();
    }

    #listenEvents() {
        this.#twitchChatObserver.events.on('message', ({ message, isAdmin }) => {
            this.#processMessage({ message, isAdmin });
        });
    }

    #processMessage({ isAdmin, message }) {
        if (isAdmin && message.includes(MessageTemplates.BATTLEROYALE_REWARD)) {
            return this.#processBattleroyale();
        }

        if (isAdmin && message.includes(MessageTemplates.HITSQUAD_REWARD)) {
            return this.#processHitsquad();
        }
    }

    #processBattleroyale() {
        this.#lastBattleRoyalTime = Date.now();
        console.error('bat');
    }

    #processHitsquad() {
        const index = this.#findHitsquadRoundIndex();

        if (index >= 0) {
            this.#lastHitsquadTimes[index] = Date.now();
        }

        if (index === this.#lastHitsquadTimes.length - 1) {
            this.#sendCommand();
        }

        console.error(this.#lastHitsquadTimes);
    }

    #findHitsquadRoundIndex() {
        const minTime = Math.min(...this.#lastHitsquadTimes);
        return this.#lastHitsquadTimes.findIndex((time) => time === minTime);
    }

    async #sendCommand() {
        const allHitsquadCollected = this.#lastHitsquadTimes.every((time) => time > 0);
        const isBattleroyaleCollected = this.#lastBattleRoyalTime > 0;

        if (!(allHitsquadCollected && isBattleroyaleCollected)) {
            return;
        }

        const timesToNextHitsquads = this.#lastHitsquadTimes.map((time) => time + 30 * Timing.MINUTE - Date.now());
        const timeToNextBattleroyale = this.#lastBattleRoyalTime + 30 * Timing.MINUTE - Date.now();
        const timeToNearestGame = Math.min(...timesToNextHitsquads, timeToNextBattleroyale);
        const delay = generateDelay(Timing.MINUTE, timeToNearestGame / 2);

        console.log('Send', delay / Timing.MINUTE);
        console.error(timeToNearestGame / Timing.MINUTE);
        console.error([...timesToNextHitsquads, timeToNextBattleroyale]);
        console.log([...timesToNextHitsquads, timeToNextBattleroyale].map((t) => t / Timing.MINUTE));

        // await promisifiedSetTimeout(delay);
        //
        // if (!this.#streamStatusService.isBanPhase) {
        //     this.#twitchChatService.sendMessage(Commands.HITSQUAD);
        // }

        // console.log('Send');
        //
        // console.error(timeToNearestGame / Timing.MINUTE);
        // console.error([...timesToNextHitsquads, timeToNextBattleroyale]);
        // console.log([...timesToNextHitsquads, timeToNextBattleroyale].map((t) => t / Timing.MINUTE));
    }
}
