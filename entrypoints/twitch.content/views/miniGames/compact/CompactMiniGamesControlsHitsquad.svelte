<CompactMiniGamesControlsItem
    isGameActive={gameService.isRunning}
    isSendEnabled={streamStatusService.isMiniGamesAllowed}
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
import { Container } from 'typedi';
import { StreamStatusService } from '@twitch/modules/stream';

const streamStatusService = Container.get(StreamStatusService);

const {
    Icon,
    name,
    toggle,
    participate,
    gameService
} = useHitsquadMiniGame();
</script>
