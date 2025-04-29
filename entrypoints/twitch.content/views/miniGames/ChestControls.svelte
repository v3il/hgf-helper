<MiniGamesPanel isRunning={settingsFacade.settings.chestGame} {onCheckboxChange} {participate} Icon={PackageOpen} name="Chest" {...props}>
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
import { Container } from 'typedi';
import { SettingsFacade } from '@shared/modules';
import { ChestGameService } from '@twitch/modules/miniGames';
import { getContext } from 'svelte';
import { PackageOpen } from '@lucide/svelte';

const props = $props();

const settingsFacade = Container.get(SettingsFacade);

const gameService = getContext<ChestGameService>('chest');

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
</script>
