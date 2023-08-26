/* eslint-disable no-undef */
const distFolderPath = 'dist';
const { body } = document;

const script = document.createElement('script');
script.type = 'module';
script.src = chrome.runtime.getURL(`${distFolderPath}/farm.js`);
body.appendChild(script);

const style = document.createElement('link');
style.type = 'text/css';
style.rel = 'stylesheet';
style.href = chrome.runtime.getURL(`${distFolderPath}/farm.css`);
body.appendChild(style);
