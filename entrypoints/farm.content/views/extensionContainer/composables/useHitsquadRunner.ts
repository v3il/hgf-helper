import { Commands, MessageTemplates } from '@farm/consts';
import { ChatFacade } from '@farm/modules/chat';
import { TwitchFacade } from '@farm/modules/twitch';
import { MiniGamesFacade } from '@farm/modules/miniGames';
import { StreamFacade } from '@farm/modules/stream';

interface IParams {
    el: HTMLElement;
    chatFacade: ChatFacade,
    twitchFacade: TwitchFacade,
    miniGamesFacade: MiniGamesFacade,
    streamFacade: StreamFacade
}

const HITSQUAD_GAMES_PER_DAY = 600;

export const useHitsquadRunner = ({
    el, chatFacade, twitchFacade, miniGamesFacade, streamFacade
}: IParams) => {
    const checkboxEl = el.querySelector<HTMLInputElement>('[data-toggle-hitsquad]')!;
    const buttonEl = el.querySelector<HTMLButtonElement>('[data-hitsquad-button]')!;

    checkboxEl.checked = miniGamesFacade.isHitsquadRunning;

    checkboxEl.addEventListener('change', () => {
        checkboxEl.checked ? turnHitsquadOn() : turnHitsquadOff();
    });

    miniGamesFacade.hitsquadEvents.on('end', () => {
        checkboxEl.checked = false;
    });

    chatFacade.observeChat(({ message, isMe, isSystemMessage }) => {
        const twitchUserName = twitchFacade.twitchUser.userName;
        const isStopCommand = isMe && message.startsWith(Commands.HITSQUAD) && message.split(' ')[1];
        const isStrike = isSystemMessage && MessageTemplates.isTooManyStrikesNotification(message, twitchUserName);

        if (isStopCommand || isStrike) {
            turnHitsquadOff();
        }
    });

    buttonEl.addEventListener('click', (event) => {
        if (event.ctrlKey) {
            chatFacade.withoutSuppression(() => miniGamesFacade.participateHitsquadOnce());
        } else if (streamFacade.isStreamOk) {
            miniGamesFacade.participateHitsquadOnce();
        }
    });

    function turnHitsquadOn() {
        const gamesCount = prompt('Enter rounds count', `${HITSQUAD_GAMES_PER_DAY}`);
        const numericGamesCount = Number(gamesCount);

        if (!gamesCount || Number.isNaN(numericGamesCount) || numericGamesCount <= 0) {
            return turnHitsquadOff();
        }

        miniGamesFacade.startHitsquadRunner(numericGamesCount);
    }

    function turnHitsquadOff() {
        miniGamesFacade.stopHitsquadRunner();
        checkboxEl.checked = false;
    }
};
