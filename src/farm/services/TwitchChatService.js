import { Container } from 'typedi';
import { InjectionTokens } from '../consts';

export class TwitchChatService {
    static create({ chatInputEl, sendMessageButtonEl }) {
        const streamStatusService = Container.get(InjectionTokens.STREAM_STATUS_SERVICE);

        return new TwitchChatService({
            chatInputEl,
            sendMessageButtonEl,
            streamStatusService
        });
    }

    _chatInputEl;
    _sendMessageButtonEl;
    _streamStatusService;

    constructor({ chatInputEl, sendMessageButtonEl, streamStatusService }) {
        this._chatInputEl = chatInputEl;
        this._sendMessageButtonEl = sendMessageButtonEl;
        this._streamStatusService = streamStatusService;
    }

    sendMessage(message, forced = false) {
        console.error('send', message, forced);

        return;

        // eslint-disable-next-line no-unreachable
        if (this._streamStatusService.isBanPhase && !forced) {
            return false;
        }

        try {
            this._typeMessage(message);
            this._sendMessage();
        } catch (e) {
            console.error(e);
            return false;
        }

        return true;
    }

    _getReactInstance(element) {
        for (const key in element) {
            if (key.startsWith('__reactInternalInstance$')) {
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
        this._sendMessageButtonEl.click();
    }
}
