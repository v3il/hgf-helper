<CompactMiniGamesControlsItem
    isGameActive={gameService.isGameActive}
    isSendEnabled={gameService.isGamePhase}
    {Icon}
    {name}
    {toggle}
    {participate}
>
    {#snippet indicators()}
        {#if gameService.isRoundRunning}
            <CompactMiniGamesControlsIndicators>
                <MiniGamesTimer timeout={gameService.timeUntilMessage} />
            </CompactMiniGamesControlsIndicators>
        {/if}
    {/snippet}
</CompactMiniGamesControlsItem>

<script lang="ts">
import CompactMiniGamesControlsItem from './CompactMiniGamesControlsItem.svelte';
import { useLootMiniGame } from '../composables';
import CompactMiniGamesControlsIndicators from './CompactMiniGamesControlsIndicators.svelte';
import { MiniGamesTimer } from '../basicComponents';

const {
    Icon,
    name,
    toggle,
    participate,
    gameService
} = useLootMiniGame();
</script>
