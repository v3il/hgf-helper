<MiniGamesPanel isRunning={gameService.isRunning} {onCheckboxChange} {participate} Icon={Gift} name="Giveaways" {...props}>
    {#snippet gameIndicators()}
        {#if gameService.isRunning}
            <MiniGamesText>
                (<MiniGamesTimer timeout={gameService.timeUntilMessage} />)
            </MiniGamesText>

            <MiniGamesText>[{gameService.remainingRounds}/{gameService.totalRounds}]</MiniGamesText>
        {/if}
    {/snippet}
</MiniGamesPanel>

<script lang="ts">
import { MiniGamesTimer, MiniGamesText, MiniGamesPanel } from './basicComponents';
import { HitsquadGameService } from '@twitch/modules/miniGames';
import { Gift } from '@lucide/svelte'
import { getContext } from 'svelte';

const props = $props();

const gameService = getContext<HitsquadGameService>('hitsquad');

function participate() {
    gameService.participate();
}

function onCheckboxChange(isEnabled: boolean) {
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
