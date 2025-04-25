<MiniGamesCheckBox checked={gameService.isRunning} onchange={onCheckboxChange}>
    <span>Giveaways</span>

    {#if gameService.isRunning}
        <MiniGamesTimer timeout={gameService.timeUntilMessage} class="hgf-ml-4" />
        <MiniGamesText>[{gameService.remainingRounds}/{gameService.totalRounds}]</MiniGamesText>
    {/if}
</MiniGamesCheckBox>

<MiniGamesButton onclick={participate} />

<script lang="ts">
import { MiniGamesCheckBox, MiniGamesButton, MiniGamesTimer, MiniGamesText } from './basicComponents';
import { HitsquadGameService } from '@twitch/modules/miniGames';
import { onDestroy } from 'svelte';

const gameService = new HitsquadGameService();

function participate() {
    gameService.participate();
}

async function onCheckboxChange(event: Event) {
    const checkboxEl = event.target as HTMLInputElement;
    const isEnabled = checkboxEl.checked;

    if (!isEnabled) {
        return gameService.stop();
    }

    const gamesCount = prompt('Enter rounds count', `${HitsquadGameService.HITSQUAD_GAMES_PER_DAY}`);
    const numericGamesCount = Number(gamesCount);

    if (!gamesCount || Number.isNaN(numericGamesCount) || numericGamesCount <= 0) {
        checkboxEl.checked = false;
        return;
    }

    gameService.start(numericGamesCount);
}

onDestroy(() => {
    gameService.destroy();
})
</script>
