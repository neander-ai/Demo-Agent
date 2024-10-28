let events = [];
let stopFn = null;
let isRecording = false;

// Initialize recording state on script load
chrome.storage.local.get(['isRecording', 'recordingTabId', 'events'], async (data) => {
  if (data.isRecording && data.recordingTabId === (await getCurrentTabId())) {
    events = data.events || [];
    startRecording();
  }
});

// Auto-save events periodically
setInterval(() => {
  if (isRecording && events.length > 0) {
    chrome.storage.local.set({ events });
  }
}, 1000);

// Message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message);
  
  if (message.action === 'startRecording') {
    startRecording();
    sendResponse({ success: true });
  } else if (message.action === 'stopRecording') {
    stopRecording();
    sendResponse({ success: true });
  }
  return true; // Required for async response
});

async function getCurrentTabId() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab.id;
}

async function startRecording() {
  try {
    isRecording = true;
    chrome.runtime.sendMessage({ type: 'recordingStarted' });
    
    const data = await chrome.storage.local.get('events');
    events = data.events || [];
    
    stopFn = rrweb.record({
      emit(event) {
        events.push(event);
        if (events.length % 10 === 0) {
          chrome.storage.local.set({ events });
        }
      },
    });
  } catch (err) {
    console.error('Error starting recording:', err);
    isRecording = false;
  }
}

function stopRecording() {
  if (stopFn) {
    stopFn();
    stopFn = null;
    isRecording = false;
    
    chrome.runtime.sendMessage({ type: 'recordingStopped' });
    
    const timestamp = new Date().toISOString();
    const filename = `recording-${timestamp}.json`;
    
    const blob = new Blob([JSON.stringify(events)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    events = [];
    chrome.storage.local.remove('events');
  }
}