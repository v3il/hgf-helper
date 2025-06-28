import { LocalSettingsService } from '@shared/services';
import { config } from '@twitch/config';

export * from './TwitchUIService';

const STORAGE_KEY = 'hgf-helper.twitch-settings-' + config.twitchChannelName;

export interface ITwitchLocalSettings {
    hitsquad: boolean;
    hitsquadRounds: number;
    chestGame: boolean;
    lootGame: boolean;
}

export const localSettingsService = new LocalSettingsService<ITwitchLocalSettings>(STORAGE_KEY, {
    hitsquad: false,
    hitsquadRounds: 0,
    chestGame: false,
    lootGame: false
});
