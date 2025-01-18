export default defineContentScript({
    matches: ['https://www.twitch.tv/*'],
    async main() {
        await injectScript('/farmMainWorldInjected.js', {
            keepInDom: true
        });
    }
});
