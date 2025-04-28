<div class="hgf-debug-view" class:visible={isVisible}>
    <canvas bind:this={canvasRef} onclick={clickHandler}></canvas>
</div>

<script lang="ts">
import { Container } from 'typedi';
import { TwitchUIService } from '@twitch/modules';
import { ColorService } from '@shared/services';
import { log } from '@utils';

interface IDebugModeCheck {
    color: string;
    xPercent: number;
    yPercent: number;
}

const twitchUIService = Container.get(TwitchUIService);
const colorService = Container.get(ColorService);

let canvasRef: HTMLCanvasElement;
let isVisible = $state(false);
let checks = $state<IDebugModeCheck[]>([]);

function renderVideoFrame() {
    const videoEl = twitchUIService.activeVideoEl;

    if (!videoEl) {
        return;
    }

    canvasRef.width = videoEl.clientWidth;
    canvasRef.height = videoEl.clientHeight;

    const ctx = canvasRef.getContext('2d')!;

    ctx.drawImage(videoEl, 0, 0, canvasRef.width, canvasRef.height);
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

<style>
.hgf-debug-view * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.hgf-debug-view {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: none;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 99999999;
}

.hgf-debug-view.visible {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
