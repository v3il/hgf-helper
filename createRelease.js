import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { globSync } from 'glob';
import archiver from 'archiver';

// todo

const ARCHIVE_NAME = 'hgf-helper';
const manifest = JSON.parse(fs.readFileSync(new URL('./manifest.json', import.meta.url)));

const filename = fileURLToPath(import.meta.url);
const projectRoot = path.join(path.dirname(filename));
const releaseDir = path.join(projectRoot, ARCHIVE_NAME);

const existingArchives = globSync('./*.zip');

for (const existingArchive of existingArchives) {
    console.error(`Removing ${existingArchive}`);
    fs.rmSync(existingArchive);
}

fs.mkdirSync(releaseDir);

manifest.description = `${manifest.name} (build ${manifest.version})`;
fs.writeFileSync(`${releaseDir}/manifest.json`, JSON.stringify(manifest));

fs.cpSync('./dist', `${releaseDir}/dist`, { recursive: true });
fs.cpSync('./icon.png', `${releaseDir}/icon.png`);
fs.cpSync('./popup.html', `${releaseDir}/popup.html`);

const archive = archiver.create('zip', {});
const output = fs.createWriteStream(path.join(projectRoot, `${ARCHIVE_NAME}@${manifest.version}.zip`));

output.on('close', () => {
    console.log('Done');
    fs.rmSync(releaseDir, { recursive: true, force: true });
});

archive.pipe(output);
archive.on('error', (error) => console.error(error));
archive.directory(releaseDir, '').finalize();
