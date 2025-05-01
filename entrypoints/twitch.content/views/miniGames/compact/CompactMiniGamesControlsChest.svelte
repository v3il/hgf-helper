<CompactMiniGamesControlsItem
    isGameActive={gameService.isGameActive}
    isTimerVisible={gameService.isRoundRunning}
    isSendEnabled={gameService.isGamePhase}
    timeout={gameService.timeUntilMessage}
    {Icon}
    {name}
    {toggle}
    {participate}
/>

<script lang="ts">
import CompactMiniGamesControlsItem from './CompactMiniGamesControlsItem.svelte';
import { useChestMiniGame } from '../composables';

const {
    Icon,
    name,
    toggle,
    participate,
    gameService
} = useChestMiniGame();
</script>
