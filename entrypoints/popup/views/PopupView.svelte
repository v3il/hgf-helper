<header class='uk-flex uk-flex-middle uk-flex-between hgf-mb-16 hgf-ph-16 hgf-pt-16'>
    <h1 class="hgf-popup-title">HGF-Helper</h1>

    {#if authFacade.isAuthenticated}
        <button class="uk-button uk-button-small uk-button-link hgf-color-red" onclick={() => authFacade.logout()}>
            Logout
        </button>
    {/if}
</header>

<main>
    {#if authFacade.isAuthenticated}
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

const authFacade = Container.get(AuthFacade);
</script>

<style>
.hgf-popup-title {
    font-size: 18px;
    margin-bottom: 0;
    font-weight: bold;
}
</style>
