import { resolve } from 'node:path';
import { UserConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

interface IParams extends UserConfig {
    description: string;
}

// See https://wxt.dev/api/config.html
export const buildConfig = ({ description, ...rest }: IParams): UserConfig => ({
    extensionApi: 'chrome',
    modules: ['@wxt-dev/module-svelte'],

    vite: () => ({
        plugins: [
            tailwindcss(),
        ],
    }),

    manifest: {
        description,
        name: 'HGF Helper',
        permissions: ['storage'],
        host_permissions: ['https://www.twitch.tv/*', 'https://streamelements.com/*', 'http://localhost:5001/*'],

        web_accessible_resources: [
            {
                resources: ['twitchMainWorldInjected.js'],
                matches: ['https://www.twitch.tv/*']
            },
            {
                resources: ['logo.png'],
                matches: ['https://www.twitch.tv/*', 'https://streamelements.com/*']
            },
        ]
    },

    alias: {
        '@twitch': resolve(__dirname, './entrypoints/twitch.content'),
        '@store': resolve(__dirname, './entrypoints/store.content'),
        '@utils': resolve(__dirname, './utils'),
        '@shared': resolve(__dirname, './shared')
    },

    ...rest
});
