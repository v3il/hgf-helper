<MiniGamesControlsItem
    isGameActive={gameService.isRunning}
    isSendEnabled={streamStatusService.isMiniGamesAllowed}
    Icon={Gift}
    name="Giveaways"
    {toggle}
    {participate}
>
    {#snippet indicators()}
        {#if gameService.isRunning}
            <MiniGamesControlsIndicators>
                <MiniGamesTimer timeout={gameService.timeUntilMessage} />
                |
                {gameService.remainingRounds}/{gameService.totalRounds}
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
import { HitsquadGameService } from '@twitch/modules/miniGames';
import { Gift } from '@lucide/svelte';

const streamStatusService = Container.get(StreamStatusService);
const gameService = getContext<HitsquadGameService>('hitsquad');

function participate() {
    gameService.participate();
}

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
