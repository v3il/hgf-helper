<MiniGamesPanel isRunning={settingsFacade.settings.lootGame} {onCheckboxChange} {participate} Icon={Package} name="Loot">
    {#snippet gameIndicators()}
        {#if gameService.isRoundRunning}
            <MiniGamesTimer timeout={gameService.timeUntilMessage} />
        {/if}
    {/snippet}
</MiniGamesPanel>

<script lang="ts">
import { MiniGamesTimer, MiniGamesPanel } from './basicComponents';
import { Container } from 'typedi';
import { SettingsFacade } from '@shared/modules';
import { LootGameService } from '@twitch/modules/miniGames';
import { onDestroy } from 'svelte';
import { Package } from '@lucide/svelte';

const settingsFacade = Container.get(SettingsFacade);

const gameService = new LootGameService();

function participate() {
    gameService.participate();
}

async function onCheckboxChange(isEnabled: boolean) {
    await settingsFacade.updateSettings({
        lootGame: isEnabled
    });

    if (!isEnabled) {
        gameService.stop();
    }
}

onDestroy(() => {
    gameService.destroy();
})
</script>
