interface IPageReloader {
    handleBrokenVideo(isVideoBroken: boolean): void;
}

const PAGE_RELOAD_ROUNDS = 30;

export const useBrokenStreamHandler = (): IPageReloader => {
    let brokenStreamRounds = 0;

    function handleBrokenVideo(isVideoBroken: boolean) {
        if (!isVideoBroken) {
            brokenStreamRounds = 0;
            return;
        }

        brokenStreamRounds++;

        if (brokenStreamRounds >= PAGE_RELOAD_ROUNDS) {
            window.location.reload();
        }
    }

    return { handleBrokenVideo };
};
