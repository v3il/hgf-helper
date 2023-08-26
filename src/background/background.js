// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.error('msg', message);

    sendResponse({ settings: { a: 1 } });
});
