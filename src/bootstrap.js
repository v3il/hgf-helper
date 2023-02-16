const distFolderPath = 'dist';
const body = document.body;

const script = document.createElement('script');
script.type = 'text/javascript';
script.src = chrome.runtime.getURL(`${distFolderPath}/extension.js`);
body.appendChild(script);

const style = document.createElement('link');
style.type = 'text/css';
style.rel = 'stylesheet';
style.href = chrome.runtime.getURL(`${distFolderPath}/extension.css`);
body.appendChild(style);
