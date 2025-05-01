<CompactMiniGamesControlsItem
    isGameActive={gameService.isRunning}
    isTimerVisible={gameService.isRunning}
    isSendEnabled
    timeout={gameService.timeUntilMessage}
    {Icon}
    {name}
    {toggle}
    {participate}
/>

<script lang="ts">
import CompactMiniGamesControlsItem from './CompactMiniGamesControlsItem.svelte';
import { useHitsquadMiniGame } from '../composables';

const {
    Icon,
    name,
    toggle,
    participate,
    gameService
} = useHitsquadMiniGame();
</script>
