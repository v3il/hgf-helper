import { ICheckPoint } from '@twitch/modules/stream';

export type DebugModeCheckPoint = ICheckPoint & { id: number };

export enum DebugModeCheckPreset {
    ANTI_CHEAT = 'anti-cheat',
    LOOT_GAME1 = 'loot1',
    LOOT_GAME2 = 'loot2',
    CHEST_GAME = 'chest',
    BLANK = 'blank'
}
