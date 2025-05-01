<div class="fixed inset-0 bg-[rgba(0,0,0,0.8)] z-[99999999] hidden [&.visible]:flex [&.visible]:items-center [&.visible]:justify-center" class:visible={isVisible}>
    <canvas bind:this={canvasRef} onclick={clickHandler}></canvas>
</div>

<script lang="ts">
import { Container } from 'typedi';
import { ColorService } from '@shared/services';
import { log } from '@utils';
import { OffscreenStreamRenderer } from '@twitch/modules/stream';

interface IDebugModeCheck {
    color: string;
    xPercent: number;
    yPercent: number;
}

const offscreenStreamRenderer = Container.get(OffscreenStreamRenderer);
const colorService = Container.get(ColorService);

let canvasRef: HTMLCanvasElement;
let isVisible = $state(false);
let checks = $state<IDebugModeCheck[]>([]);

function renderVideoFrame() {
    const { width, height } = offscreenStreamRenderer.getSize();
    const imageData = offscreenStreamRenderer.getFullScreenImageData();

    canvasRef.width = width;
    canvasRef.height = height;
    canvasRef.getContext('2d')!.putImageData(imageData, 0, 0);
}

function clickHandler({ pageX, pageY }: MouseEvent) {
    const x = pageX - canvasRef.offsetLeft;
    const y = pageY - canvasRef.offsetTop;

    const context = canvasRef.getContext('2d')!;
    const [r, g, b] = context.getImageData(x, y, 1, 1).data;
    const color = colorService.rgbToHex(r, g, b);

    checks = [...checks, {
        color,
        xPercent: (x / canvasRef.width) * 100,
        yPercent: (y / canvasRef.height) * 100
    }];
}

function keydownHandler(event: KeyboardEvent) {
    if (event.key === '0' && event.ctrlKey) {
        isVisible = !isVisible;

        if (isVisible) {
            renderVideoFrame();
        } else if (checks.length) {
            log($state.snapshot(checks));
            checks = [];
        }
    }
}

document.addEventListener('keydown', keydownHandler);

onDestroy(() => {
    document.removeEventListener('keydown', keydownHandler);
});
</script>
