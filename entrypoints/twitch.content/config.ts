import { Timing } from '@shared/consts';

interface IConfig {
    twitchChannelName: string;
    miniGamesBotDowntime: number;
    hitsquadGameBaseTimeout: number;
    twitchAdminName: string;
    delayRemoverInterval: number;
}

const twitchChannelName = location.pathname.slice(1);
const isHitsquadGodFatherChannel = twitchChannelName === 'hitsquadgodfather';

export const isHitsquadChannel = () => [
    'hitsquadgodfather',
    'hitsquadbruno',
    'hitsquadvito',
    'hitsquadcarlo'
].includes(twitchChannelName);

export const config: IConfig = {
    twitchChannelName,
    twitchAdminName: twitchChannelName,
    miniGamesBotDowntime: isHitsquadGodFatherChannel ? 10 * Timing.MINUTE : 15 * Timing.MINUTE,
    hitsquadGameBaseTimeout: isHitsquadGodFatherChannel ? 5 * Timing.MINUTE : 10 * Timing.MINUTE,
    delayRemoverInterval: 2.5 * Timing.MINUTE
} as const;
