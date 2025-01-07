import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
    extensionApi: 'chrome',

    manifest: {
        name: 'HGF Helper',
        description: 'HGF Helper (dev)',
        permissions: ['storage'],

        web_accessible_resources: [
            {
                resources: ['farmMainWorldInjected.js'],
                matches: ['https://www.twitch.tv/*']
            }
        ]
    }
});
