import { defineConfig } from 'wxt';
// @ts-ignore
import eslint from 'vite-plugin-eslint';

// See https://wxt.dev/api/config.html
export default defineConfig({
    extensionApi: 'chrome',

    vite: () => ({
        plugins: [
            eslint()
        ]
    }),

    manifest: {
        name: 'HGF Helper',
        description: 'HGF Helper (dev)',

        // "content_scripts": [
        //   {
        //     "js": ["src/farm/farm.js", "src/farm/farmMainWorldInjector.js"],
        //     "matches": ["https://www.twitch.tv/hitsquadgodfather"],
        //     "run_at": "document_start"
        //   },
        //
        //   {
        //     "js": ["src/store/index.ts"],
        //     "matches": ["https://streamelements.com/hitsquadgodfather/store"],
        //     "run_at": "document_start"
        //   }
        // ],

        permissions: ['storage']
    }
});
