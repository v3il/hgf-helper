{formattedTime}

<script lang="ts">
import { Timing } from '@shared/consts';
import { onDestroy } from 'svelte';

interface Props {
    timeout: number;
}

const { timeout }: Props = $props();

let formattedTime = $state('');

const intervalId = window.setInterval(tick, Timing.SECOND);

tick();

function tick() {
    const diff = Math.max(timeout - Date.now(), 0);
    const minutes = Math.floor(diff / Timing.MINUTE).toString().padStart(2, '0');
    const seconds = Math.floor((diff % Timing.MINUTE) / Timing.SECOND).toString().padStart(2, '0');

    formattedTime = `${minutes}:${seconds}`;
}

onDestroy(() => {
    clearInterval(intervalId);
});
</script>
