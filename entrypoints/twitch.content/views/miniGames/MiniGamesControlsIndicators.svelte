<div class="flex items-center justify-center p-[2px] text-[11px] leading-[1] rounded-[2px] border border-[#adadb86e] dark:border-[#3f3f46]/30 whitespace-nowrap transition-colors absolute top-[-8px] left-[50%] -translate-x-1/2 bg-white/90 dark:bg-[#18181b]/80 text-[#0e0e10] dark:text-white font-mono">
    {@render children()}
</div>

<script lang="ts">
import type { Snippet } from 'svelte';

interface Props {
    children: Snippet
}

let { children }: Props = $props();
</script>
