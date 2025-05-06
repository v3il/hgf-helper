<div class="flex items-center justify-center p-[2px] text-[10px] leading-[1] rounded-[2px] border border-[#3f3f46]/30 font-semibold whitespace-nowrap transition-colors absolute top-[-8px] left-[50%] -translate-x-1/2 bg-white/90 dark:bg-[#18181b]/80 text-[#8456FF] dark:text-[#9b87f5] font-mono">
    {@render children()}
</div>

<script lang="ts">
import type { Snippet } from 'svelte';

interface Props {
    children: Snippet
}

let { children }: Props = $props();
</script>
