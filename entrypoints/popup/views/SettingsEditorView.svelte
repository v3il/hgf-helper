<div>
    <Tabs variants={TABS}>
        {#snippet content(activeTab)}
            {#if activeTab === 'twitch'}
                <SettingEditor title="Highlighting messages mentioning me" classes="mb-4">
                    <Switch
                        isChecked={settingsFacade.settings.highlightMentions}
                        onChange={(isChecked) => updateSetting2('highlightMentions', isChecked)}
                    />
                </SettingEditor>

                <SettingEditor title="Automatically collect Da Coinz" classes="mb-4">
                    <Switch
                        isChecked={settingsFacade.settings.collectDaCoinz}
                        onChange={(isChecked) => updateSetting2('collectDaCoinz', isChecked)}
                    />
                </SettingEditor>

                <SettingEditor title="Automatically decrease stream delay">
                    <Switch
                        isChecked={settingsFacade.settings.decreaseStreamDelay}
                        onChange={(isChecked) => updateSetting2('decreaseStreamDelay', isChecked)}
                    />
                </SettingEditor>
            {/if}

            {#if activeTab === 'stream-elements'}
                <SettingEditor title="Enhance store header" description="Hide store banner" classes="mb-4">
                    <Switch
                        isChecked={settingsFacade.settings.enhanceStoreHeader}
                        onChange={(isChecked) => updateSetting2('enhanceStoreHeader', isChecked)}
                    />
                </SettingEditor>

                <SettingEditor
                    title="Enhance store sidebar"
                    description="Hide channel logo and Twitch actions. Make block with stats sticky"
                    classes="mb-4"
                >
                    <Switch
                        isChecked={settingsFacade.settings.enhanceStoreSidebar}
                        onChange={(isChecked) => updateSetting2('enhanceStoreSidebar', isChecked)}
                    />
                </SettingEditor>

                <SettingEditor title="Enhance store footer" classes="mb-4">
                    <Switch
                        isChecked={settingsFacade.settings.hideStoreFooter}
                        onChange={(isChecked) => updateSetting2('hideStoreFooter', isChecked)}
                    />
                </SettingEditor>

                <div class="shrink-0 h-[1px] w-full my-4 bg-gray-100"></div>

                <SettingEditor
                    title="Sort offers"
                    description="Sort offers automatically on store open"
                    classes="mb-4"
                >
                    <Select
                        classes="w-[120px]"
                        value={settingsFacade.settings.sortOffersBy}
                        onChange={(value) => updateSetting2('sortOffersBy', value)}
                        options={[
                            { value: '\'order\'', label: 'Default' },
                            { value: '\'-cost\'', label: 'Price ↓' },
                            { value: '\'-createdAt\'', label: 'Newest first' }
                        ]}
                    />
                </SettingEditor>

                <SettingEditor
                    title="Hide offers with price over"
                    description="0-999999"
                    classes="mb-4"
                >
                    {settingsFacade.settings.offersMaxPrice}

                    {#snippet after()}
                        <Range
                            min={0}
                            max={999_999}
                            value={settingsFacade.settings.offersMaxPrice}
                            onChange={(value) => updateSetting2('offersMaxPrice', value)}
                        />
                    {/snippet}
                </SettingEditor>

                <SettingEditor title="Hide sold out offers" classes="mb-4">
                    <Switch
                        isChecked={settingsFacade.settings.hideSoldOutOffers}
                        onChange={(isChecked) => updateSetting2('hideSoldOutOffers', isChecked)}
                    />
                </SettingEditor>

                <SettingEditor
                    title="Highlight offers with low volume"
                    description="Highlight offers with low volume (less than 10)"
                >
                    <Switch
                        isChecked={settingsFacade.settings.highlightLowVolumeOffers}
                        onChange={(isChecked) => updateSetting2('highlightLowVolumeOffers', isChecked)}
                    />
                </SettingEditor>
            {/if}
        {/snippet}
    </Tabs>
</div>

<script lang="ts">
import { Container } from 'typedi';
import { type GlobalSettingsKeys, SettingsFacade } from '@shared/modules';
import { Range, Select, Switch, Tabs } from '@shared/components';
import SettingEditor from './SettingEditor.svelte';

const settingsFacade = Container.get(SettingsFacade);

const TABS = [
    {
        label: 'Twitch Widget',
        value: 'twitch'
    },
    {
        label: 'StreamElements Widget',
        value: 'stream-elements'
    }
];

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
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const setting = target.dataset.setting as GlobalSettingsKeys;

    settingsFacade.updateSettings({
        [setting]: parseInputValue(target)
    });
}

function updateSetting2(settingName: GlobalSettingsKeys, value: string | number | boolean) {
    settingsFacade.updateSettings({
        [settingName]: value
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
