import path from 'path';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
    plugins: [eslint()],

    build: {
        rollupOptions: {
            input: {
                'hgf-farm-bootstrap': path.resolve(__dirname, 'src/hgf-farm/hgf-farm-bootstrap.js'),
                'hgf-farm': path.resolve(__dirname, 'src/hgf-farm/hgf-farm.js'),
                'hgf-store': path.resolve(__dirname, 'src/hgf-store/hgf-store.js')
            },

            output: {
                entryFileNames: '[name].js',
                assetFileNames: '[name].[ext]'
            }
        }
    }
});
