import { Commands } from '../consts/Commands';
import { promisifiedSetTimeout } from '../utils/promisifiedSetTimeout';
import { config } from '../consts/config';

export class CommandsProcessor {
    #twitchService;
    #round = 0;

    constructor({ twitchService }) {
        this.#twitchService = twitchService;
    }

    async processCommandsQueue() {
        const commands = this.#round % 5 === 0 ? Commands.getAll() : Commands.getCommon();

        console.log(this.#round, commands);

        // eslint-disable-next-line no-restricted-syntax
        for (const command of commands) {
            const delay = config.intervalBetweenCommands + Math.random() * 1000 + 1000;
            await promisifiedSetTimeout(delay);
            this.#twitchService.sendMessage(command);
        }

        this.#round++;
    }
}
