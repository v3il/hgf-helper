<div class="relative">
    <canvas bind:this={canvasRef} onclick={clickHandler}></canvas>

    {#each points as point}
        <DebugModePoint {point} isActive={isPointActive(point)} onToggle={onPointToggle} />
    {/each}
</div>

<script lang="ts">
import { Container } from 'typedi';
import { OffscreenStreamRenderer } from '@twitch/modules/stream';
import { DebugModeCheckPoint } from './types';
import DebugModePoint from './DebugModePoint.svelte';

interface IProps {
    activePoint: DebugModeCheckPoint | null;
    points: DebugModeCheckPoint[];
    onPointToggle: (point: DebugModeCheckPoint) => void;
    onPointAdd: (point: DebugModeCheckPoint) => void;
}

const { points, activePoint, onPointToggle, onPointAdd }: IProps = $props();

const offscreenStreamRenderer = Container.get(OffscreenStreamRenderer);

let canvasRef: HTMLCanvasElement;

function isPointActive(point: DebugModeCheckPoint) {
    return activePoint ? activePoint.id === point.id : false;
}

function renderVideoFrame() {
    const { width, height } = offscreenStreamRenderer.getSize();
    const imageData = offscreenStreamRenderer.getFullScreenImageData();

    canvasRef.width = width;
    canvasRef.height = height;
    canvasRef.getContext('2d')!.putImageData(imageData, 0, 0);
}

function clickHandler({ pageX, pageY }: MouseEvent) {
    const bounds = canvasRef.getBoundingClientRect();
    const x = pageX - bounds.x;
    const y = pageY - bounds.y;
    const color = offscreenStreamRenderer.getColorAtPoint(x, y);

    const newPoint: DebugModeCheckPoint = {
        color,
        id: Math.random(),
        xPercent: (x / canvasRef.width) * 100,
        yPercent: (y / canvasRef.height) * 100
    };

    onPointAdd(newPoint);
}

onMount(() => {
    renderVideoFrame();
});

export { renderVideoFrame };
</script>
