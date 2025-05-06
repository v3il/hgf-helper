<div class="p-[8px] max-w-[800px] rounded-xl ml-auto mr-auto backdrop-blur-md shadow-lg fixed bottom-4 left-[70px] right-[calc(34rem-15px)] z-50000" class:dark={isDarkTheme}>
    {#if authFacade.isAuthenticated}
        <TwitchWidget />
    {:else}
        <AuthView />
    {/if}
</div>

<script lang="ts">
import { Container } from 'typedi';
import { AuthFacade } from '@shared/modules';
import AuthView from './AuthView.svelte';
import TwitchWidget from './TwitchWidget.svelte';
import { mount } from 'svelte';
import DebugMode from './DebugMode.svelte';
import { watchClassOnElement } from '@utils';

const authFacade = Container.get(AuthFacade);

let isDarkTheme = $state(false);

watchClassOnElement(document.documentElement, 'tw-root--theme-dark', (isDark) => {
    isDarkTheme = isDark;
});

mount(DebugMode, {
    target: document.body
});
</script>
