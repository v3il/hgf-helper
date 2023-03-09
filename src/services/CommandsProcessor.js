import { shuffle } from 'lodash';
import { Commands, config } from '../consts';
import { promisifiedSetTimeout } from '../utils/promisifiedSetTimeout';

export class CommandsProcessor {
    #twitchService;
    #round = 1;

    constructor({ twitchService }) {
        this.#twitchService = twitchService;
    }

    async processCommandsQueue() {
        const commands = (this.#round % 5 === 0 || this.#round === 1) ? Commands.getAll() : Commands.getCommon();

        // eslint-disable-next-line no-restricted-syntax
        for (const command of shuffle(commands)) {
            this.#twitchService.sendMessage(command);

            const delay = config.intervalBetweenCommands + Math.random() * 1000;
            await promisifiedSetTimeout(delay);
        }

        this.#round++;
    }

    get round() {
        return this.#round;
    }
}
