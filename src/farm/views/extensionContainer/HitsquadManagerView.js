import { HitsquadCheckboxView } from '@/farm/views/extensionContainer/HitsquadCheckboxView';
import { NestableView } from '@/farm/views/NestableView';

export class HitsquadManagerView extends NestableView {
    #settingsFacade;
    #miniGamesFacade;

    constructor({ el, settingsFacade, miniGamesFacade }) {
        super({ el });

        this.#settingsFacade = settingsFacade;
        this.#miniGamesFacade = miniGamesFacade;

        this.#initCheckboxView();
    }

    #initCheckboxView() {
        new HitsquadCheckboxView({
            el: this.el.querySelector('[data-giveaways-manager]'),
            settingsFacade: this.#settingsFacade,
            miniGamesFacade: this.#miniGamesFacade
        });
    }
}
