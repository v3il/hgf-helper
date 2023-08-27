// import { settingsService } from '../shared';

console.error('load');

document.querySelector('button').addEventListener('click', async () => {
    // eslint-disable-next-line no-undef
    const settings = await chrome.runtime.sendMessage({ greeting: 'hello' });

    console.error(2, settings);

    // settingsService.getSetting('test');

    // // eslint-disable-next-line no-undef
    // await chrome.storage.sync.set({ test: 'test' });
    //
    // // eslint-disable-next-line no-undef
    // const r = await chrome.storage.sync.get(['test']);
    //
    // console.error(r);

    // eslint-disable-next-line no-undef
    // chrome.runtime.sendMessage({ greeting: 'hello' }, (response) => {
    //     console.log(response.farewell);
    // });
});
