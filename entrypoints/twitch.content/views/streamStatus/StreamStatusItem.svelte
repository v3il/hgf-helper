<div title={tooltip}>
    <Icon size="18" class={indicatorClass} />
</div>

<script lang="ts">
import type { Component } from 'svelte';

interface Props {
    Icon: Component,
    isOk: boolean,
    tooltip: string
}

const { Icon, isOk, tooltip }: Props = $props();

const indicatorClass = $derived(isOk ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400');
</script>
