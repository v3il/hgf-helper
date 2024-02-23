import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import { crx } from '@crxjs/vite-plugin';
import { resolve } from 'path';
import manifest from './manifest.json';

export default defineConfig({
    plugins: [
        eslint(),
        crx({ manifest })
    ],

    resolve: {
        alias: {
            '@': resolve(__dirname, './src')
        }
    }
});
