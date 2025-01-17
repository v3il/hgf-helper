import { Commands, GlobalVariables, MessageTemplates } from '@farm/consts';
import { StreamFacade } from '@farm/modules/stream';
import { ChatFacade } from '@farm/modules/chat';
import { TwitchFacade } from '@farm/modules/twitch';
import { SettingsFacade } from '@components/shared';
import { MiniGamesFacade } from '@farm/modules/miniGames';

interface IParams {
    el: HTMLElement;
    chatFacade: ChatFacade,
    twitchFacade: TwitchFacade,
    settingsFacade: SettingsFacade,
    miniGamesFacade: MiniGamesFacade
}

export const useGiveawaysHandler = ({
    el, chatFacade, twitchFacade, settingsFacade, miniGamesFacade
}: IParams) => {
    function handleGiveawaysCheckbox() {
        const toggleGiveawaysEl = el.querySelector<HTMLInputElement>('[data-toggle-giveaways]')!;
        const isHitsquadRunning = settingsFacade.getLocalSetting('hitsquadRunner');
        const remainingHitsquadRounds = settingsFacade.getLocalSetting('hitsquadRunnerRemainingRounds');

        if (isHitsquadRunning && remainingHitsquadRounds > 0) {
            console.info(`HGF helper: start Hitsquad runner with ${remainingHitsquadRounds} rounds`);
            toggleGiveawaysEl.checked = true;
            miniGamesFacade.startHitsquadRunner({ totalRounds: remainingHitsquadRounds });
        }

        toggleGiveawaysEl.addEventListener('change', () => {
            toggleGiveawaysEl.checked ? handleGiveawaysOn() : turnOffGiveaways();
        });
    }

    function handleGiveawaysOn() {
        // eslint-disable-next-line no-alert
        const gamesCount = prompt('Enter games count', `${GlobalVariables.HITSQUAD_GAMES_PER_DAY}`);
        const toggleGiveawaysEl = el.querySelector<HTMLInputElement>('[data-toggle-giveaways]')!;
        const numericGamesCount = Number(gamesCount);

        if (!gamesCount || Number.isNaN(numericGamesCount) || numericGamesCount <= 0) {
            toggleGiveawaysEl.checked = false;
            return;
        }

        miniGamesFacade.startHitsquadRunner({ totalRounds: numericGamesCount });

        settingsFacade.updateLocalSettings({
            hitsquadRunner: true,
            hitsquadRunnerRemainingRounds: numericGamesCount
        });
    }

    function handleHitsquadRunnerStop() {
        miniGamesFacade.hitsquadEvents.on('hitsquadRunner:round', ({ remainingRounds, stopped }) => {
            if (stopped) {
                return turnOffGiveaways();
            }

            settingsFacade.updateLocalSettings({
                hitsquadRunnerRemainingRounds: remainingRounds
            });
        });
    }

    function addGlobalChatListener() {
        chatFacade.observeChat(({ message, isMe, isSystemMessage }) => {
            if (isMe && message.startsWith(Commands.HITSQUAD) && message.split(' ')[1]) {
                return turnOffGiveaways();
            }

            const twitchUserName = twitchFacade.twitchUser.userName;

            if (isSystemMessage && MessageTemplates.isTooManyStrikesNotification(message, twitchUserName)) {
                turnOffGiveaways();
            }
        });
    }

    function turnOffGiveaways() {
        const toggleGiveawaysEl = el.querySelector<HTMLInputElement>('[data-toggle-giveaways]')!;

        toggleGiveawaysEl.checked = false;

        miniGamesFacade.stopHitsquadRunner();

        settingsFacade.updateLocalSettings({
            hitsquadRunner: false,
            hitsquadRunnerRemainingRounds: 0
        });
    }

    handleGiveawaysCheckbox();
    addGlobalChatListener();
    handleHitsquadRunnerStop();
};
