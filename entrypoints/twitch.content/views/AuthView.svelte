<div class="flex flex-row items-center justify-between gap-8 w-full bg-white/90 dark:bg-[#18181b]/80 backdrop-blur-sm shadow-sm dark:shadow-lg border border-gray-200 dark:border-[#27272a] rounded-xl p-8">
    <div class="flex-1">
        <div class="mb-4 flex gap-[8px] items-baseline">
            <Logo />
            <h2 class="font-semibold text-gray-800 dark:text-[#a1a1aa] text-4xl">HGF-Helper</h2>
        </div>

        <p class="text-gray-600 dark:text-[#71717a]">
            Sign in to unlock all the HGF-Helper functions
        </p>
    </div>

    <AuthButton classes="px-6 py-6" />
</div>

<script lang="ts">
import { AuthButton, Logo } from '@shared/components';
</script>

