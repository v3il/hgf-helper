<MiniGamesPanel isRunning={settingsFacade.settings.lootGame} {onCheckboxChange} {participate} Icon={Package} name="Loot" {...props}>
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
import { LootGameService } from '@twitch/modules/miniGames';
import { getContext, onDestroy } from 'svelte';
import { Package } from '@lucide/svelte';

const props = $props();

const settingsFacade = Container.get(SettingsFacade);

const gameService = getContext<LootGameService>('loot');

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
</script>
