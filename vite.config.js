import path from 'path';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
    plugins: [eslint()],

    build: {
        rollupOptions: {
            input: {
                twitchFarmBootstrap: path.resolve(__dirname, 'src/farm/twitchFarmBootstrap.js'),
                twitchFarm: path.resolve(__dirname, 'src/farm/twitchFarm.js'),
                youtubeFarm: path.resolve(__dirname, 'src/farm/youtubeFarm.js'),
                youtubeFarmBootstrap: path.resolve(__dirname, 'src/farm/youtubeFarmBootstrap.js'),
                store: path.resolve(__dirname, 'src/store/store.js')
            },

            output: {
                entryFileNames: '[name].js',
                assetFileNames: '[name].[ext]'
            }
        }
    }
});
