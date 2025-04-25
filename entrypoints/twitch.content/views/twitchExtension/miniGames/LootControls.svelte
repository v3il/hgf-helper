<MiniGamesCheckBox checked={settingsFacade.settings.lootGame} onchange={onLootGameChange}>
    <span>Loot game</span>

    {#if gameService.isRoundRunning}
        <MiniGamesTimer timeout={gameService.timeUntilMessage} class="hgf-ml-4" />
    {/if}
</MiniGamesCheckBox>

<MiniGamesButton onclick={participate} disabled={!gameService.isGamePhase} />

<script lang="ts">
import { MiniGamesCheckBox, MiniGamesButton, MiniGamesTimer } from './basicComponents';
import { Container } from 'typedi';
import { SettingsFacade } from '@shared/modules';
import { LootGameService } from '@twitch/modules/miniGames';
import { onDestroy } from 'svelte';

const settingsFacade = Container.get(SettingsFacade);

const gameService = new LootGameService();

function participate() {
    gameService.participate();
}

async function onLootGameChange(event: Event) {
    const isEnabled = (event.target as HTMLInputElement).checked;

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
