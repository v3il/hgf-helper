import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { globSync } from 'glob';
import archiver from 'archiver';

const { version } = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url)));
const ARCHIVE_NAME = 'hgf-helper';

const filename = fileURLToPath(import.meta.url);
const projectRoot = path.join(path.dirname(filename));
const releaseDir = path.join(projectRoot, ARCHIVE_NAME);

const existingArchives = globSync('./*.zip');

for (const existingArchive of existingArchives) {
    console.error(`Removing ${existingArchive}`);
    fs.rmSync(existingArchive);
}

fs.mkdirSync(releaseDir);

fs.cpSync('./dist', `${releaseDir}/dist`, { recursive: true });
fs.cpSync('./manifest.json', `${releaseDir}/manifest.json`);
fs.cpSync('./icon.png', `${releaseDir}/icon.png`);
fs.cpSync('./popup.html', `${releaseDir}/popup.html`);

const archive = archiver.create('zip', {});
const output = fs.createWriteStream(path.join(projectRoot, `${ARCHIVE_NAME}@${version}.zip`));

output.on('close', () => {
    console.log('Done');
    fs.rmSync(releaseDir, { recursive: true, force: true });
});

archive.pipe(output);
archive.on('error', (error) => console.error(error));
archive.directory(releaseDir, '').finalize();
