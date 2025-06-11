<div class="flex items-center gap-[8px]" title={tooltip}>
    <Icon size="18" class={indicatorClass} />
</div>

<script lang="ts">
import type { Component } from 'svelte';

interface Props {
    Icon: Component,
    isOk: boolean,
    name: string
}

const { Icon, isOk, name }: Props = $props();

const indicatorClass = $derived(isOk ? 'text-green-600 dark:text-green-500 animate-pulse' : 'text-red-600 dark:text-red-500 animate-pulse');
const tooltip = $derived(`${name} is ${isOk ? 'ok' : 'not ok'}`);
</script>
