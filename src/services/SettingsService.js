export class SettingsService {
    #isMessagesEnabled = false;

    get isMessagesEnabled() {
        return this.#isMessagesEnabled;
    }

    toggleMessages() {
        console.error(this.#isMessagesEnabled)

        this.#isMessagesEnabled = !this.#isMessagesEnabled;
    }
}
