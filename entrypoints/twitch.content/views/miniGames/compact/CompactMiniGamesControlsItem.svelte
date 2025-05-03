<div class="relative flex items-center justify-center bg-[#27272a]/20 rounded-lg">
    <button
        class="inline-flex items-center justify-center h-[40px] w-[40px] bg-[#27272a]/20 hover:bg-[#27272a]/40 border border-[#3f3f46]/30 rounded-l-lg p-[8px] transition-all duration-200 group ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground"
        title={name}
        onclick={() => toggle(!isGameActive)}
    >
        <Icon size="16" class={toggleIconClasses} />
    </button>

    <button
        class="inline-flex items-center justify-center h-[40px] w-[40px] bg-[#27272a]/20 hover:bg-[#27272a]/40 border border-[#3f3f46]/30 border-l-0 rounded-r-lg p-[8px] transition-all duration-200 group ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground"
        title="Send once"
        tabindex="-1"
        onclick={() => participate()}
        disabled={!isSendEnabled}
    >
        <Send size="14" class={sendIconClasses} />
    </button>

    {#if isTimerVisible}
        <div class="rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 absolute -top-[4px] -left-[8px] text-[9px] py-[2px] px-[4px] flex items-center justify-center bg-[#221F26] text-[#9b87f5] border-none font-mono">
            <MiniGamesTimer {timeout} />
        </div>
    {/if}
</div>

<script lang="ts">
import type { Component } from 'svelte';
import { MiniGamesTimer } from '../basicComponents';
import { Send } from '@lucide/svelte';

interface Props {
    Icon: Component;
    isSendEnabled: boolean;
    isGameActive: boolean;
    isTimerVisible: boolean;
    timeout: number;
    name: string;
    toggle: (isChecked: boolean) => void;
    participate: () => void;
}

let { Icon, isTimerVisible, isGameActive, isSendEnabled, timeout, name, toggle, participate }: Props = $props();

const toggleIconClasses = $derived(isGameActive ? 'text-[#9b87f5] group-hover:text-[#a89af8]' : 'text-[#71717a] group-hover:text-[#a1a1aa]')
const sendIconClasses = $derived(isSendEnabled ? 'text-green-500' : 'text-[#71717a]')
</script>
