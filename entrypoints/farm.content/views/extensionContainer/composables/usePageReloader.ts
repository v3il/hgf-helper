interface IPageReloader {
    handleBrokenVideo(isVideoBroken: boolean): void;
}

const PAGE_RELOAD_ROUNDS = 30;

export const usePageReloader = (): IPageReloader => {
    let brokenVideoRounds = 0;

    function handleBrokenVideo(isVideoBroken: boolean) {
        if (!isVideoBroken) {
            brokenVideoRounds = 0;
            return;
        }

        brokenVideoRounds++;

        if (brokenVideoRounds >= PAGE_RELOAD_ROUNDS) {
            window.location.reload();
        }
    }

    return { handleBrokenVideo };
};
