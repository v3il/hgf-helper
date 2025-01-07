import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',

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
    //     "js": ["src/store/store.js"],
    //     "matches": ["https://streamelements.com/hitsquadgodfather/store"],
    //     "run_at": "document_start"
    //   }
    // ],

    permissions: ['storage']
  }
});
