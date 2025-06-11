<div class="max-w-[600px] rounded-xl ml-auto mr-auto fixed z-9999999 bg-[#f7f7f8] dark:bg-[#18181b] border hgf-extension-root" class:dark={isDarkTheme}>
    {#if authFacade.isAuthenticated}
        <TwitchWidget />
    {:else}
        <AuthView />
    {/if}
</div>

{#if authFacade.isAuthenticated}
    <DebugMode />
{/if}

<script lang="ts">
import { Container } from 'typedi';
import { AuthFacade } from '@shared/modules';
import AuthView from './AuthView.svelte';
import TwitchWidget from './TwitchWidget.svelte';
import DebugMode from './DebugMode.svelte';
import { watchClassOnElement } from '@utils';

const authFacade = Container.get(AuthFacade);

let isDarkTheme = $state(false);

watchClassOnElement(document.documentElement, 'tw-root--theme-dark', (isDark) => {
    isDarkTheme = isDark;
});
</script>

<style>
.hgf-extension-root {
    right: calc(34rem + 20px);
    left: 70px;
    bottom: 16px;
    border-color: lightgreen;
    box-shadow: 0 0 6px lightgreen, 0 0 12px #757e8a66;
}

@media (max-width: 920px) {
    .hgf-extension-root {
        right: 20px !important;
    }
}
</style>
