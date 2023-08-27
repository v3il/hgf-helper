import path from 'path';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
    plugins: [eslint()],

    build: {
        target: 'esnext',
        rollupOptions: {
            input: {
                // shared: path.resolve(__dirname, 'src/shared/index.js'),
                farm: path.resolve(__dirname, 'src/farm/farm.js'),
                store: path.resolve(__dirname, 'src/store/store.js'),
                popup: path.resolve(__dirname, 'src/popup/popup.js'),
                background: path.resolve(__dirname, 'src/background/background.js')
            },

            output: {
                entryFileNames: '[name].js',
                assetFileNames: '[name].[ext]'
            }
        }
    }
});
