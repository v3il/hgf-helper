<div class="flex items-center gap-[16px]">
    <CompactMiniGamesControlsItem
        isGameActive={hitsquadGameService.isRunning}
        isTimerVisible={hitsquadGameService.isRunning}
        timeout={hitsquadGameService.timeUntilMessage}
        Icon={Gift}
        onToggle={() => hitsquadGameService.participate()}
    />

    <CompactMiniGamesControlsItem
        isGameActive={settingsFacade.settings.lootGame}
        isTimerVisible={lootGameService.isRoundRunning}
        timeout={lootGameService.timeUntilMessage}
        Icon={Package}
        onToggle={() => lootGameService.participate()}
    />

    <CompactMiniGamesControlsItem
        isGameActive={settingsFacade.settings.chestGame}
        isTimerVisible={chestGameService.isRoundRunning}
        timeout={chestGameService.timeUntilMessage}
        Icon={PackageOpen}
        onToggle={() => chestGameService.participate()}
    />
</div>

<script lang="ts">
import CompactMiniGamesControlsItem from './CompactMiniGamesControlsItem.svelte';
import { getContext } from 'svelte';
import { HitsquadGameService, LootGameService, ChestGameService } from '@twitch/modules/miniGames';
import { Package, Gift, PackageOpen } from '@lucide/svelte';
import { Container } from 'typedi';
import { SettingsFacade } from '@shared/modules';

const settingsFacade = Container.get(SettingsFacade);

const hitsquadGameService = getContext<HitsquadGameService>('hitsquad');
const lootGameService = getContext<LootGameService>('loot');
const chestGameService = getContext<ChestGameService>('chest');
</script>
