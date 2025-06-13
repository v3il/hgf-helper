<MiniGamesControlsItem
    isGameActive={gameService.isGameActive}
    Icon={Boxes}
    name="Chest"
    {isSendEnabled}
    {toggle}
    {participate}
>
    {#snippet indicators()}
        {#if gameService.isRoundRunning}
            <MiniGamesControlsIndicators>
                <MiniGamesTimer timeout={gameService.timeUntilMessage} />
            </MiniGamesControlsIndicators>
        {/if}
    {/snippet}
</MiniGamesControlsItem>

<script lang="ts">
import MiniGamesControlsItem from './MiniGamesControlsItem.svelte';
import MiniGamesControlsIndicators from './MiniGamesControlsIndicators.svelte';
import MiniGamesTimer from './MiniGamesTimer.svelte';
import { Container } from 'typedi';
import { StreamStatusService } from '@twitch/modules/stream';
import { getContext } from 'svelte';
import { ChestGameService } from '@twitch/modules/miniGames';
import { Boxes } from '@lucide/svelte';

const streamStatusService = Container.get(StreamStatusService);
const gameService = getContext<ChestGameService>('chest');

const isSendEnabled = $derived(streamStatusService.isMiniGamesAllowed && gameService.isGamePhase);

function participate() {
    gameService.participate();
}

function toggle(isEnabled: boolean) {
    isEnabled ? gameService.start() : gameService.stop();
}
</script>
