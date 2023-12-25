import path from 'path';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
    plugins: [eslint()],

    build: {
        target: 'esnext',

        build: {
            minify: 'terser',
            terserOptions: {
                compress: {
                    keep_fnames: /^.*/
                }
            }
        },

        rollupOptions: {
            input: {
                farm: path.resolve(__dirname, 'src/farm/farm.js'),
                farmInjected: path.resolve(__dirname, 'src/farm/farmInjected.js'),
                farmBootstrap: path.resolve(__dirname, 'src/farm/farmBootstrap.js'),
                store: path.resolve(__dirname, 'src/store/store.js'),
                storeBootstrap: path.resolve(__dirname, 'src/store/storeBootstrap.js'),
                popup: path.resolve(__dirname, 'src/popup/popup.js'),
                background: path.resolve(__dirname, 'src/background/background.js'),
                shared: path.resolve(__dirname, 'src/shared/index.js')
            },

            output: {
                entryFileNames: '[name].js',
                assetFileNames: '[name].[ext]',
                chunkFileNames: '[name].js'
            }
        }
    }
});
