import { getContext } from 'svelte';
import { Package } from '@lucide/svelte';
import { LootGameService } from '@twitch/modules/miniGames';

export const useLootMiniGame = () => {
    const gameService = getContext<LootGameService>('loot');

    function participate() {
        gameService.participate();
    }

    function toggle(isEnabled: boolean) {
        isEnabled ? gameService.start() : gameService.stop();
    }

    return {
        name: 'Loot',
        Icon: Package,
        gameService,
        participate,
        toggle
    };
}
