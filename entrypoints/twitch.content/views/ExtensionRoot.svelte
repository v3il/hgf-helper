<div class="p-[16px]">
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

mount(DebugMode, {
    target: document.body
});
</script>
