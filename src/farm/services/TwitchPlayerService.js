import { promisifiedSetTimeout } from '../utils';

export class TwitchPlayerService {
    static create() {
        return new TwitchPlayerService();
    }

    #settingsButton;

    constructor() {
        this.#settingsButton = document.querySelector('[data-a-target="player-settings-button"]');
    }

    async decreaseVideoDelay() {
        await this.#gotoQualitySettings();

        let qualityRadios = this.#getQualitySettingsButtonEls();

        qualityRadios.at(-3)?.click();
        this.#settingsButton.click();

        await promisifiedSetTimeout(5000);
        await this.#gotoQualitySettings();

        qualityRadios = this.#getQualitySettingsButtonEls();
        qualityRadios.at(-2)?.click();

        this.#settingsButton.click();
    }

    async #gotoQualitySettings() {
        this.#settingsButton.click();
        await promisifiedSetTimeout(200);
        document.querySelector('[data-a-target="player-settings-menu-item-quality"]')?.click();
        await promisifiedSetTimeout(200);
    }

    #getQualitySettingsButtonEls() {
        return Array.from(document.querySelectorAll('[name="player-settings-submenu-quality-option"]'));
    }
}
