<MiniGamesControlsItem
    isGameActive={gameService.isGameActive}
    Icon={Boxes}
    command={gameService.command}
    name="Chest"
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
import { ChestGameService } from '@twitch/modules/miniGames';
import { Boxes } from '@lucide/svelte';

const streamStatusService = Container.get(StreamStatusService);
const gameService = getContext<ChestGameService>('chest');

const isSendEnabled = $derived(streamStatusService.isMiniGamesAllowed && gameService.isGamePhase);

const sendCommand = () => gameService.participate();
const toggle = (isEnabled: boolean) => isEnabled ? gameService.start() : gameService.stop();
</script>
