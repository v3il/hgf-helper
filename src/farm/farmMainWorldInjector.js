import mainWorldScript from './farmMainWorld?script&module';

const script = document.createElement('script');

script.type = 'module';
script.src = chrome.runtime.getURL(mainWorldScript);

document.body.appendChild(script);
