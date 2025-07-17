<MiniGamesControlsItem
    isGameActive={gameService.isGameRunning}
    isSendEnabled={streamStatusService.isMiniGamesAllowed}
    Icon={Gift}
    command={gameService.command}
    name="Giveaways"
    {toggle}
    {sendCommand}
>
    {#snippet indicators()}
        {#if gameService.isGameRunning}
            <MiniGamesControlsIndicators>
                <MiniGamesControlsTimer timeout={gameService.timeUntilMessage} />
                |
                {gameService.remainingRounds}/{gameService.totalRounds}
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
import { HitsquadGameService } from '@twitch/modules/miniGames';
import { Gift } from '@lucide/svelte';

const streamStatusService = Container.get(StreamStatusService);
const gameService = getContext<HitsquadGameService>('hitsquad');

const sendCommand = () => gameService.sendCommand();

function toggle(isEnabled: boolean) {
    if (!isEnabled) {
        return gameService.stop();
    }

    const gamesCount = prompt('Enter rounds count', `${HitsquadGameService.HITSQUAD_GAMES_PER_DAY}`);
    const numericGamesCount = Number(gamesCount);

    if (!gamesCount || Number.isNaN(numericGamesCount) || numericGamesCount <= 0) {
        return;
    }

    gameService.start(numericGamesCount);
}
</script>
