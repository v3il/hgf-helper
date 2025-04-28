<div class="hgf-twitch-extension">
    {#if authFacade.isAuthenticated}
        <TwitchWidget />
        <DebugMode />
    {:else}
        <AuthView />
    {/if}
</div>


<script lang="ts">
import { Container } from 'typedi';
import { AuthFacade } from '@shared/modules';
import AuthView from './AuthView.svelte';
import DebugMode from './DebugMode.svelte';
import TwitchWidget from './TwitchWidget.svelte';

const authFacade = Container.get(AuthFacade);
</script>

<style>
.hgf-twitch-extension {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    color: white;
}
</style>
