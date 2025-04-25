<div class="hgf-twitch-extension">
    {#if authFacade.isAuthenticated}
        <MiniGamesControls />
    {:else}
        <AuthView />
    {/if}
</div>


<script lang="ts">
import { Container } from 'typedi';
import { AuthFacade } from '@shared/modules';
import AuthView from './AuthView.svelte';
import { MiniGamesControls } from './twitchExtension/miniGames';

const authFacade = Container.get(AuthFacade);
</script>

<style>
.hgf-twitch-extension {
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    height: 50px;
    z-index: 100000;
    background: #121212;
    padding: 16px;
    color: white;
    border: 3px solid lightgreen;
}
</style>
