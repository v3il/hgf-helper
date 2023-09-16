let retry = false;

async function loadSettings() {
    try {
        return chrome.runtime.sendMessage({ action: 'LOAD_SETTINGS' });
    } catch (error) {
        console.error('retry');
        loadSettings();
        retry = true;
    }
}

(() => {
    document.addEventListener('DOMContentLoaded', async () => {
        const settings = await loadSettings();
        console.error(settings);

        if (retry) {
            document.body.style.backgroundColor = 'lightcoral';
        }

        Object.entries(settings).forEach(([key, value]) => {
            const input = document.querySelector(`[data-prop="${key}"]`);

            if (!input) return;

            input.value = value;

            input.addEventListener('change', () => {
                chrome.runtime.sendMessage({
                    action: 'UPDATE_SETTINGS',
                    [key]: input.value
                });
            });
        });
    });
})();
