<MiniGamesPanel isRunning={gameService.isRunning} {onCheckboxChange} {participate} Icon={Gift} name="Giveaways">
    {#snippet gameIndicators()}
        {#if gameService.isRunning}
            <MiniGamesTimer timeout={gameService.timeUntilMessage} />
            <MiniGamesText>[{gameService.remainingRounds}/{gameService.totalRounds}]</MiniGamesText>
        {/if}
    {/snippet}
</MiniGamesPanel>

<script lang="ts">
import { MiniGamesTimer, MiniGamesText, MiniGamesPanel } from './basicComponents';
import { HitsquadGameService } from '@twitch/modules/miniGames';
import { Gift } from '@lucide/svelte'
import { onDestroy } from 'svelte';

const gameService = new HitsquadGameService();

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

onDestroy(() => {
    gameService.destroy();
});
</script>
