import '@shoelace-style/shoelace/dist/themes/dark.css';

export default defineContentScript({
    matches: ['https://streamelements.com/*', 'https://www.twitch.tv/*'],
    async main() {
        await injectScript('/shoelaceInjected.js', {
            keepInDom: true
        });
    }
});
