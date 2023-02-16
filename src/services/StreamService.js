import html2canvas from "html2canvas";
import { ColorService } from "./ColorService";
import { banPhaseChecks } from "../banPhaseChecks";

export class StreamService {
    #containerEl;
    #playerEl;
    #canvasEl;

    constructor({ containerEl, playerEl }) {
        this.#containerEl = containerEl;
        this.#playerEl = playerEl;

        // this.#listenEvents();
    }

    async isBanPhase() {
        await this.#makeScreenshot();

        const canvas = this.#canvasEl;
        const { width, height } = canvas;

        return banPhaseChecks.every(({ xPercent, yPercent, color }) => {
            const x = Math.floor(xPercent * width / 100)
            const y = Math.floor(yPercent * height / 100)

            const context = canvas.getContext('2d');
            const [r, g, b] = context.getImageData(x, y, 1, 1).data;
            const pixelHexColor = ColorService.rgbToHex(r, g, b);

            return ColorService.getColorsSimilarity(color, pixelHexColor) > 0.85;
        });
    }

    async #makeScreenshot() {
        this.#containerEl.innerHTML = '';

        const canvasEl = await html2canvas(this.#playerEl);

        this.#canvasEl = canvasEl;
        this.#containerEl.appendChild(canvasEl);
    }

    #listenEvents() {
        document.body.addEventListener('click', ({ target }) => {
            const canvasEl = this.#canvasEl;

            function getPosition(element) {
                let left = 0;
                let top = 0;

                if (obj.offsetParent) {
                    do {
                        left += element.offsetLeft;
                        top += element.offsetTop;
                    } while (element = element.offsetParent);

                    return { left, top };
                }

                return { left: 0, top: 0 };
            }

            if (target === canvasEl) {
                const { width, height } = canvasEl;

                const { left, top } = getPosition(canvasEl);
                const x = e.pageX - left;
                const y = e.pageY - top;
                const context = ca.getContext('2d');
                const [r, g, b] = context.getImageData(x, y, 1, 1).data;
                const color = `#${ColorService.rgbToHex(r, g, b)}`;

                console.log({
                    color,
                    xPercent: x / width * 100,
                    yPercent: y / height * 100
                });
            }
        })
    }
}
