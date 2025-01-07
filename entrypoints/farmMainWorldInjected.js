class TwitchChatService {
    _chatInputEl;
    _sendMessageEl;

    constructor({ chatInputEl, sendMessageEl }) {
        this._chatInputEl = chatInputEl;
        this._sendMessageEl = sendMessageEl;
    }

    sendMessage({ message, forced, isDev }) {
        console.error('send', message, forced);

        if (isDev && !forced) {
            return false;
        }

        try {
            this._typeMessage(message);
            setTimeout(() => { this._sendMessage(); }, 0);
        } catch (e) {
            console.error(e);
            return false;
        }

        return true;
    }

    _getReactInstance(element) {
        for (const key in element) {
            if (key.startsWith('__reactInternalInstance$') || key.startsWith('__reactFiber$')) {
                return element[key];
            }
        }

        return null;
    }

    _searchReactParents(node, predicate, maxDepth = 15, depth = 0) {
        try {
            if (predicate(node)) {
                return node;
            }
        } catch (e) {
            console.error(e);
        }

        if (!node || depth > maxDepth) {
            return null;
        }

        const { return: parent } = node;

        if (parent) {
            return this._searchReactParents(parent, predicate, maxDepth, depth + 1);
        }

        return null;
    }

    _getChatInput() {
        try {
            return this._searchReactParents(
                this._getReactInstance(this._chatInputEl),
                (n) => n.memoizedProps && n.memoizedProps.componentType != null && n.memoizedProps.value != null
            );
        } catch (_) {
            console.error(_);
            return null;
        }
    }

    _typeMessage(message) {
        const chatInput = this._getChatInput(this._chatInputEl);

        if (chatInput == null) {
            return;
        }

        chatInput.memoizedProps.value = message;
        chatInput.memoizedProps.setInputValue(message);
        chatInput.memoizedProps.onValueUpdate(message);
    }

    _sendMessage() {
        this._sendMessageEl.click();
    }
}

export default defineUnlistedScript(() => {
    (function init() {
        const chatInputEl = document.querySelector('[data-a-target="chat-input"]');
        const sendMessageEl = document.querySelector('[data-a-target="chat-send-button"]');

        if (!(chatInputEl && sendMessageEl)) {
            return setTimeout(init, 1000);
        }

        const twitchChatService = new TwitchChatService({ chatInputEl, sendMessageEl });

        window.addEventListener('hgf-helper:sendMessage', ({ detail }) => {
            twitchChatService.sendMessage(detail);
        });
    }());
});
