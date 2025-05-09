<header class="flex items-center justify-between w-full mb-6">
    <h2 class="flex items-center gap-2">
        <Logo />
        <span class="font-semibold text-2xl">HGF-Helper</span>
    </h2>

    {#if authFacade.isAuthenticated}
        <button
            class="cursor-pointer transition-colors text-red-500 hover:text-red-400"
            onclick={() => authFacade.logout()}
            title="Logout"
        >
            <LogOut size="16" />
        </button>
    {/if}
</header>

<main class="w-full">
    {#if isLoading }
        <PopupLoading />
    {:else if authFacade.isAuthenticated}
        <SettingsEditorView />
    {:else}
        <AuthView />
    {/if}
</main>

<script lang="ts">
import { Container } from 'typedi';
import { AuthFacade } from '@shared/modules';
import AuthView from './AuthView.svelte';
import SettingsEditorView from './SettingsEditorView.svelte';
import PopupLoading from './PopupLoading.svelte';
import { Logo } from '@shared/components';
import { LogOut } from '@lucide/svelte';

let isLoading = $state(true);

const authFacade = Container.get(AuthFacade);

authFacade.auth()
    .catch((error) => console.error('Error during authentication:', error))
    .finally(() => {
        isLoading = false;
    });
</script>
