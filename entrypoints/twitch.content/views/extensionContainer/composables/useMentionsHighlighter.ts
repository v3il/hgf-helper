import { Container } from 'typedi';
import { GlobalSettingsService } from '@components/settings';
import { ChatObserver } from '@twitch/modules/twitchChat';
import { UnsubscribeTrigger } from '@components/EventEmitter';

export const useMentionsHighlighter = () => {
    let unsubscribe: UnsubscribeTrigger | undefined;

    const settingsService = Container.get(GlobalSettingsService);
    const chatObserver = Container.get(ChatObserver);

    if (settingsService.settings.highlightMentions) {
        init();
    }

    settingsService.events.on('setting-changed:highlightMentions', (isEnabled) => {
        isEnabled ? init() : destroy();
    });

    function init() {
        unsubscribe = chatObserver.observeChat(({ messageWrapperEl, hasMyMention }) => {
            if (hasMyMention) {
                messageWrapperEl.style.backgroundColor = 'darkred';
            }
        });
    }

    function destroy() {
        unsubscribe?.();
    }
};
