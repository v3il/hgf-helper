<MiniGamesPanel isRunning={gameService.isGameActive} {toggle} {participate} {Icon} {name} {...props}>
    {#snippet gameIndicators()}
        {#if gameService.isRoundRunning}
            <MiniGamesText>
                (<MiniGamesTimer timeout={gameService.timeUntilMessage} />)
            </MiniGamesText>
        {/if}
    {/snippet}
</MiniGamesPanel>

<script lang="ts">
import { MiniGamesTimer, MiniGamesPanel, MiniGamesText } from './basicComponents';
import { useLootMiniGame } from './composables';

const props = $props();
const { toggle, participate, gameService, Icon, name } = useLootMiniGame();
</script>
