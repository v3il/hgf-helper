import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { globSync } from 'glob';
import archiver from 'archiver';

const filename = fileURLToPath(import.meta.url);
const projectRoot = path.join(path.dirname(filename));
const releaseDir = path.join(projectRoot, 'dist');

const existingArchives = globSync('./*.zip');

for (const existingArchive of existingArchives) {
    console.error(`Removing ${existingArchive}`);
    fs.rmSync(existingArchive);
}

const manifest = JSON.parse(fs.readFileSync(new URL('./dist/manifest.json', import.meta.url)));
manifest.description = `${manifest.name} (build ${manifest.version})`;
fs.writeFileSync(`${releaseDir}/manifest.json`, JSON.stringify(manifest));

const archive = archiver.create('zip', {});
const output = fs.createWriteStream(path.join(projectRoot, `hgf-helper@${manifest.version}.zip`));

output.on('close', () => console.log('Done'));

archive.pipe(output);
archive.on('error', (error) => console.error(error));
archive.directory(releaseDir, '').finalize();
