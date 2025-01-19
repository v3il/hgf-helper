import { defineConfig } from 'wxt';
import { resolve } from 'node:path';

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
    },

    alias: {
        '@farm': resolve(__dirname, './entrypoints/farm.content'),
        '@components': resolve(__dirname, './components')
    },

    zip: {
        artifactTemplate: 'v{{version}}.zip'
    }
});
