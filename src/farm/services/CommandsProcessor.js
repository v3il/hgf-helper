import { shuffle } from 'lodash';
import { Commands } from '../consts';
import { promisifiedSetTimeout } from '../utils/promisifiedSetTimeout';
import { INTERVAL_BETWEEN_COMMANDS } from '../../../appConfig';

export class CommandsProcessor {
    _twitchService;
    _round = 1;

    constructor({ twitchService }) {
        this._twitchService = twitchService;
    }

    async processCommandsQueue() {
        const commands = (this._round % 5 === 0 || this._round === 1) ? Commands.getAll() : Commands.getCommon();

        // eslint-disable-next-line no-restricted-syntax
        for (const command of shuffle(commands)) {
            this._twitchService.sendMessage(command);

            const delay = INTERVAL_BETWEEN_COMMANDS + Math.random() * 1000;
            await promisifiedSetTimeout(delay);
        }

        this._round++;
    }

    get round() {
        return this._round;
    }
}
