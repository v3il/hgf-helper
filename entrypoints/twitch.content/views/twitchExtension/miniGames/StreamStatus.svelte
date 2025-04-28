<div class="flex items-center gap-4 ml-4">
    <div class="flex items-center gap-2">
        <Bot size="16" class="text-[#71717a]" />
        <CircleDot size="12" class="text-green-500 animate-pulse" />
    </div>

    <div class="flex items-center gap-2">
        <Activity size="16" class="text-[#71717a]" />
        <CircleDot size="12" class="text-red-500 animate-pulse" />
    </div>

    <div class="flex items-center gap-2">
        <Shield size="16" class="text-[#71717a]" />
        <CircleDot size="12" class="text-green-500 animate-pulse" />
    </div>
</div>

<script lang="ts">
import { Bot, CircleDot, Activity, Shield } from "@lucide/svelte";
</script>
