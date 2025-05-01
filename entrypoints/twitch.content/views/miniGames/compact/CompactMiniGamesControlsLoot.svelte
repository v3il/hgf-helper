<CompactMiniGamesControlsItem
    isGameActive={gameService.isGameActive}
    isTimerVisible={gameService.isRoundRunning}
    timeout={gameService.timeUntilMessage}
    {Icon}
    {name}
    {toggle}
    {participate}
/>

<script lang="ts">
import CompactMiniGamesControlsItem from './CompactMiniGamesControlsItem.svelte';
import { useLootMiniGame } from '../composables';

const {
    Icon,
    name,
    toggle,
    participate,
    gameService
} = useLootMiniGame();
</script>
