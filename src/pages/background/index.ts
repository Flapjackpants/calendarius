chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'login') {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        sendResponse({ success: false });
      } else {
        console.log('Token retrieved:', token);
        sendResponse({ success: true, token });
      }
    });
    return true; // needed for async sendResponse
  }
});
