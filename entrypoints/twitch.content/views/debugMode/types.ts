import { ICheckPoint } from '@twitch/modules/stream';

export type DebugModeCheckPoint = ICheckPoint & { id: string };

export enum DebugModeCheckPreset {
    ANTI_CHEAT = 'anti-cheat1',
    ANTI_CHEAT2 = 'anti-cheat2',
    LOOT_GAME1 = 'loot1',
    LOOT_GAME2 = 'loot2',
    CHEST_GAME1 = 'chest1',
    CHEST_GAME2 = 'chest2',
    BLANK = 'blank'
}
