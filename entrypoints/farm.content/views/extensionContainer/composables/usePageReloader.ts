import { GlobalVariables } from '@farm/consts';

interface IPageReloader {
    handleBrokenVideo(isVideoBroken: boolean): void;
}

export const usePageReloader = (): IPageReloader => {
    let brokenVideoRounds = 0;

    function handleBrokenVideo(isVideoBroken: boolean) {
        if (!isVideoBroken) {
            brokenVideoRounds = 0;
            return;
        }

        brokenVideoRounds++;

        if (brokenVideoRounds >= GlobalVariables.PAGE_RELOAD_ROUNDS) {
            window.location.reload();
        }
    }

    return { handleBrokenVideo };
};
