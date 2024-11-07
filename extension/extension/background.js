let recordingTabId = null;

// Handle content script injection
async function ensureContentScriptInjected(tabId) {
  try {
    // Inject rrweb first
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['libs/rrweb.min.js']
    });
    
    // Then inject our content script
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content.js']
    });
    
    return true;
  } catch (err) {
    console.error('Script injection failed:', err);
    return false;
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'recordingStarted') {
    recordingTabId = sender.tab.id;
    chrome.storage.local.set({ 
      isRecording: true,
      recordingStartTime: Date.now(),
      recordingTabId: recordingTabId
    });
  } else if (message.type === 'recordingStopped') {
    recordingTabId = null;
    chrome.storage.local.set({ 
      isRecording: false,
      recordingTabId: null 
    });
    chrome.tabs.create({
      url: chrome.runtime.getURL(`recording/recording.html?filename=${message.filename}`),
    });
  } else if (message.type === 'ensureInjected') {
    ensureContentScriptInjected(message.tabId)
      .then(success => sendResponse({ success }));
    return true; // Important: indicates we will send response asynchronously
  }
});
