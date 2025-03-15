export default defineContentScript({
    matches: ['https://www.twitch.tv/*'],
    async main() {
        await injectScript('/twitchMainWorldInjected.js', {
            keepInDom: true
        });
    }
});
