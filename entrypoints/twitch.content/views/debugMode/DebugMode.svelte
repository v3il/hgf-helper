<div class="fixed inset-0 bg-[rgba(0,0,0,0.8)] z-[99999999] hidden [&.visible]:flex [&.visible]:items-center [&.visible]:justify-center" class:visible={isVisible}>
    <DebugModeMenu
        {activePoint}
        {points}
        {preset}
        onPresetChange={changePreset}
        onDeleteActivePoint={deleteActivePoint}
        onFrameRerender={renderVideoFrame}
        onExit={exit}
    />

    <DebugModeFrame
        bind:this={debugModeFrameRef}
        {activePoint}
        {points}
        {onPointToggle}
        {onPointAdd}
    />
</div>

<script lang="ts">
import { antiCheatChecks, chestGameChecks, lootGameChecks, type ICheckPoint } from '@twitch/modules/stream';
import { DebugModeCheckPreset, type DebugModeCheckPoint } from './types';
import DebugModeMenu from './DebugModeMenu.svelte';
import DebugModeFrame from './DebugModeFrame.svelte';

let debugModeFrameRef: DebugModeFrame;
let isVisible = $state(false);
let preset = $state(DebugModeCheckPreset.ANTI_CHEAT);
let points = $state<DebugModeCheckPoint[]>([]);
let activePoint = $state<DebugModeCheckPoint | null>(null);

function changePreset(preset: DebugModeCheckPreset) {
    const draftPoints: ICheckPoint[] = {
        [DebugModeCheckPreset.ANTI_CHEAT]: antiCheatChecks,
        [DebugModeCheckPreset.LOOT_GAME1]: lootGameChecks[0],
        [DebugModeCheckPreset.LOOT_GAME2]: lootGameChecks[1],
        [DebugModeCheckPreset.CHEST_GAME]: chestGameChecks,
        [DebugModeCheckPreset.BLANK]: []
    }[preset];

    points = draftPoints.map((point) => ({
        ...point,
        id: Math.random()
    }));

    activePoint = points[0] ?? null;
}

function onPointToggle(point: DebugModeCheckPoint) {
    if (activePoint?.id === point.id) {
        activePoint = null;
    } else {
        activePoint = point;
    }
}

function deleteActivePoint() {
    if (!confirm('Are you sure you want to delete this point?')) {
        return;
    }

    points = points.filter(point => point.id !== activePoint!.id);
    activePoint = points[0] ?? null;
}

function exit() {
    isVisible = false;
    points = [];
    activePoint = null;
}

function renderVideoFrame() {
    debugModeFrameRef.renderVideoFrame();
}

function onPointAdd(point: DebugModeCheckPoint) {
    points = [...points, point];
    activePoint = point;
}

function keydownHandler(event: KeyboardEvent) {
    if (event.key === '0' && event.ctrlKey) {
        isVisible = !isVisible;

        if (isVisible) {
            renderVideoFrame();
            changePreset(preset);
        } else {
            exit();
        }
    }

    if (event.key === 'Delete' && activePoint) {
        deleteActivePoint();
    }
}

document.addEventListener('keydown', keydownHandler);

onDestroy(() => {
    document.removeEventListener('keydown', keydownHandler);
});
</script>
