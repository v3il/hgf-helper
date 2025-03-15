import { main } from './twitch';

// eslint-disable-next-line no-undef
export default defineContentScript({
    matches: ['https://www.twitch.tv/hitsquadgodfather', 'https://www.twitch.tv/hitsquadplays'],
    runAt: 'document_start',
    main
});
