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
                resources: ['farmMainWorldInjected.js'],
                matches: ['https://www.twitch.tv/*']
            }
        ]
    },

    alias: {
        '@farm': resolve(__dirname, './entrypoints/farm.content'),
        '@components': resolve(__dirname, './components')
    },

    ...rest
});
