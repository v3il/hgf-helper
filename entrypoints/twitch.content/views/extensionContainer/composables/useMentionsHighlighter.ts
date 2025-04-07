import { Container } from 'typedi';
import { ChatObserver } from '@twitch/modules/twitchChat';
import { UnsubscribeTrigger } from '@shared/EventEmitter';
import { SettingsFacade } from '@shared/modules';

export interface IMentionsHighlighter {
    destroy: () => void;
}

export const useMentionsHighlighter = (): IMentionsHighlighter => {
    let destroyChatObserver: UnsubscribeTrigger | undefined;

    const settingsFacade = Container.get(SettingsFacade);
    const chatObserver = Container.get(ChatObserver);

    if (settingsFacade.settings.highlightMentions) {
        initChatObserver();
    }

    const destroySettingObserver = settingsFacade.onSettingChanged('highlightMentions', (isEnabled) => {
        isEnabled ? initChatObserver() : destroyChatObserver?.();
    });

    function initChatObserver() {
        destroyChatObserver = chatObserver.observeChat(({ messageWrapperEl, hasMyMention }) => {
            if (hasMyMention) {
                messageWrapperEl.style.backgroundColor = 'darkred';
            }
        });
    }

    return {
        destroy: () => {
            destroySettingObserver();
            destroyChatObserver?.();
        }
    };
};
