import { main } from './store';

export default defineContentScript({
    matches: ['https://streamelements.com/hitsquadgodfather/store*'],
    main
});
