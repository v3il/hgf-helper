<div class="absolute top-4 right-4 z-50 p-4 bg-black">
    Points: {points.length}

    <select class="bg-white text-black p-2 rounded ml-4" bind:value={preset} onchange={() => onPresetChange(preset)}>
        {#each presets as preset}
            <option value={preset.value}>{preset.label}</option>
        {/each}
    </select>

    {#if activePoint}
        <button class="ml-4 p-2 rounded" onclick={() => onDeleteActivePoint()}>Delete point</button>
    {/if}

    <button class="ml-4 p-2 rounded" onclick={() => onFrameRerender()}>Re-render frame</button>
    <button class="ml-4 p-2 rounded" onclick={printPoints}>Print points</button>
    <button class="ml-4 p-2 rounded" onclick={() => onExit()}>Exit</button>
</div>

<script lang="ts">
import { clearLog, log } from '@utils';
import { type DebugModeCheckPoint, DebugModeCheckPreset } from './types';

interface IProps {
    activePoint: DebugModeCheckPoint | null;
    points: DebugModeCheckPoint[];
    preset: DebugModeCheckPreset;
    onPresetChange: (preset: DebugModeCheckPreset) => void;
    onDeleteActivePoint: () => void;
    onFrameRerender: () => void;
    onExit: () => void;
}

let {
    points,
    activePoint,
    preset,
    onPresetChange,
    onDeleteActivePoint,
    onFrameRerender,
    onExit
}: IProps = $props();

const presets: { label: string, value: DebugModeCheckPreset }[] = [
    { label: 'Anti-Cheat', value: DebugModeCheckPreset.ANTI_CHEAT },
    { label: 'Loot Game (left)', value: DebugModeCheckPreset.LOOT_GAME1 },
    { label: 'Loot Game (right)', value: DebugModeCheckPreset.LOOT_GAME2 },
    { label: 'Chest Game', value: DebugModeCheckPreset.CHEST_GAME },
    { label: 'New', value: DebugModeCheckPreset.BLANK }
];

function printPoints() {
    const formattedPoints = points.map(({ id, ...rest }) => rest);
    clearLog();
    log($state.snapshot(formattedPoints));
}
</script>
