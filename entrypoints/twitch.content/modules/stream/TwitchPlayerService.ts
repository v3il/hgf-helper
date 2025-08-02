import { wait } from '@utils';
import { Service } from 'typedi';

@Service()
export class TwitchPlayerService {
    private readonly settingsButton: HTMLButtonElement;
    private readonly desiredQualities = [360, 480] as const;

    constructor() {
        this.settingsButton = document.querySelector<HTMLButtonElement>('[data-a-target="player-settings-button"]')!;
    }

    async decreaseVideoDelay() {
        await this.gotoQualitySettings();

        const qualityRadios = this.getQualitySettingsButtonEls();
        const currentQuality = this.getCurrentQuality(qualityRadios);
        const nextQuality = this.getNextQuality(currentQuality);
        const qualityRadio = qualityRadios.find((radioEl) => this.getRadioButtonQualityValue(radioEl) === nextQuality);

        if (qualityRadio) {
            qualityRadio.click();
        }

        this.settingsButton.click();
    }

    private async gotoQualitySettings() {
        this.settingsButton.click();
        await wait(50);

        const selector = '[data-a-target="player-settings-menu-item-quality"]';
        const qualitySettingsButton = document.querySelector<HTMLButtonElement>(selector);

        qualitySettingsButton?.click();
    }

    private getQualitySettingsButtonEls() {
        const selector = '[name="player-settings-submenu-quality-option"]';
        return Array.from(document.querySelectorAll<HTMLInputElement>(selector));
    }

    private getCurrentQuality(radioEls: HTMLInputElement[]) {
        const checkedRadio = radioEls.find((radioEl) => radioEl.checked);

        return checkedRadio ? this.getRadioButtonQualityValue(checkedRadio) : 144;
    }

    private getNextQuality(currentQuality: number) {
        return this.desiredQualities.find((quality) => quality !== currentQuality) ?? 360;
    }

    private getRadioButtonQualityValue(radioEl: HTMLInputElement) {
        const labelEl = radioEl.nextSibling! as HTMLElement;
        const divEl = labelEl.querySelector<HTMLElement>('div')!;
        const match = divEl.textContent!.match(/^\d+/);

        return match ? parseInt(match[0], 10) : 0;
    }
}
