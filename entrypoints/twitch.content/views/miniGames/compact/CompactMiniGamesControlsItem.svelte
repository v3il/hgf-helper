<div class="relative flex items-center justify-center rounded-lg">
    <button
        class="inline-flex items-center justify-center h-[40px] w-[40px] dark:hover:bg-[#27272a]/40 border border-gray-200 dark:border-[#3f3f46]/30 rounded-l-lg p-[8px] transition-all duration-200 group ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:hover:text-accent-foreground"
        title={name}
        onclick={() => toggle(!isGameActive)}
    >
        <Icon size="16" class={toggleIconClasses} />
    </button>

    <button
        class="inline-flex items-center justify-center h-[40px] w-[40px] dark:hover:bg-[#27272a]/40 border border-gray-200 border-l-0 dark:border-[#3f3f46]/30 rounded-r-lg p-[8px] transition-all duration-200 group ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opa1city-50 dark:hover:text-accent-foreground"
        title="Send once"
        tabindex="-1"
        onclick={() => participate()}
        disabled={!isSendEnabled}
    >
        <Send size="14" class={sendIconClasses} />
    </button>

    {#if isTimerVisible}
        <div class="px-[2px] text-[10px] leading-[1] rounded-[2px] border border-[#3f3f46]/30 font-semibold whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 absolute top-[-6px] left-[50%] -translate-x-1/2 flex items-center justify-center bg-white/90 dark:bg-[#18181b]/80 text-[#8456FF] dark:text-[#9b87f5] font-mono">
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

const toggleIconClasses = $derived(isGameActive ? 'text-[#8456FF] dark:text-[#9b87f5] group-hover:text-[#9b87f5]' : 'text-gray-400')
const sendIconClasses = $derived(isSendEnabled ? 'text-green-600 group-hover:text-green-500' : 'text-gray-400')
</script>
