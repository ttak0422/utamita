import { APP_ID, AppEvent } from './util';

// The script to be injected
declare const SCRIPT: string;

/**
 * Inject script
 */
function addScript() {
  const inject = document.createElement('script');
  inject.appendChild(document.createTextNode(SCRIPT));
  inject.id = APP_ID;
  document.body.appendChild(inject);
}

/**
 * Remove the injected script
 */
function removeScript() {
  const inject = document.getElementById(APP_ID);
  if (inject === null) return;
  document.body.removeChild(inject);
}

/**
 * Change of operation mode
 */
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === AppEvent.On) {
    console.log(`content on`);
    removeScript();
    addScript();
    sendResponse();
  } else if (request.type === AppEvent.Off) {
    console.log(`content off`);
    removeScript();
    sendResponse();
  }
  return true;
});
