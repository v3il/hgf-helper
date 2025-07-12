<MiniGamesControlsItem
    isGameActive={gameService.isGameEnabled}
    Icon={Gem}
    command={gameService.command}
    name="Loot"
    {isSendEnabled}
    {toggle}
    {sendCommand}
>
    {#snippet indicators()}
        {#if gameService.isRoundRunning}
            <MiniGamesControlsIndicators>
                <MiniGamesControlsTimer timeout={gameService.timeUntilMessage} />
            </MiniGamesControlsIndicators>
        {/if}
    {/snippet}
</MiniGamesControlsItem>

<script lang="ts">
import MiniGamesControlsItem from './MiniGamesControlsItem.svelte';
import MiniGamesControlsIndicators from './MiniGamesControlsIndicators.svelte';
import MiniGamesControlsTimer from './MiniGamesControlsTimer.svelte';
import { Container } from 'typedi';
import { StreamStatusService } from '@twitch/modules/stream';
import { getContext } from 'svelte';
import { LootGameService } from '@twitch/modules/miniGames';
import { Gem } from '@lucide/svelte';

const streamStatusService = Container.get(StreamStatusService);
const gameService = getContext<LootGameService>('loot');

const isSendEnabled = $derived(streamStatusService.isMiniGamesAllowed && gameService.isGamePhase);

const sendCommand = () => gameService.participate();
const toggle = (isEnabled: boolean) => isEnabled ? gameService.start() : gameService.stop();
</script>
