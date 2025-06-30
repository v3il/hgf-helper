import { main } from './twitch';

export default defineContentScript({
    matches: ['https://www.twitch.tv/*'],
    runAt: 'document_start',
    main
});
