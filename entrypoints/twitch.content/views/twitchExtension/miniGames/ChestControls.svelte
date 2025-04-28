<MiniGamesCheckBox checked={settingsFacade.settings.chestGame} onchange={onLootGameChange}>
    <span>Chest game</span>

    {#if gameService.isRoundRunning}
        <MiniGamesTimer timeout={gameService.timeUntilMessage} class="hgf-ml-4" />
    {/if}
</MiniGamesCheckBox>

<MiniGamesButton onclick={participate} disabled={!gameService.isGamePhase} />

<!--<div class="w-full bg-[#18181b]/80 backdrop-blur-sm shadow-lg px-4 py-2 space-x-4 flex items-center justify-between border-x-0 border-t-0 border-b border-[#27272a]  rounded-b-xl">-->
<!--    <div class="flex flex-col gap-1">-->
<!--        <div class="flex items-center gap-3">-->
<!--            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"-->
<!--                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"-->
<!--                 class="lucide lucide-package-open w-5 h-5 text-[#9b87f5]">-->
<!--                <path d="M12 22v-9"></path>-->
<!--                <path d="M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z"></path>-->
<!--                <path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13"></path>-->
<!--                <path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z"></path>-->
<!--            </svg>-->
<!--            <h2 class="font-semibold text-[#a1a1aa]">Chest</h2><span-->
<!--                class="font-mono font-bold text-[#71717a] text-xs leading-none">(06:20)</span></div>-->
<!--    </div>-->
<!--    <div class="flex items-center gap-4">-->
<!--        <button type="button" role="switch" aria-checked="true" data-state="checked" value="on"-->
<!--                class="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-input data-[state=checked]:bg-[#9b87f5]">-->
<!--                <span data-state="checked"-->
<!--                      class="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"></span>-->
<!--        </button>-->
<!--        <div data-orientation="vertical" role="none" class="shrink-0 w-[1px] h-8 ml-2 bg-[#27272a]"></div>-->
<!--        <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-10 px-4 py-2 uppercase text-[#a1a1aa] hover:bg-[#27272a]/50 hover:text-[#d4d4d8]">-->
<!--            SEND-->
<!--        </button>-->
<!--    </div>-->
<!--</div>-->

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
