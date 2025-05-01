import { getContext } from 'svelte';
import { Gift } from '@lucide/svelte';
import { HitsquadGameService } from '@twitch/modules/miniGames';

export const useHitsquadMiniGame = () => {
    const gameService = getContext<HitsquadGameService>('hitsquad');

    function participate() {
        gameService.participate();
    }

    function toggle(isEnabled: boolean) {
        if (!isEnabled) {
            return gameService.stop();
        }

        const gamesCount = prompt('Enter rounds count', `${HitsquadGameService.HITSQUAD_GAMES_PER_DAY}`);
        const numericGamesCount = Number(gamesCount);

        if (!gamesCount || Number.isNaN(numericGamesCount) || numericGamesCount <= 0) {
            return;
        }

        gameService.start(numericGamesCount);
    }

    return {
        name: 'Giveaways',
        Icon: Gift,
        gameService,
        participate,
        toggle
    };
}
