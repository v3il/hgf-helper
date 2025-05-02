<div class="flex flex-row items-center justify-between gap-[24px] w-full bg-[#18181b]/80 backdrop-blur-sm shadow-lg border border-[#27272a] rounded-[4px] p-[16px]">
    <div class="flex-1">
        <div class="mb-[4px] flex gap-[8px] items-baseline">
            <Logo />
            <h2 class="font-semibold text-[#d4d4d8] text-xl">HGF-Helper</h2>
        </div>

        <p class="text-[#a1a1aa] text-[14px]">
            Sign in to unlock all the HGF-Helper functions
        </p>
    </div>

    <AuthButton classes="px-[24px] py-[12px]" />
</div>

<script lang="ts">
    import { AuthButton, Logo } from '@shared/components';
</script>
