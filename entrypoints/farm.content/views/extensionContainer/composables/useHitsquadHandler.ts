import { Commands, MessageTemplates } from '@farm/consts';
import { ChatFacade } from '@farm/modules/chat';
import { TwitchFacade } from '@farm/modules/twitch';
import { MiniGamesFacade } from '@farm/modules/miniGames';

interface IParams {
    el: HTMLElement;
    chatFacade: ChatFacade,
    twitchFacade: TwitchFacade,
    miniGamesFacade: MiniGamesFacade
}

const HITSQUAD_GAMES_PER_DAY = 600;

export const useHitsquadHandler = ({
    el, chatFacade, twitchFacade, miniGamesFacade
}: IParams) => {
    const hitsquadCheckboxEl = el.querySelector<HTMLInputElement>('[data-toggle-hitsquad]')!;

    hitsquadCheckboxEl.checked = miniGamesFacade.isHitsquadRunning;

    hitsquadCheckboxEl.addEventListener('change', () => {
        hitsquadCheckboxEl.checked ? turnHitsquadOn() : turnHitsquadOff();
    });

    miniGamesFacade.hitsquadEvents.on('end', () => {
        hitsquadCheckboxEl.checked = false;
    });

    chatFacade.observeChat(({ message, isMe, isSystemMessage }) => {
        const twitchUserName = twitchFacade.twitchUser.userName;
        const isStopCommand = isMe && message.startsWith(Commands.HITSQUAD) && message.split(' ')[1];
        const isStrike = isSystemMessage && MessageTemplates.isTooManyStrikesNotification(message, twitchUserName);

        if (isStopCommand || isStrike) {
            turnHitsquadOff();
        }
    });

    function turnHitsquadOn() {
        // eslint-disable-next-line no-alert
        const gamesCount = prompt('Enter rounds count', `${HITSQUAD_GAMES_PER_DAY}`);
        const numericGamesCount = Number(gamesCount);

        if (!gamesCount || Number.isNaN(numericGamesCount) || numericGamesCount <= 0) {
            return turnHitsquadOff();
        }

        miniGamesFacade.startHitsquadRunner(numericGamesCount);
    }

    function turnHitsquadOff() {
        miniGamesFacade.stopHitsquadRunner();
        hitsquadCheckboxEl.checked = false;
    }
};
