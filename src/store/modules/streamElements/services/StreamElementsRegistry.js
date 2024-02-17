export class StreamElementsRegistry {
    onElementsReady(callback) {
        const interval = setInterval(() => {
            const { offerElements } = this;

            if (this.sortOffersDropdown && offerElements.length > 0) {
                clearInterval(interval);
                callback();
            }
        }, 500);
    }

    get sortOffersDropdown() {
        return document.querySelector('[ng-model="vm.sortBy"]');
    }

    get offerElements() {
        return document.querySelectorAll('.stream-store-list-item');
    }
}
