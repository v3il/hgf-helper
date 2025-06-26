import { Timing } from '@shared/consts';

const twitchChannelName = location.pathname.slice(1);

const isHitsquadChannel = twitchChannelName === 'hitsquadgodfather';
const isHitsquadPlaysChannel = twitchChannelName === 'hitsquadplays';

export const config = Object.freeze({
    isHitsquadChannel,
    isHitsquadPlaysChannel,
    miniGamesBotDowntime: isHitsquadChannel ? 10 * Timing.MINUTE : 35 * Timing.MINUTE,
    hitsquadGameBaseTimeout: isHitsquadChannel ? 8 * Timing.MINUTE : 28 * Timing.MINUTE,
    twitchAdminName: twitchChannelName,
    delayRemoverInterval: 2.5 * Timing.MINUTE,
});
