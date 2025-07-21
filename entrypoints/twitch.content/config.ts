import { Timing } from '@shared/consts';

interface IConfig {
    twitchChannelName: string;
    miniGamesBotDowntime: number;
    hitsquadGameBaseTimeout: number;
    twitchAdminName: string;
    delayRemoverInterval: number;
}

const twitchChannelName = location.pathname.slice(1);

export const isHitsquadChannel = () => [
    'hitsquadgodfather',
    'hitsquadbruno',
    'hitsquadvito',
    'hitsquadcarlo'
].includes(twitchChannelName);

export const config: IConfig = {
    twitchChannelName,
    twitchAdminName: twitchChannelName,
    miniGamesBotDowntime: 10 * Timing.MINUTE,
    hitsquadGameBaseTimeout: 5 * Timing.MINUTE,
    delayRemoverInterval: 3 * Timing.MINUTE
} as const;
