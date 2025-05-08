<div
    class:dark={isDarkTheme}
    class="flex flex-row items-center justify-between gap-[24px] w-full bg-white/90 dark:bg-[#18181b]/80 backdrop-blur-sm shadow-sm dark:shadow-lg border border-gray-200 dark:border-[#27272a] rounded-[4px] p-[16px]"
>
    <div class="flex-1">
        <div class="mb-[4px] flex gap-[8px] items-baseline">
            <Logo />
            <h2 class="font-semibold text-gray-800 dark:text-[#d4d4d8] text-xl">HGF-Helper</h2>
        </div>

        <p class="text-gray-600 dark:text-[#71717a] text-[14px]">
            Sign in to unlock all the HGF-Helper functions
        </p>
    </div>

    <AuthButton classes="px-[24px] py-[12px]" />
</div>

<script lang="ts">
import { AuthButton, Logo } from '@shared/components';
import { watchClassOnElement } from '@utils';

let isDarkTheme = $state(false);

watchClassOnElement(document.body, 'dark-theme', (isDark) => {
    isDarkTheme = isDark;
});
</script>
