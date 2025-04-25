<MiniGamesCheckBox checked={settingsFacade.settings.chestGame} onchange={onLootGameChange}>
    <span>Chest game</span>

    {#if gameService.isRoundRunning}
        <MiniGamesTimer timeout={gameService.timeUntilMessage} class="hgf-ml-8" />
    {/if}
</MiniGamesCheckBox>

<MiniGamesButton onclick={participate} disabled={!gameService.isGamePhase} />

<script lang="ts">
    import { MiniGamesCheckBox, MiniGamesButton, MiniGamesTimer } from './basicComponents';
    import { Container } from 'typedi';
    import { SettingsFacade } from '@shared/modules';
    import { ChestGameService } from '@twitch/modules/miniGames';
    import { onDestroy } from 'svelte';

    const settingsFacade = Container.get(SettingsFacade);

    const gameService = new ChestGameService();

    function participate() {
        gameService.participate();
    }

    async function onLootGameChange(event: Event) {
        const isEnabled = (event.target as HTMLInputElement).checked;

        await settingsFacade.updateSettings({
            chestGame: isEnabled
        });

        if (!isEnabled) {
            gameService.stop();
        }
    }

    onDestroy(() => {
        gameService.destroy();
    })
</script>
