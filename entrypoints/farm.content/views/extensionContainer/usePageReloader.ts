import { GlobalVariables } from '@farm/consts';

export interface IPageReloader {
    handleBrokenVideo(isVideoBroken: boolean): void;
}

export const usePageReloader = () => {
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
