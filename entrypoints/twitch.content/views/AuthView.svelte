<div class="flex flex-row items-center justify-between gap-8 w-full bg-[#18181b]/80 backdrop-blur-sm shadow-lg border border-[#27272a] rounded-xl p-8">
    <div class="flex-1">
        <div class="mb-4 flex gap-[8px] items-baseline">
            <Logo />
            <h2 class="font-semibold text-[#d4d4d8] text-4xl">HGF-Helper</h2>
        </div>

        <p class="text-[#a1a1aa]">
            Sign in to unlock all the HGF-Helper functions
        </p>
    </div>

    <AuthButton classes="px-6 py-6" />
</div>

<script lang="ts">
import { AuthButton, Logo } from '@shared/components';
</script>

