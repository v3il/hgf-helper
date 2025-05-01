<div class="flex items-center gap-[16px]">
    <CompactMiniGamesControlsHitsquad />

    <CompactMiniGamesControlsItem
        isGameActive={settingsFacade.settings.lootGame}
        isTimerVisible={lootGameService.isRoundRunning}
        timeout={lootGameService.timeUntilMessage}
        Icon={Package}
        name="Loot"
        toggle={() => lootGameService.participate()}
        participate={() => lootGameService.participate()}
    />

    <CompactMiniGamesControlsItem
        isGameActive={settingsFacade.settings.chestGame}
        isTimerVisible={chestGameService.isRoundRunning}
        timeout={chestGameService.timeUntilMessage}
        Icon={PackageOpen}
        name="Chest"
        toggle={() => chestGameService.participate()}
        participate={() => chestGameService.participate()}
    />
</div>

<script lang="ts">
import CompactMiniGamesControlsItem from './CompactMiniGamesControlsItem.svelte';
import { getContext } from 'svelte';
import { LootGameService, ChestGameService } from '@twitch/modules/miniGames';
import { Package, Gift, PackageOpen } from '@lucide/svelte';
import { Container } from 'typedi';
import { SettingsFacade } from '@shared/modules';
import CompactMiniGamesControlsHitsquad from './CompactMiniGamesControlsHitsquad.svelte';

const settingsFacade = Container.get(SettingsFacade);

const lootGameService = getContext<LootGameService>('loot');
const chestGameService = getContext<ChestGameService>('chest');
</script>
