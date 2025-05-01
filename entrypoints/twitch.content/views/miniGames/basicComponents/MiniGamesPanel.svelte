<div class={classes}>
    <div class="flex items-center gap-[12px]">
        <Icon size="20" class="text-[#9b87f5]" />
        <h4 class="font-semibold text-[#a1a1aa] text-[16px]">{name}</h4>

        {@render gameIndicators()}
    </div>

    <div class="flex items-center gap-[16px]">
        <Switch isChecked={isRunning} onChange={toggle} />

        <div class="shrink-0 w-[1px] h-[32px] ml-[8px] bg-[#27272a]"></div>

        <button
            onclick={participate}
            disabled={!isSendEnabled}
            class="inline-flex items-center justify-center gap-[8px] whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-[40px] px-[16px] py-[8px] uppercase text-[#a1a1aa] hover:bg-[#27272a]/50 hover:text-[#d4d4d8] text-[14px]"
        >
            <Send size="16" class={sendIconClasses} />
            SEND
        </button>
    </div>
</div>

<script lang="ts">
import { Switch } from '@shared/components';
import type { Component, Snippet } from 'svelte';
import clsx from 'clsx';
import { Send } from '@lucide/svelte';

interface Props {
    isRunning: boolean;
    isSendEnabled: boolean;
    name: string;
    toggle: (isChecked: boolean) => void;
    participate: () => void;
    gameIndicators: Snippet;
    Icon: Component;
    class?: string;
}

let { gameIndicators, Icon, toggle, participate, isRunning, isSendEnabled, name, ...rest }: Props = $props();

const classes = $derived(
    clsx([
        'w-full bg-[#18181b]/80 backdrop-blur-sm shadow-lg space-x-4 flex items-center justify-between px-[16px] py-[4px]',
        rest.class ?? ''
    ])
);

const sendIconClasses = $derived(isSendEnabled ? 'text-green-500' : 'text-[#71717a]')
</script>
