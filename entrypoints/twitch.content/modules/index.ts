import { LocalSettingsService } from '@shared/services';

export * from './TwitchUIService';

export interface ITwitchLocalSettings {
    hitsquad: boolean;
    hitsquadRounds: number;
    chestGame: boolean;
    lootGame: boolean;
}

export const localSettingsService = new LocalSettingsService<ITwitchLocalSettings>({
    hitsquad: false,
    hitsquadRounds: 0,
    lootGame: false,
    chestGame: false
});
