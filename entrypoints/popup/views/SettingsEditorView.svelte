<div>
    <ul uk-tab class="hgf-mb-0">
        <li class="uk-active"><a href="/">Twitch Widget</a></li>
        <li><a href="/">StreamElements Widget</a></li>
    </ul>

    <div class="uk-switcher hgf-p-16">
        <!-- Twitch Widget -->
        <div>
            <label class="uk-switch hgf-mb-16">
                <input
                    type="checkbox"
                    data-setting="highlightMentions"
                    checked={settingsFacade.settings.highlightMentions}
                    onchange={updateSetting}
                >

                <div class="uk-switch-slider"></div>

                Highlighting messages mentioning me
            </label>

            <label class="uk-switch hgf-mb-16">
                <input
                    type="checkbox"
                    data-setting="collectDaCoinz"
                    checked={settingsFacade.settings.collectDaCoinz}
                    onchange={updateSetting}
                >

                <div class="uk-switch-slider"></div>

                Automatically collect Da Coinz
            </label>

            <label class="uk-switch">
                <input
                    type="checkbox"
                    data-setting="decreaseStreamDelay"
                    checked={settingsFacade.settings.decreaseStreamDelay}
                    onchange={updateSetting}
                >

                <div class="uk-switch-slider"></div>

                Automatically decrease stream delay every 5 minutes
            </label>
        </div>

        <!-- StreamElements Widget -->
        <div>
            <label class="uk-switch hgf-mb-8">
                <input
                    type="checkbox"
                    data-setting="enhanceStoreHeader"
                    checked={settingsFacade.settings.enhanceStoreHeader}
                    onchange={updateSetting}
                >

                <div class="uk-switch-slider"></div>

                Enhance store header
            </label>

            <p class="hgf-mb-16 hgf-popup-description">Hide store banner</p>

            <label class="uk-switch hgf-mb-8">
                <input
                    type="checkbox"
                    data-setting="enhanceStoreSidebar"
                    checked={settingsFacade.settings.enhanceStoreSidebar}
                    onchange={updateSetting}
                >

                <div class="uk-switch-slider"></div>

                Enhance store sidebar
            </label>

            <p class="hgf-mb-16 hgf-popup-description">Hide channel logo and Twitch actions. Make block with stats sticky</p>

            <label class="uk-switch hgf-mb-8">
                <input
                    type="checkbox"
                    data-setting="hideStoreFooter"
                    checked={settingsFacade.settings.hideStoreFooter}
                    onchange={updateSetting}
                >

                <div class="uk-switch-slider"></div>

                Hide store footer
            </label>

            <hr>

            <label class="hgf-mb-4 uk-display-block">
                <span class="hgf-mb-4 uk-display-inline-block">Sort offers</span>

                <select
                    class="uk-select"
                    data-setting="sortOffersBy"
                    value={settingsFacade.settings.sortOffersBy}
                    onchange={updateSetting}
                >
                    <option value="'order'">Default (no sorting)</option>
                    <option value="'-cost'">Cost (most expensive first)</option>
                    <option value="'-createdAt'">Adding date (most recent first)</option>
                </select>
            </label>

            <p class="hgf-mb-16 hgf-popup-description">Automatically sort offers when you enter the store page</p>

            <label class="uk-display-block">
                Hide offers with price over
                <input
                    class="uk-range"
                    type="range"
                    min="0"
                    max="999999"
                    step="1"
                    data-setting="offersMaxPrice"
                    value={settingsFacade.settings.offersMaxPrice}
                    onchange={updateSetting}
                >
            </label>

            <p class="hgf-mb-16 hgf-popup-description">0-999999</p>

            <label class="uk-switch hgf-mb-16">
                <input
                    type="checkbox"
                    data-setting="hideSoldOutOffers"
                    checked={settingsFacade.settings.hideSoldOutOffers}
                    onchange={updateSetting}
                >

                <div class="uk-switch-slider"></div>

                Hide sold out offers
            </label>

            <label class="uk-switch hgf-mb-8">
                <input
                    type="checkbox"
                    data-setting="highlightLowVolumeOffers"
                    checked={settingsFacade.settings.highlightLowVolumeOffers}
                    onchange={updateSetting}
                >

                <div class="uk-switch-slider"></div>

                Highlight offers with low volume
            </label>

            <p class="hgf-popup-description">Highlight offers with low volume (less than 10)</p>
        </div>
    </div>
</div>

<script lang="ts">
import { Container } from 'typedi';
import { type GlobalSettingsKeys, SettingsFacade } from '@shared/modules';

const settingsFacade = Container.get(SettingsFacade);

function parseInputValue(control: HTMLInputElement | HTMLSelectElement) {
    if (control.type === 'checkbox') {
        return control.checked;
    }

    if (control.type === 'range') {
        return Number(control.value);
    }

    return control.value;
}

function updateSetting(event: Event) {
    const target = event.target as HTMLInputElement;
    const setting = target.dataset.setting as GlobalSettingsKeys;

    settingsFacade.updateSettings({
        [setting]: parseInputValue(target)
    });
}
</script>

<style>
.hgf-popup-description {
    margin-top: 0;
    color: rgb(108, 108, 108);
    font-size: 12px;
}
</style>
