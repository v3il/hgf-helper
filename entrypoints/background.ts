import { log, logError } from '@utils';

interface IRequestParams {
    url: string;
    requestInit: RequestInit
}

const sendRequest = async (message: IRequestParams) => {
    const { url, requestInit } = message;
    const response = await fetch(url, requestInit);

    if (!response.ok) {
        const errorBody = await response.json();
        throw { status: response.status, error: errorBody.error };
    }

    return response.json();
}

export default defineBackground(() => {
    chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
        if (message.type === 'sendRequest') {
            (async () => {
                try {
                    const data = await sendRequest(message);
                    log('Fetched data:', data);
                    sendResponse({ data });
                } catch (error) {
                    logError('Error fetching data:', error);
                    sendResponse({ error });
                }
            })();

            return true;
        }
    });
});
