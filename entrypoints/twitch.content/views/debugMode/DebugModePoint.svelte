<button
    class="hgf-point"
    aria-label="Point"
    style:width={width}
    style:height={height}
    style:top={top}
    style:left={left}
    class:active={isActive}
    onclick={() => onToggle(point)}
></button>

<script lang="ts">
import type { DebugModeCheckPoint } from './types';

interface IProps {
    isActive: boolean;
    point: DebugModeCheckPoint;
    onToggle: (point: DebugModeCheckPoint) => void;
}

const SIZE = 20;
const { point, isActive, onToggle }: IProps = $props();

const width = $derived(`${SIZE}px`);
const height = $derived(`${SIZE}px`);
const left = $derived(`calc(${point.xPercent}% - ${SIZE / 2}px)`);
const top = $derived(`calc(${point.yPercent}% - ${SIZE / 2}px)`);
</script>

<style>
.hgf-point {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    border-radius: 50%;
    border: 2px solid black;

    &:focus {
        outline: none;
    }
}

.hgf-point.active:before {
    content: '';
    display: block;
    width: 4px;
    height: 4px;
    background: black;
    border-radius: 50%;
}
</style>
