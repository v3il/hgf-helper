import { defineConfig } from 'wxt';
import { buildConfig } from './wxt-common.config';

export default defineConfig(buildConfig({
    description: 'HGF Helper (build {{version}})',

    zip: {
        artifactTemplate: 'hgf-helper@v{{version}}.zip'
    }
}));
