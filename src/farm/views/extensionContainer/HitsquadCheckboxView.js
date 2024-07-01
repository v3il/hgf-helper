import { GlobalVariables } from '@/farm/consts';
import { NestableView } from '@/farm/views/NestableView';

export class HitsquadCheckboxView extends NestableView {
    #miniGamesFacade;
    #settingsFacade;

    constructor({ el, settingsFacade, miniGamesFacade }) {
        super({ el });

        this.#miniGamesFacade = miniGamesFacade;
        this.#settingsFacade = settingsFacade;

        this.#handleGiveawaysCheckbox();
    }

    #handleGiveawaysCheckbox() {
        const toggleGiveawaysEl = this.el.querySelector('[data-toggle-giveaways]');
        const isHitsquadRunning = this.#settingsFacade.getLocalSetting('hitsquadRunner');
        const remainingHitsquadRounds = this.#settingsFacade.getLocalSetting('hitsquadRunnerRemainingRounds');

        if (isHitsquadRunning && remainingHitsquadRounds > 0) {
            console.info(`HGF helper: start Hitsquad runner with ${remainingHitsquadRounds} rounds`);
            toggleGiveawaysEl.checked = true;
            this.#miniGamesFacade.startHitsquadRunner({ totalRounds: remainingHitsquadRounds });
        }

        toggleGiveawaysEl.addEventListener('change', ({ target }) => {
            target.checked ? this.#handleGiveawaysOn() : this.#turnOffGiveaways();
        });
    }

    #handleGiveawaysOn() {
        // eslint-disable-next-line no-alert
        const gamesCount = prompt('Enter games count', `${GlobalVariables.HITSQUAD_GAMES_PER_DAY}`);
        const toggleGiveawaysEl = this.el.querySelector('[data-toggle-giveaways]');
        const numericGamesCount = Number(gamesCount);

        if (!gamesCount || Number.isNaN(numericGamesCount) || numericGamesCount <= 0) {
            toggleGiveawaysEl.checked = false;
            return;
        }

        this.#miniGamesFacade.startHitsquadRunner({ totalRounds: numericGamesCount });

        this.#settingsFacade.updateLocalSettings({
            hitsquadRunner: true,
            hitsquadRunnerRemainingRounds: numericGamesCount
        });
    }

    #turnOffGiveaways() {
        const toggleGiveawaysEl = this.el.querySelector('[data-toggle-giveaways]');

        toggleGiveawaysEl.checked = false;

        this.#miniGamesFacade.stopHitsquadRunner();

        this.#settingsFacade.updateLocalSettings({
            hitsquadRunner: false,
            hitsquadRunnerRemainingRounds: 0
        });
    }
}
