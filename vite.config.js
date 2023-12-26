import path from 'path';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
    plugins: [
        eslint()
    ],

    build: {
        target: 'modules',

        rollupOptions: {
            input: {
                farm: path.resolve(__dirname, 'src/farm/farm.js'),
                farmInjected: path.resolve(__dirname, 'src/farm/farmInjected.js'),
                farmBootstrap: path.resolve(__dirname, 'src/farm/farmBootstrap.js'),
                store: path.resolve(__dirname, 'src/store/store.js'),
                popup: path.resolve(__dirname, 'src/popup/popup.js')
            },

            output: {
                entryFileNames: '[name].js',
                assetFileNames: '[name].[ext]',
                chunkFileNames: '[name].js'
            }
        }
    }
});
