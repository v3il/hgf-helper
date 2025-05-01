<MiniGamesPanel isRunning={gameService.isRunning} {toggle} {participate} {Icon} {name} {...props}>
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
import { useHitsquadMiniGame } from '@twitch/views/miniGames/composables';

const props = $props();
const { toggle, participate, gameService, Icon, name } = useHitsquadMiniGame();
</script>
