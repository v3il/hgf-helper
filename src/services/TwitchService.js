export class TwitchService {
    #chatInputEl;
    #sendMessageButtonEl;

    constructor({ chatInputEl, sendMessageButtonEl }) {
        this.#chatInputEl = chatInputEl
        this.#sendMessageButtonEl = sendMessageButtonEl

        console.error(this.#chatInputEl, this.#sendMessageButtonEl);
    }

    sendMessage(message) {
        try {
            this.#typeMessage(message);
            this.#sendMessage();
            console.error(message)
        } catch (e) {
            console.error(e)
        }
    }

    #getReactInstance(element) {
        for (const key in element) {
            if (key.startsWith('__reactInternalInstance$')) {
                return element[key];
            }
        }

        return null;
    }

    #searchReactParents(node, predicate, maxDepth = 15, depth = 0) {
        try {
            if (predicate(node)) {
                return node;
            }
        } catch (_) {}

        if (!node || depth > maxDepth) {
            return null;
        }

        const { return: parent } = node;

        if (parent) {
            return this.#searchReactParents(parent, predicate, maxDepth, depth + 1);
        }

        return null;
    }

    #getChatInput() {
        try {
            return this.#searchReactParents(
                this.#getReactInstance(this.#chatInputEl),
                (n) => n.memoizedProps && n.memoizedProps.componentType != null && n.memoizedProps.value != null
            );
        } catch (_) {
            console.error(_)
            return null
        }
    }

    #typeMessage(message) {
        const chatInput = this.#getChatInput(this.#chatInputEl);

        if (chatInput == null) {
            return;
        }

        chatInput.memoizedProps.value = message;
        chatInput.memoizedProps.setInputValue(message);
        chatInput.memoizedProps.onValueUpdate(message);
    }

    #sendMessage() {
        this.#sendMessageButtonEl.click();
    }
}
