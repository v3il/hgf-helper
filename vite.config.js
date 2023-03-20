import path from 'path';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
    plugins: [eslint()],

    build: {
        rollupOptions: {
            input: {
                farmBootstrap: path.resolve(__dirname, 'src/farm/farmBootstrap.js'),
                farm: path.resolve(__dirname, 'src/farm/farm.js'),
                store: path.resolve(__dirname, 'src/store/store.js')
            },

            output: {
                entryFileNames: '[name].js',
                assetFileNames: '[name].[ext]'
            }
        }
    }
});
