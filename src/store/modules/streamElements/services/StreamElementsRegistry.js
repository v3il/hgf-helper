export class StreamElementsRegistry {
    onElementsReady(callback) {
        const interval = setInterval(() => {
            const { offerEls } = this;

            if (this.sortOffersDropdown && offerEls.length > 0) {
                clearInterval(interval);
                callback();
            }
        }, 500);
    }

    get sortOffersDropdown() {
        return document.querySelector('[ng-model="vm.sortBy"]');
    }

    get offerEls() {
        return document.querySelectorAll('.stream-store-list-item');
    }
}
