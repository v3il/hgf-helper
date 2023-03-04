import { shuffle } from 'lodash';
import { Commands } from '../consts/Commands';
import { promisifiedSetTimeout } from '../utils/promisifiedSetTimeout';
import { config } from '../consts/config';

export class CommandsProcessor {
    #twitchService;
    #round = 1;

    constructor({ twitchService }) {
        this.#twitchService = twitchService;
    }

    async processCommandsQueue() {
        const commands = this.#round % 5 === 0 ? Commands.getAll() : Commands.getCommon();

        // eslint-disable-next-line no-restricted-syntax
        for (const command of shuffle(commands)) {
            const delay = config.intervalBetweenCommands + Math.random() * 1000 + 1000;
            await promisifiedSetTimeout(delay);
            this.#twitchService.sendMessage(command);
        }

        this.#round++;
    }

    get round() {
        return this.#round;
    }
}
