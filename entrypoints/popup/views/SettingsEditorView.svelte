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
                <SettingEditor title="Hide store banner" classes="mb-4">
                    <Switch
                        isChecked={settings.enhanceStoreHeader}
                        onChange={(isChecked) => updateSetting('enhanceStoreHeader', isChecked)}
                    />
                </SettingEditor>

                <SettingEditor
                    title="Enhance store sidebar"
                    description="Hide the channel logo and Twitch action buttons. Make the sidebar sticky"
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
                    description="Sort offers automatically when opening the store"
                    classes="mb-4"
                >
                    <Select
                        classes="w-[135px]"
                        value={settings.sortOffersBy}
                        onChange={(value) => updateSetting('sortOffersBy', value)}
                        options={SORT_OFFERS_BY_OPTIONS}
                    />
                </SettingEditor>

                <SettingEditor
                    title="Hide offers priced over"
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
                    description="Highlight offers with low volume (under 10)"
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
import { StreamElementsSortOffersBy } from '@shared/consts';

const settingsFacade = Container.get(SettingsFacade);

const settings: ISettings = $state({ ...settingsFacade.settings });

const TABS: { label: string, value: string }[] = [
    {
        label: 'Twitch Widget',
        value: 'twitch'
    },
    {
        label: 'StreamElements Widget',
        value: 'stream-elements'
    }
];

const SORT_OFFERS_BY_OPTIONS: { value: StreamElementsSortOffersBy, label: string }[] = [
    { value: StreamElementsSortOffersBy.DEFAULT, label: 'Default' },
    { value: StreamElementsSortOffersBy.CREATED_AT, label: 'Newest first' },
    { value: StreamElementsSortOffersBy.SUBSCRIBERS_ONLY, label: 'Subscribers only' },
    { value: StreamElementsSortOffersBy.COST, label: 'Cost' }
];

const debouncedUpdateSetting = debounce(() => {
    settingsFacade.updateSettings(settings);
}, 250);

function updateSetting<K extends GlobalSettingsKeys>(settingName: K, value: ISettings[K]) {
    settings[settingName] = value;
    debouncedUpdateSetting();
}
</script>
