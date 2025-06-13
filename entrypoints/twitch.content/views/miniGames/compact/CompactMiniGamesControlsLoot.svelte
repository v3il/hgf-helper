<CompactMiniGamesControlsItem
    isGameActive={gameService.isGameActive}
    {isSendEnabled}
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
import { Container } from 'typedi';
import { StreamStatusService } from '@twitch/modules/stream';

const streamStatusService = Container.get(StreamStatusService);

const {
    Icon,
    name,
    toggle,
    participate,
    gameService
} = useLootMiniGame();

const isSendEnabled = $derived(streamStatusService.isMiniGamesAllowed && gameService.isGamePhase);
</script>
