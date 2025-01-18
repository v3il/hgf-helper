import { start } from './store';

// eslint-disable-next-line no-undef
export default defineContentScript({
    matches: ['https://streamelements.com/hitsquadgodfather/store'],
    main() { start(); }
});
