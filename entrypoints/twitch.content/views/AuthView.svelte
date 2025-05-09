<div class="flex flex-row items-center justify-between gap-[16px] w-full rounded-xl p-[12px]">
    <div class="flex-1">
        <div class="mb-[4px] flex items-center gap-[12px]">
            <Logo />
            <h2 class="font-semibold text-gray-800 dark:text-[#a1a1aa] text-3xl">HGF-Helper</h2>
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

