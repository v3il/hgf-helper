<div class="p-[16px]" class:dark={isDarkTheme}>
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

const authFacade = Container.get(AuthFacade);

let isDarkTheme = $state(document.documentElement.classList.contains('tw-root--theme-dark'));

document.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement;

    if (target.closest('[data-a-target="dark-mode-toggle"]')) {
        isDarkTheme = target.checked;
    }
});

mount(DebugMode, {
    target: document.body
});
</script>
