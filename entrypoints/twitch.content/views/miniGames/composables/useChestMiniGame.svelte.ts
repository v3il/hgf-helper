import { getContext } from 'svelte';
import { PackageOpen } from '@lucide/svelte';
import { ChestGameService } from '@twitch/modules/miniGames';

export const useChestMiniGame = () => {
    const gameService = getContext<ChestGameService>('chest');

    function participate() {
        gameService.participate();
    }

    function toggle(isEnabled: boolean) {
        isEnabled ? gameService.start() : gameService.stop();
    }

    return {
        name: 'Chest',
        Icon: PackageOpen,
        gameService,
        participate,
        toggle
    };
}
