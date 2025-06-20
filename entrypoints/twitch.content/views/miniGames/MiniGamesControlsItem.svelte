<div class="relative flex items-center justify-center rounded-lg">
    <button
        class="inline-flex items-center justify-center h-[40px] w-[40px] dark:hover:bg-[#27272a]/40 border border-[#adadb86e] dark:border-[#3f3f46]/30 rounded-l-lg p-[8px] transition-all duration-200 group ring-offset-background disabled:pointer-events-none disabled:opacity-50 dark:hover:text-accent-foreground"
        title={name}
        onclick={() => toggle(!isGameActive)}
    >
        <Icon size="16" class={toggleIconClasses} />
    </button>

    <div title={sendButtonTooltip}>
        <button
            class="inline-flex items-center justify-center h-[40px] w-[40px] dark:hover:bg-[#27272a]/40 border border-[#adadb86e] border-l-0 dark:border-[#3f3f46]/30 rounded-r-lg p-[8px] transition-all duration-200 group ring-offset-background disabled:pointer-events-none disabled:opa1city-50 dark:hover:text-accent-foreground"
            tabindex="-1"
            onclick={() => participate()}
            disabled={!isSendEnabled}
        >
            <Send size="14" class={sendIconClasses} />
        </button>
    </div>

    {@render indicators?.()}
</div>

<script lang="ts">
import type { Component, Snippet } from 'svelte';
import { Send } from '@lucide/svelte';
import { Container } from 'typedi';
import { StreamStatusService } from '@twitch/modules/stream';

interface Props {
    Icon: Component;
    isSendEnabled: boolean;
    isGameActive: boolean;
    name: string;
    toggle: (isChecked: boolean) => void;
    participate: () => void;
    indicators?: Snippet
}

const streamStatusService = Container.get(StreamStatusService);

let { Icon, isGameActive, isSendEnabled, name, toggle, participate, indicators }: Props = $props();

const toggleIconClasses = $derived(isGameActive ? 'text-[#8456FF] dark:text-[#9b87f5] group-hover:text-[#9b87f5]' : 'text-[#53535f]');
const sendIconClasses = $derived(isSendEnabled ? 'text-green-600 dark:text-green-500 group-hover:text-green-600' : 'text-[#53535f]');

const sendButtonTooltip = $derived.by(() => {
    if (streamStatusService.isAntiCheat) {
        return 'Anti-cheat is active. Mini-game commands are disabled';
    }

    if (streamStatusService.isVideoBroken) {
        return 'Stream is broken. Mini-game commands are disabled';
    }

    if (isSendEnabled) {
        return 'Send';
    }

    return 'Mini-game is not active';
})
</script>
