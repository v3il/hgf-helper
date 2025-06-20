<div class="mb-[24px] border border-gray-400 dark:border-[#27272a] rounded-sm p-[16px] shadow-sm" class:dark={isDarkTheme}>
    <h2 class="font-semibold text-gray-800 dark:text-[#d4d4d8] text-[15px] mb-[8px]">HGF-Helper</h2>

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

const authFacade = Container.get(AuthFacade);

let isDarkTheme = $state(false);

watchClassOnElement(document.body, 'dark-theme', (isDark) => {
    isDarkTheme = isDark;
});
</script>
