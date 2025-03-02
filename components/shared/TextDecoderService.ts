import Tesseract, { OEM, PSM } from 'tesseract.js';

interface ITextDecoderOptions {
    rounds?: number;
    confidence?: number;
}

export class TextDecoderService {
    private readonly containerEl: HTMLElement;
    private worker!: Tesseract.Worker;

    constructor() {
        this.containerEl = document.createElement('div');

        this.containerEl.style.position = 'fixed';
        this.containerEl.style.bottom = '30px';
        this.containerEl.style.left = '460px';
        this.containerEl.style.zIndex = '99999';
        this.containerEl.style.border = '1px solid red';
        this.containerEl.id = 'text-decoder-container';

        document.body.appendChild(this.containerEl);
    }

    private async createWorker() {
        const worker = await Tesseract.createWorker();

        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        await worker.setParameters({
            tessedit_ocr_engine_mode: OEM.LSTM_ONLY,
            tessedit_pageseg_mode: PSM.SINGLE_LINE,
            tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_ '
        });

        return worker;
    }

    private attachPreview(canvas: HTMLCanvasElement) {
        this.containerEl.innerHTML = '';
        this.containerEl.appendChild(canvas);
    }

    async checkOnScreen(imageData: ImageData, desiredText: string) {
        this.worker ??= await this.createWorker();

        const checks = [];
        const canvas = document.createElement('canvas');
        const tempCtx = canvas.getContext('2d')!;

        canvas.width = imageData.width;
        canvas.height = imageData.height;

        console.error();
        console.error();

        tempCtx.putImageData(imageData, 0, 0);

        const rawResult = await this.worker.recognize(canvas.toDataURL('image/png'));

        checks.push(this.normalizeText(rawResult.data.text));

        this.increaseContrast(imageData);

        tempCtx.putImageData(imageData, 0, 0);

        this.attachPreview(canvas);

        const contrastResult = await this.worker.recognize(canvas.toDataURL('image/png'));

        checks.push(this.normalizeText(contrastResult.data.text));

        const similarities = checks.map((check) => this.getStringsSimilarity(check, desiredText));

        console.error(checks);
        console.error(similarities);

        return similarities.some((similarity) => similarity > 0.7);
    }

    private normalizeText(text: string) {
        const normalizedText = text.replace('\n', ' ').trim();

        if (!normalizedText.includes(' ')) {
            return normalizedText;
        }

        const words = normalizedText.split(' ');

        return words.reduce((longestWord, word) => (word.length > longestWord.length ? word : longestWord), '');
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
}
