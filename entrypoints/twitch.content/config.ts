import { Timing } from '@shared/consts';

interface IConfig {
    twitchChannelName: string;
    isHitsquadChannel: boolean;
    isHitsquadPlaysChannel: boolean;
    miniGamesBotDowntime: number;
    hitsquadGameBaseTimeout: number;
    twitchAdminName: string;
    delayRemoverInterval: number;
}

const twitchChannelName = location.pathname.slice(1);

const isHitsquadChannel = twitchChannelName === 'hitsquadgodfather';
const isHitsquadPlaysChannel = twitchChannelName === 'hitsquadplays';

export const config: IConfig = {
    twitchChannelName,
    isHitsquadChannel,
    isHitsquadPlaysChannel,
    miniGamesBotDowntime: isHitsquadChannel ? 10 * Timing.MINUTE : 35 * Timing.MINUTE,
    hitsquadGameBaseTimeout: isHitsquadChannel ? 8 * Timing.MINUTE : 28 * Timing.MINUTE,
    twitchAdminName: twitchChannelName,
    delayRemoverInterval: 2.5 * Timing.MINUTE
} as const;
