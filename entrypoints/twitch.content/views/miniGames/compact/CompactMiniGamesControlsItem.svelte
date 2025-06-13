<div class="relative flex items-center justify-center rounded-lg">
    <button
        class="inline-flex items-center justify-center h-[40px] w-[40px] dark:hover:bg-[#27272a]/40 border border-[#c8ccd1] dark:border-[#3f3f46]/30 rounded-l-lg p-[8px] transition-all duration-200 group ring-offset-background disabled:pointer-events-none disabled:opacity-50 dark:hover:text-accent-foreground"
        title={name}
        onclick={() => toggle(!isGameActive)}
    >
        <Icon size="16" class={toggleIconClasses} />
    </button>

    <button
        class="inline-flex items-center justify-center h-[40px] w-[40px] dark:hover:bg-[#27272a]/40 border border-[#c8ccd1] border-l-0 dark:border-[#3f3f46]/30 rounded-r-lg p-[8px] transition-all duration-200 group ring-offset-background disabled:pointer-events-none disabled:opa1city-50 dark:hover:text-accent-foreground"
        title="Send once"
        tabindex="-1"
        onclick={() => participate()}
        disabled={!isSendEnabled}
    >
        <Send size="14" class={sendIconClasses} />
    </button>

    {@render indicators?.()}
</div>

<script lang="ts">
import type { Component, Snippet } from 'svelte';
import { Send } from '@lucide/svelte';

interface Props {
    Icon: Component;
    isSendEnabled: boolean;
    isGameActive: boolean;
    name: string;
    toggle: (isChecked: boolean) => void;
    participate: () => void;
    indicators?: Snippet
}

let { Icon, isGameActive, isSendEnabled, name, toggle, participate, indicators }: Props = $props();

const toggleIconClasses = $derived(isGameActive ? 'text-[#8456FF] dark:text-[#9b87f5] group-hover:text-[#9b87f5]' : 'text-gray-400')
const sendIconClasses = $derived(isSendEnabled ? 'text-green-600 dark:text-green-500 group-hover:text-green-600' : 'text-gray-400')
</script>
