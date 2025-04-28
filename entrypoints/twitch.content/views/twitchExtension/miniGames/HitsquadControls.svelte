<div class="w-full bg-[#18181b]/80 backdrop-blur-sm shadow-lg space-x-4 flex items-center justify-between border-x-0 border-t-0 border-b border-[#27272a] px-[16px] py-[8px]">
    <div class="flex flex-col gap-1">
        <div class="flex items-center gap-3">
            <Gift size="20" class="text-[#9b87f5]" />

            <h4 class="font-semibold text-[#a1a1aa] text-[16px]">Giveaways</h4>

            {#if gameService.isRunning}
                <MiniGamesTimer timeout={gameService.timeUntilMessage} />
                <MiniGamesText>[{gameService.remainingRounds}/{gameService.totalRounds}]</MiniGamesText>
            {/if}
        </div>
    </div>

    <div class="flex items-center gap-4">
        <Switch isChecked={gameService.isRunning} onChange={onCheckboxChange} />

        <MiniGamesSeparator />

        <button
            onclick={participate}
            class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-[40px] px-[16px] py-[8px] uppercase text-[#a1a1aa] hover:bg-[#27272a]/50 hover:text-[#d4d4d8] text-[14px]"
        >
            SEND
        </button>
    </div>
</div>

<script lang="ts">
import { MiniGamesCheckBox, MiniGamesButton, MiniGamesTimer, MiniGamesText, MiniGamesSeparator } from './basicComponents';
import { HitsquadGameService } from '@twitch/modules/miniGames';
import { Gift } from '@lucide/svelte'
import { onDestroy } from 'svelte';
import { Switch } from '@shared/components';

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
