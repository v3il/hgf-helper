export class TwitchPlayerService {
    static create() {
        return new TwitchPlayerService();
    }

    #settingsButton;
    #currentQuality;
    #desiredQualities = [360, 480];

    constructor() {
        this.#settingsButton = document.querySelector('[data-a-target="player-settings-button"]');
        this.init();
    }

    async init() {
        this.#currentQuality = await this.#getCurrentQuality();
    }

    async decreaseVideoDelay() {
        await this.#gotoQualitySettings();

        const qualityRadios = this.#getQualitySettingsButtonEls();
        const nextQuality = this.#getNextQuality();
        const qualityRadio = qualityRadios.find((radioEl) => this.#getRadioButtonQualityValue(radioEl) === nextQuality);

        if (qualityRadio) {
            qualityRadio.click();
        }

        console.error('decre', nextQuality, qualityRadio, qualityRadios);

        this.#closeSettingsPopup();
        this.#currentQuality = nextQuality;
    }

    #gotoQualitySettings() {
        this.#settingsButton.click();

        return new Promise((resolve) => {
            setTimeout(() => {
                document.querySelector('[data-a-target="player-settings-menu-item-quality"]')?.click();
                resolve();
            }, 50);
        });
    }

    #closeSettingsPopup() {
        this.#settingsButton.click();
    }

    #getQualitySettingsButtonEls() {
        return Array.from(document.querySelectorAll('[name="player-settings-submenu-quality-option"]'));
    }

    async #getCurrentQuality() {
        await this.#gotoQualitySettings();

        const qualityRadios = this.#getQualitySettingsButtonEls();
        const checkedRadio = qualityRadios.find((radioEl) => radioEl.checked);

        if (!checkedRadio) {
            return 144;
        }

        this.#closeSettingsPopup();

        return this.#getRadioButtonQualityValue(checkedRadio);
    }

    #getNextQuality() {
        return this.#desiredQualities.find((quality) => quality !== this.#currentQuality);
    }

    #getRadioButtonQualityValue(radioEl) {
        const labelEl = radioEl.nextSibling;
        const divEl = labelEl.querySelector('div');

        return Number.parseInt(divEl.textContent.replace('p', ''), 10);
    }
}
