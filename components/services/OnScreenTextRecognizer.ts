import { OEM, PSM, createWorker, Worker } from 'tesseract.js';
import { isDev } from '@components/consts';
import { Service } from 'typedi';

@Service()
export class OnScreenTextRecognizer {
    private containerEl!: HTMLElement;
    private worker!: Worker;

    constructor() {
        if (isDev) {
            this.createPreviewContainer();
        }
    }

    private async createWorker() {
        const worker = await createWorker('eng', OEM.LSTM_ONLY);

        await worker.setParameters({
            tessedit_pageseg_mode: PSM.SINGLE_LINE,
            tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_'
        });

        return worker;
    }

    private createPreviewContainer() {
        this.containerEl = document.createElement('div');

        this.containerEl.style.position = 'fixed';
        this.containerEl.style.bottom = '30px';
        this.containerEl.style.left = '160px';
        this.containerEl.style.zIndex = '99999';
        this.containerEl.style.border = '1px solid red';
        this.containerEl.style.display = 'flex';
        this.containerEl.style.alignItems = 'center';
        this.containerEl.style.gap = '8px';
        this.containerEl.style.background = 'black';
        this.containerEl.style.padding = '8px';
        this.containerEl.id = 'text-decoder-container';

        document.body.appendChild(this.containerEl);
    }

    private attachPreview(canvas: HTMLCanvasElement) {
        if (!isDev) {
            return;
        }

        this.containerEl.innerHTML = '';
        this.containerEl.appendChild(canvas);
    }

    async checkOnScreen(imageData: ImageData, desiredText: string) {
        this.worker ??= await this.createWorker();

        const checks = new Set<string>();
        const canvas = document.createElement('canvas');
        const tempCtx = canvas.getContext('2d')!;

        canvas.width = imageData.width;
        canvas.height = imageData.height;

        tempCtx.putImageData(imageData, 0, 0);

        for (let i = 0; i < 3; i++) {
            const rawResult = await this.worker.recognize(canvas.toDataURL('image/png'));

            console.error('Raw1', rawResult);

            const rawVariants = this.generateVariants(rawResult.data.text);

            rawVariants.forEach((variant) => checks.add(variant));

            this.increaseContrast(imageData);

            tempCtx.putImageData(imageData, 0, 0);

            this.attachPreview(canvas);

            const contrastResult = await this.worker.recognize(canvas.toDataURL('image/png'));

            console.error('Raw2', contrastResult);

            const contrastVariants = this.generateVariants(contrastResult.data.text);

            contrastVariants.forEach((variant) => checks.add(variant));
        }

        const result = [];

        for (const check of checks) {
            const similarity = this.getStringsSimilarity(check, desiredText);
            const reversed = this.reverseString(check);

            result.push({
                check,
                similarity
            });

            result.push({
                check: reversed,
                similarity: this.getStringsSimilarity(reversed, this.reverseString(desiredText))
            });
        }

        console.table(result);

        const maxSimilarity = Math.max(...result.map(({ similarity }) => similarity));

        this.containerEl?.insertAdjacentHTML('beforeend', `<div>${maxSimilarity}</div>`);

        return maxSimilarity;
    }

    private generateVariants(text: string) {
        const withoutLineEnding = text.replace('\n', ' ').trim();
        const normalizedText = withoutLineEnding.replaceAll('I', 'l').toLowerCase();

        const words = normalizedText.split(' ');
        const longestWord = words.reduce((longest, word) => (word.length > longest.length ? word : longest), '');

        return [
            withoutLineEnding,
            withoutLineEnding.replaceAll(' ', '_'),
            longestWord,
            normalizedText,
            normalizedText.replaceAll(' ', '_')
        ].filter(Boolean);
    }

    private increaseContrast(imageData: ImageData) {
        const { data } = imageData;

        for (let i = 0; i < data.length; i += 4) {
            const grayscale = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
            const value = grayscale > 128 ? 255 : 0;

            data[i] = value;
            data[i + 1] = value;
            data[i + 2] = value;
        }
    }

    private getStringsSimilarity(stringToCheck: string, template: string): number {
        const templateChars = template.toLowerCase().split('');
        const stringChars = stringToCheck.toLowerCase().split('');
        let matchedChars = 0;

        for (let i = 0; i < stringChars.length; i++) {
            if (stringChars[i] === templateChars[i]) {
                matchedChars++;
            } else if (templateChars[i] === '_' && stringChars[i] === ' ') {
                matchedChars++;
            }
        }

        return matchedChars / templateChars.length;
    }

    private reverseString(str: string) {
        return str.split('').reverse().join('');
    }
}
