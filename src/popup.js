import './popup.css';
import { settingsService } from "./services";

document.querySelector('[data-toggle-messages]').addEventListener('click', () => {
    console.error('1')
    settingsService.toggleMessages()

    chrome.tabs.query({}, tabs => {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {
                test: 1
            });
        });
    });
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.error(message)

    sendResponse({
        data: "I am fine, thank you. How is life in the background?"
    });
});


