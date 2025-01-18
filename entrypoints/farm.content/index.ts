import { main } from './farm';

// eslint-disable-next-line no-undef
export default defineContentScript({
    matches: ['https://www.twitch.tv/hitsquadgodfather'],
    runAt: 'document_start',
    main
});
