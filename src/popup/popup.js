(async () => {
    const settings = await chrome.runtime.sendMessage({ action: 'LOAD_SETTINGS' });

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
})();
