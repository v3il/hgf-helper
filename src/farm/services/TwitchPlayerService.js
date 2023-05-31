import { promisifiedSetTimeout } from '../utils';

export class TwitchPlayerService {
    static async decreaseVideoDelay() {
        document.querySelector('[data-a-target="player-settings-button"]').click();
        await promisifiedSetTimeout(200);
        document.querySelector('[data-a-target="player-settings-menu-item-quality"]').click();
        await promisifiedSetTimeout(200);

        const radiosSelector = '[name ="player-settings-submenu-quality-option"]';
        const qualityRadios = Array.from(document.querySelectorAll(radiosSelector));

        qualityRadios.at(-2).click();
        await promisifiedSetTimeout(5000);
        qualityRadios.at(-1).click();

        document.querySelector('[data-a-target="player-settings-button"]').click();
    }
}
