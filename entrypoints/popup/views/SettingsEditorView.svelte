<div>
    <Tabs variants={TABS}>
        {#snippet content(activeTab)}
            {#if activeTab === 'twitch'}
                <SettingEditor title="Highlighting messages mentioning me" classes="mb-4">
                    <Switch
                        isChecked={settings.highlightMentions}
                        onChange={(isChecked) => updateSetting('highlightMentions', isChecked)}
                    />
                </SettingEditor>

                <SettingEditor title="Automatically collect Da Coinz" classes="mb-4">
                    <Switch
                        isChecked={settings.collectDaCoinz}
                        onChange={(isChecked) => updateSetting('collectDaCoinz', isChecked)}
                    />
                </SettingEditor>

                <SettingEditor title="Automatically decrease stream delay">
                    <Switch
                        isChecked={settings.decreaseStreamDelay}
                        onChange={(isChecked) => updateSetting('decreaseStreamDelay', isChecked)}
                    />
                </SettingEditor>
            {/if}

            {#if activeTab === 'stream-elements'}
                <SettingEditor title="Enhance store header" description="Hide store banner" classes="mb-4">
                    <Switch
                        isChecked={settings.enhanceStoreHeader}
                        onChange={(isChecked) => updateSetting('enhanceStoreHeader', isChecked)}
                    />
                </SettingEditor>

                <SettingEditor
                    title="Enhance store sidebar"
                    description="Hide channel logo and Twitch actions. Make block with stats sticky"
                    classes="mb-4"
                >
                    <Switch
                        isChecked={settings.enhanceStoreSidebar}
                        onChange={(isChecked) => updateSetting('enhanceStoreSidebar', isChecked)}
                    />
                </SettingEditor>

                <SettingEditor title="Hide store footer" classes="mb-4">
                    <Switch
                        isChecked={settings.hideStoreFooter}
                        onChange={(isChecked) => updateSetting('hideStoreFooter', isChecked)}
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
                        value={settings.sortOffersBy}
                        onChange={(value) => updateSetting('sortOffersBy', value)}
                        options={[
                            { value: '\'order\'', label: 'Default' },
                            { value: '\'-cost\'', label: 'Cost ↓' },
                            { value: '\'-createdAt\'', label: 'Date ↓' }
                        ]}
                    />
                </SettingEditor>

                <SettingEditor
                    title="Hide offers with price over"
                    description="0-999999"
                    classes="mb-4"
                >
                    {settings.offersMaxPrice}

                    {#snippet after()}
                        <Range
                            min={0}
                            max={999_999}
                            value={settings.offersMaxPrice}
                            onInput={(value) => updateSetting('offersMaxPrice', value)}
                            classes="mt-3"
                        />
                    {/snippet}
                </SettingEditor>

                <SettingEditor title="Hide sold out offers" classes="mb-4">
                    <Switch
                        isChecked={settings.hideSoldOutOffers}
                        onChange={(isChecked) => updateSetting('hideSoldOutOffers', isChecked)}
                    />
                </SettingEditor>

                <SettingEditor
                    title="Highlight offers with low volume"
                    description="Highlight offers with low volume (less than 10)"
                >
                    <Switch
                        isChecked={settings.highlightLowVolumeOffers}
                        onChange={(isChecked) => updateSetting('highlightLowVolumeOffers', isChecked)}
                    />
                </SettingEditor>
            {/if}
        {/snippet}
    </Tabs>
</div>

<script lang="ts">
import { Container } from 'typedi';
import { type GlobalSettingsKeys, SettingsFacade, type ISettings } from '@shared/modules';
import { Range, Select, Switch, Tabs } from '@shared/components';
import SettingEditor from './SettingEditor.svelte';
import { debounce } from 'lodash';

const settingsFacade = Container.get(SettingsFacade);

const settings: ISettings = $state({ ...settingsFacade.settings });

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

const debouncedUpdateSetting = debounce(() => {
    settingsFacade.updateSettings(settings);
}, 250);

function updateSetting<K extends GlobalSettingsKeys>(settingName: K, value: ISettings[K]) {
    settings[settingName] = value;
    debouncedUpdateSetting();
}
</script>
