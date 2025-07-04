<div class={[classes]}>
    <div class="flex items-center justify-between gap-4">
        <div>
            <h3 class="font-medium text-gray-800">
                {title}
            </h3>

            {#if description}
                <p class="text-sm text-gray-500 mt-[2px]">
                    {description}
                </p>
            {/if}
        </div>

        <div class="shrink-0">
            {@render children()}
        </div>
    </div>

    {#if after}
        {@render after()}
    {/if}
</div>

<script lang="ts">
import type { Snippet } from 'svelte';
import type { ClassValue } from 'clsx';

interface Props {
    title: string;
    description?: string;
    children: Snippet;
    after?: Snippet;
    classes?: ClassValue
}

let { title, description, classes = '', children, after }: Props = $props();
</script>
