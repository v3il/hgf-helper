import { logError } from '@utils';

interface ITwitchChatServiceParams {
    chatInputEl: HTMLInputElement;
    sendMessageEl: HTMLButtonElement;
}

class TwitchChatService {
    private readonly chatInputEl;
    private readonly sendMessageEl;

    constructor({ chatInputEl, sendMessageEl }: ITwitchChatServiceParams) {
        this.chatInputEl = chatInputEl;
        this.sendMessageEl = sendMessageEl;
    }

    sendMessage({ message }: { message: string }): boolean {
        try {
            this.typeMessage(message);
            setTimeout(() => { this.triggerSendMessage(); }, 0);
        } catch (e) {
            logError(e);
            return false;
        }

        return true;
    }

    private getReactInstance(element: HTMLElement) {
        for (const key in element) {
            if (key.startsWith('__reactInternalInstance$') || key.startsWith('__reactFiber$')) {
                // @ts-ignore
                return element[key];
            }
        }

        return null;
    }

    private searchReactParents(node: HTMLElement, predicate: (node: HTMLElement) => boolean, maxDepth = 15, depth = 0): any {
        try {
            if (predicate(node)) {
                return node;
            }
        } catch (e) {
            logError(e);
        }

        if (!node || depth > maxDepth) {
            return null;
        }

        // @ts-ignore
        const { return: parent } = node;

        if (parent) {
            return this.searchReactParents(parent, predicate, maxDepth, depth + 1);
        }

        return null;
    }

    private getChatInput() {
        try {
            return this.searchReactParents(
                this.getReactInstance(this.chatInputEl),
                // @ts-ignore
                (n) => n.memoizedProps && n.memoizedProps.componentType != null && n.memoizedProps.value != null
            );
        } catch (_) {
            logError(_);
            return null;
        }
    }

    private typeMessage(message: string) {
        const chatInput = this.getChatInput();

        if (chatInput == null) {
            return;
        }

        chatInput.memoizedProps.value = message;
        chatInput.memoizedProps.setInputValue(message);
        chatInput.memoizedProps.onValueUpdate(message);
    }

    private triggerSendMessage() {
        this.sendMessageEl.click();
    }
}

export default defineUnlistedScript(() => {
    function handleUrlChange() {
        const dispatchEvent = (prevUrl: string) => {
            if (prevUrl !== window.location.href.toString()) {
                window.dispatchEvent(new CustomEvent('hgf-helper:urlChanged'));
            }
        }

        const _pushState = history.pushState;

        history.pushState = function(...args) {
            const prevUrl = window.location.href.toString();
            _pushState.apply(this, args);
            dispatchEvent(prevUrl);
        };

        const _replaceState = history.replaceState;

        history.replaceState = function(...args) {
            const prevUrl = window.location.href.toString();
            _replaceState.apply(this, args);
            dispatchEvent(prevUrl);
        };

        window.addEventListener('popstate', () => {
            const prevUrl = window.location.href.toString();
            dispatchEvent(prevUrl);
        });
    }

    (function init() {
        const chatInputEl = document.querySelector<HTMLInputElement>('[data-a-target="chat-input"]');
        const sendMessageEl = document.querySelector<HTMLButtonElement>('[data-a-target="chat-send-button"]');

        if (!(chatInputEl && sendMessageEl)) {
            return setTimeout(init, 1000);
        }

        const twitchChatService = new TwitchChatService({ chatInputEl, sendMessageEl });

        window.addEventListener('hgf-helper:sendMessage', (event) => {
            twitchChatService.sendMessage((event as CustomEvent).detail);
        });

        handleUrlChange();
    }());
});
