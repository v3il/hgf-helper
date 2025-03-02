import { TwitchElementsRegistry } from './TwitchElementsRegistry';

interface IAdsVideoResizerServiceParams {
    twitchElementsRegistry: TwitchElementsRegistry;
}

const PICTURE_IN_PICTURE_CLASS = 'picture-by-picture-player';
const PICTURE_IN_PICTURE_COLLAPSED_CLASS = 'picture-by-picture-player--collapsed';

export class AdsVideoResizerService {
    private twitchElementsRegistry;
    private observer!: MutationObserver;
    private classObserver!: MutationObserver;

    constructor({ twitchElementsRegistry }: IAdsVideoResizerServiceParams) {
        this.twitchElementsRegistry = twitchElementsRegistry;
    }

    enableResize() {
        // this.observer = this.createObserver();
        // this.observer.observe(this.twitchElementsRegistry.chatContainerEl!, { childList: true, subtree: true });
    }

    private createObserver() {
        return new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node instanceof HTMLElement && node.classList.contains(PICTURE_IN_PICTURE_CLASS)) {
                            console.log('New div with class "target-class" added:', node);
                            this.classObserver = this.createClassObserver(node);
                            this.classObserver.observe(node, { attributes: true, attributeFilter: ['class'] });
                        }
                    });
                }
            });
        });
    }

    private createClassObserver(element: HTMLElement) {
        return new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    const adsVideoEl = this.twitchElementsRegistry.adsVideoEl!;

                    if (element.classList.contains(PICTURE_IN_PICTURE_COLLAPSED_CLASS)) {
                        console.log('video hid');
                        adsVideoEl.remove();
                    } else {
                        this.expandAdsVideo(adsVideoEl);
                        console.log('video showed');
                    }
                }
            });
        });
    }

    private expandAdsVideo(adsVideoEl: HTMLVideoElement) {
        const mainVideoBounds = this.twitchElementsRegistry.mainVideoEl!.getBoundingClientRect();

        document.body.appendChild(adsVideoEl);

        adsVideoEl.style.position = 'fixed';
        adsVideoEl.style.zIndex = '999999';
        adsVideoEl.style.top = `${mainVideoBounds.top}px`;
        adsVideoEl.style.left = `${mainVideoBounds.left}px`;
        adsVideoEl.style.width = `${mainVideoBounds.width}px`;
        adsVideoEl.style.height = `${mainVideoBounds.height}px`;
        adsVideoEl.style.border = '2px solid red';
    }
}
