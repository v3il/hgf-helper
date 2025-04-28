<MiniGamesPanel isRunning={settingsFacade.settings.chestGame} {onCheckboxChange} {participate} Icon={PackageOpen} name="Chest">
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
import { ChestGameService } from '@twitch/modules/miniGames';
import { onDestroy } from 'svelte';
import { PackageOpen } from '@lucide/svelte';

const settingsFacade = Container.get(SettingsFacade);

const gameService = new ChestGameService();

function participate() {
    gameService.participate();
}

async function onCheckboxChange(isEnabled: boolean) {
    await settingsFacade.updateSettings({
        chestGame: isEnabled
    });

    if (!isEnabled) {
        gameService.stop();
    }
}

onDestroy(() => {
    gameService.destroy();
});
</script>
