<div class="w-full bg-[#18181b]/80 backdrop-blur-sm shadow-lg space-x-4 flex items-center justify-between border-x-0 border-t-0 border-b border-[#27272a] px-[16px] py-[8px]">
    <div class="flex items-center gap-3">
        <Icon size="20" class="text-[#9b87f5]" />
        <h4 class="font-semibold text-[#a1a1aa] text-[16px]">{name}</h4>

        {@render gameIndicators()}
    </div>

    <div class="flex items-center gap-4">
        <Switch isChecked={isRunning} onChange={onCheckboxChange} />

        <div class="shrink-0 w-[1px] h-[32px] ml-[8px] bg-[#27272a]"></div>

        <button
            onclick={participate}
            class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-[40px] px-[16px] py-[8px] uppercase text-[#a1a1aa] hover:bg-[#27272a]/50 hover:text-[#d4d4d8] text-[14px]"
        >
            SEND
        </button>
    </div>
</div>

<script lang="ts">
import { Switch } from '@shared/components';
import type { Component, Snippet } from 'svelte';

interface Props {
    isRunning: boolean;
    name: string;
    onCheckboxChange: (isChecked: boolean) => void;
    participate: () => void;
    gameIndicators: Snippet;
    Icon: Component;
}

let { gameIndicators, Icon, onCheckboxChange, participate, isRunning, name }: Props = $props();
</script>
