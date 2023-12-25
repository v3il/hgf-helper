const script = document.createElement('script');
script.type = 'module';
script.src = chrome.runtime.getURL('dist/store.js');

document.body.appendChild(script);
