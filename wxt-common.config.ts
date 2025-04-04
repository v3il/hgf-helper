import { resolve } from 'node:path';
import { UserConfig } from 'wxt';

interface IParams extends UserConfig {
    description: string;
}

// See https://wxt.dev/api/config.html
export const buildConfig = ({ description, ...rest }: IParams): UserConfig => ({
    extensionApi: 'chrome',

    manifest: {
        description,
        name: 'HGF Helper',
        permissions: ['storage'],

        web_accessible_resources: [
            {
                resources: ['twitchMainWorldInjected.js'],
                matches: ['https://www.twitch.tv/*']
            }
        ]
    },

    alias: {
        '@twitch': resolve(__dirname, './entrypoints/twitch.content'),
        '@store': resolve(__dirname, './entrypoints/store.content'),
        '@components': resolve(__dirname, './components')
    },

    ...rest
});
