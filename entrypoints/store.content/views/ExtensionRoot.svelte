<div class="mb-[24px] border border-gray-400 dark:border-[#27272a] rounded-sm p-[16px] shadow-sm" class:dark={isDarkTheme}>
    <div class="mb-[16px] flex gap-[8px] items-baseline justify-center">
        <Logo />
        <h2 class="font-semibold text-gray-800 dark:text-[#d4d4d8] text-xl">HGF-Helper</h2>
    </div>

    {#if authFacade.isAuthenticated}
        <StoreWidget />
    {:else}
        <Auth />
    {/if}
</div>

<script lang="ts">
import { Container } from 'typedi';
import { AuthFacade } from '@shared/modules';
import Auth from './Auth.svelte';
import StoreWidget from './StoreWidget.svelte';
import { watchClassOnElement } from '@utils';
import { Logo } from '@shared/components';

const authFacade = Container.get(AuthFacade);

let isDarkTheme = $state(false);

watchClassOnElement(document.body, 'dark-theme', (isDark) => {
    isDarkTheme = isDark;
});
</script>
