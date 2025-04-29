<div class="flex items-center gap-2">
    <div class="relative">
        <button
            class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground bg-[#27272a]/20 hover:bg-[#27272a]/40 border border-[#3f3f46]/30 rounded-lg p-[12px] h-auto w-auto transition-all duration-200 group"
            title="Giveaways"
            onclick={onToggle}
        >
            <Icon size="16" class="text-[#9b87f5]"/>
        </button>

        {#if isTimerVisible}
            <div class="rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 absolute -top-[4px] -right-[8px] text-[10px] h-[12px] p-[4px] flex items-center justify-center bg-[#221F26] text-[#9b87f5] border-none font-mono">
                <MiniGamesTimer {timeout}/>
            </div>
        {/if}
    </div>
</div>

<script lang="ts">
import type { Component } from 'svelte';
import { MiniGamesTimer } from '../basicComponents'

interface Props {
    Icon: Component;
    isGameActive: boolean;
    isTimerVisible: boolean;
    timeout: number;
    onToggle: () => void;
}

let { Icon, isTimerVisible, isGameActive, timeout, onToggle }: Props = $props();
</script>
