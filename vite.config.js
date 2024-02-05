import path from 'path';
import { build, defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
// import { viteSingleFile } from 'vite-plugin-singlefile';

// const libraries = [
//     {
//         entry: './src/farm/farm.js',
//         name: 'farm',
//         fileName: 'farm'
//     },
//     {
//         entry: './src/farm/farmInjected.js',
//         name: 'farmInjected',
//         fileName: 'farmInjected'
//     }
// ];
//
// // build
// libraries.forEach(async (libItem) => {
//     await build({
//         configFile: false,
//         build: {
//             lib: libItem,
//             emptyOutDir: false,
//             rollupOptions: {
//                 // other options
//             }
//         }
//     });
// });

export default defineConfig({
    plugins: [
        eslint()
        // viteSingleFile({ removeViteModuleLoader: true })
    ],

    // esbuild: {
    //     format: 'iife'
    // },

    build: {
        target: 'modules',

        lib: {
            entry: {
                farm: path.resolve(__dirname, './src/farm/farm.js'),
                farmBootstrap: path.resolve(__dirname, './src/farm/farmBootstrap.js'),
                farmInjected: path.resolve(__dirname, './src/farm/farmInjected.js'),
                store: path.resolve(__dirname, './src/store/store.js')
            },
            name: 'MyLib',
            formats: ['amd'],
            // the proper extensions will be added
            // fileName: 'my-lib'
            fileName: (_, name) => `${name}.js`
        }

        // modulePreload: false,

        // rollupOptions: {
        //     // input: {
        //     //     farm: path.resolve(__dirname, 'src/farm/farm.js'),
        //     //     farmInjected: path.resolve(__dirname, 'src/farm/farmInjected.js'),
        //     //     farmBootstrap: path.resolve(__dirname, 'src/farm/farmBootstrap.js'),
        //     //     store: path.resolve(__dirname, 'src/store/store.js'),
        //     //     popup: path.resolve(__dirname, 'src/popup/popup.js')
        //     // },
        //
        //     output: {
        //         // entryFileNames: '[name].js',
        //         inlineDynamicImports: true
        //         // chunkFileNames: '[name].js',
        //         // preserveModules: false
        //     }
        // }
    }

    // resolve: {
    //     alias: {
    //         '@': resolve(__dirname, './src'),
    //     },
    // },
});
