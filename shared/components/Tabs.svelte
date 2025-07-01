<div class={[classes]}>
    <div role="tablist" class={['h-10 items-center justify-center rounded-md p-1 grid grid-cols-2 mb-6', tabClasses]}>
        {#each variants as variant}
            <button
                type="button"
                role="tab"
                class="inline-flex items-center justify-center whitespace-nowrap rounded-sm p-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-[#738196] [&.active]:bg-purple-100 [&.active]:text-purple-700 cursor-pointer"
                class:active={isVariantActive(variant)}
                onclick={() => setActiveVariant(variant)}
            >
                {variant.label}
            </button>
        {/each}
    </div>

    {@render content(activeVariant.value)}
</div>

<script lang="ts">
import type { ClassValue } from 'clsx';
import type { Snippet } from 'svelte';

interface TabVariant {
    label: string;
    value: string;
}

interface Props {
    variants: TabVariant[];
    classes?: ClassValue;
    dark?: boolean;
    content: Snippet<[string]>
}

let { variants, classes = '', content, dark = false }: Props = $props();

let activeVariant: TabVariant = $state(variants[0]);
const tabClasses = $derived(dark ? 'bg-[#27272a]' : 'bg-[#F1F5F9]');

function isVariantActive(variant: TabVariant): boolean {
    return activeVariant.value === variant.value;
}

function setActiveVariant(variant: TabVariant): void {
    activeVariant = variant;
}
</script>
