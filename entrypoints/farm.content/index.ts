import { main } from './farm';

// eslint-disable-next-line no-undef
export default defineContentScript({
    // matches: ['https://www.twitch.tv/hitsquadgodfather', 'https://www.twitch.tv/hitsquadplays'],
    matches: ['https://www.twitch.tv/*'],
    runAt: 'document_start',
    main
});
