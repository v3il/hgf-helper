import { defineConfig } from "vite";

export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                entryFileNames: 'extension.js',
                assetFileNames: 'extension.[ext]'
            }
        }
    }
})
