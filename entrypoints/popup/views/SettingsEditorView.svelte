<div>
    <Tabs variants={TABS}>
        {#snippet content(activeTab)}
            {#if activeTab === 'twitch'}
                <SettingEditor title="Highlighting messages mentioning me" classes="mb-4">
                    <Switch
                        isChecked={settingsFacade.settings.highlightMentions}
                        onChange={(isChecked) => updateSetting('highlightMentions', isChecked)}
                    />
                </SettingEditor>

                <SettingEditor title="Automatically collect Da Coinz" classes="mb-4">
                    <Switch
                        isChecked={settingsFacade.settings.collectDaCoinz}
                        onChange={(isChecked) => updateSetting('collectDaCoinz', isChecked)}
                    />
                </SettingEditor>

                <SettingEditor title="Automatically decrease stream delay">
                    <Switch
                        isChecked={settingsFacade.settings.decreaseStreamDelay}
                        onChange={(isChecked) => updateSetting('decreaseStreamDelay', isChecked)}
                    />
                </SettingEditor>
            {/if}

            {#if activeTab === 'stream-elements'}
                <SettingEditor title="Enhance store header" description="Hide store banner" classes="mb-4">
                    <Switch
                        isChecked={settingsFacade.settings.enhanceStoreHeader}
                        onChange={(isChecked) => updateSetting('enhanceStoreHeader', isChecked)}
                    />
                </SettingEditor>

                <SettingEditor
                    title="Enhance store sidebar"
                    description="Hide channel logo and Twitch actions. Make block with stats sticky"
                    classes="mb-4"
                >
                    <Switch
                        isChecked={settingsFacade.settings.enhanceStoreSidebar}
                        onChange={(isChecked) => updateSetting('enhanceStoreSidebar', isChecked)}
                    />
                </SettingEditor>

                <SettingEditor title="Hide store footer" classes="mb-4">
                    <Switch
                        isChecked={settingsFacade.settings.hideStoreFooter}
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
                        value={settingsFacade.settings.sortOffersBy}
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
                    {offersMaxPrice}

                    {#snippet after()}
                        <Range
                            min={0}
                            max={999_999}
                            value={offersMaxPrice}
                            onInput={(value) => offersMaxPrice = value}
                            onChange={(value) => updateSetting('offersMaxPrice', value)}
                            classes="mt-3"
                        />
                    {/snippet}
                </SettingEditor>

                <SettingEditor title="Hide sold out offers" classes="mb-4">
                    <Switch
                        isChecked={settingsFacade.settings.hideSoldOutOffers}
                        onChange={(isChecked) => updateSetting('hideSoldOutOffers', isChecked)}
                    />
                </SettingEditor>

                <SettingEditor
                    title="Highlight offers with low volume"
                    description="Highlight offers with low volume (less than 10)"
                >
                    <Switch
                        isChecked={settingsFacade.settings.highlightLowVolumeOffers}
                        onChange={(isChecked) => updateSetting('highlightLowVolumeOffers', isChecked)}
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

let offersMaxPrice = $state(settingsFacade.settings.offersMaxPrice); // todo: find a better solution

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

function updateSetting(settingName: GlobalSettingsKeys, value: string | number | boolean) {
    settingsFacade.updateSettings({
        [settingName]: value
    });
}
</script>
