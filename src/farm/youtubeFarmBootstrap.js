/* eslint-disable no-undef */
const distFolderPath = 'dist';
const { body } = document;

const script = document.createElement('script');
script.type = 'module';
script.src = chrome.runtime.getURL(`${distFolderPath}/youtubeFarm.js`);
body.appendChild(script);

// const style = document.createElement('link');
// style.type = 'text/css';
// style.rel = 'stylesheet';
// style.href = chrome.runtime.getURL(`${distFolderPath}/twitchFarm.css`);
// body.appendChild(style);

console.log('Youtube farm');
