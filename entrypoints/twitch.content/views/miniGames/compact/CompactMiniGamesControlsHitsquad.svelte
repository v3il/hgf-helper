<CompactMiniGamesControlsItem
    isGameActive={gameService.isRunning}
    isSendEnabled
    {Icon}
    {name}
    {toggle}
    {participate}
>
    {#snippet indicators()}
        {#if gameService.isRunning}
            <CompactMiniGamesControlsIndicators>
                <MiniGamesTimer timeout={gameService.timeUntilMessage} />
                |
                {gameService.remainingRounds}/{gameService.totalRounds}
            </CompactMiniGamesControlsIndicators>
        {/if}
    {/snippet}
</CompactMiniGamesControlsItem>

<script lang="ts">
import CompactMiniGamesControlsItem from './CompactMiniGamesControlsItem.svelte';
import { useHitsquadMiniGame } from '../composables';
import CompactMiniGamesControlsIndicators from './CompactMiniGamesControlsIndicators.svelte';
import { MiniGamesTimer } from '../basicComponents';

const {
    Icon,
    name,
    toggle,
    participate,
    gameService
} = useHitsquadMiniGame();
</script>
