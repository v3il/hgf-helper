import path from 'path'
import { defineConfig } from "vite";

export default defineConfig({
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
})
