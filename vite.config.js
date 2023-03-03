import path from 'path';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
    plugins: [eslint()],

    build: {
        rollupOptions: {
            input: {
                extension: path.resolve(__dirname, 'src/extension.js'),
                bootstrap: path.resolve(__dirname, 'src/bootstrap.js')
            },

            output: {
                entryFileNames: '[name].js',
                assetFileNames: '[name].[ext]'
            }
        }
    }
});
