import { promisifiedSetTimeout } from '@components/utils';
import { Service } from 'typedi';

@Service()
export class TwitchPlayerService {
    private readonly desiredQualities = [480, 720] as const;
    private readonly settingsButton: HTMLButtonElement;

    private currentQuality!: number;

    constructor() {
        this.settingsButton = document.querySelector<HTMLButtonElement>('[data-a-target="player-settings-button"]')!;
        this.init();
    }

    private async init() {
        this.currentQuality = await this.getCurrentQuality();
    }

    async decreaseVideoDelay() {
        await this.gotoQualitySettings();

        const qualityRadios = this.getQualitySettingsButtonEls();
        const nextQuality = this.getNextQuality();
        const qualityRadio = qualityRadios.find((radioEl) => this.getRadioButtonQualityValue(radioEl) === nextQuality);

        if (qualityRadio) {
            qualityRadio.click();
        }

        this.closeSettingsPopup();
        this.currentQuality = nextQuality;
    }

    private async gotoQualitySettings() {
        this.settingsButton.click();
        await promisifiedSetTimeout(50);

        const selector = '[data-a-target="player-settings-menu-item-quality"]';
        const qualitySettingsButton = document.querySelector<HTMLButtonElement>(selector);

        qualitySettingsButton?.click();
    }

    private closeSettingsPopup() {
        this.settingsButton.click();
    }

    private getQualitySettingsButtonEls() {
        const selector = '[name="player-settings-submenu-quality-option"]';
        return Array.from(document.querySelectorAll<HTMLInputElement>(selector));
    }

    private async getCurrentQuality() {
        await this.gotoQualitySettings();

        const qualityRadios = this.getQualitySettingsButtonEls();
        const checkedRadio = qualityRadios.find((radioEl) => radioEl.checked);

        if (!checkedRadio) {
            return 144;
        }

        this.closeSettingsPopup();

        return this.getRadioButtonQualityValue(checkedRadio);
    }

    private getNextQuality() {
        return this.desiredQualities.find((quality) => quality !== this.currentQuality) ?? 360;
    }

    private getRadioButtonQualityValue(radioEl: HTMLInputElement) {
        const labelEl = radioEl.nextSibling! as HTMLElement;
        const divEl = labelEl.querySelector('div')!;

        return Number.parseInt(divEl.textContent!.replace('p', ''), 10);
    }
}
