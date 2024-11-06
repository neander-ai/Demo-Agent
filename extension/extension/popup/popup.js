let currentTabId = null;

function setStatus(message) {
  document.getElementById('status').textContent = message;
}

function updateButtonState(button, isRecording) {
  button.textContent = isRecording ? 'Stop Recording' : 'Start Recording';
  if (isRecording) {
    button.classList.add('recording');
  } else {
    button.classList.remove('recording');
  }
}

async function initializePopup() {
  const button = document.getElementById('toggleRecord');
  
  try {
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTabId = tab.id;
    
    // Check if we can inject scripts into this tab
    if (!tab.url.startsWith('http')) {
      setStatus('Recording not available on this page');
      button.disabled = true;
      return;
    }

    // Ensure content script is injected
    const response = await chrome.runtime.sendMessage({
      type: 'ensureInjected',
      tabId: currentTabId
    });

    if (!response.success) {
      setStatus('Failed to initialize recording');
      button.disabled = true;
      return;
    }

    // Check current recording state
    const { isRecording } = await chrome.storage.local.get('isRecording');
    updateButtonState(button, isRecording);
    
  } catch (err) {
    console.error('Initialization error:', err);
    setStatus('Error initializing recorder');
    button.disabled = true;
  }
}

document.addEventListener('DOMContentLoaded', initializePopup);

document.getElementById('toggleRecord').addEventListener('click', async () => {
  const button = document.getElementById('toggleRecord');
  const { isRecording } = await chrome.storage.local.get('isRecording');
  
  try {
    if (!isRecording) {
      await chrome.tabs.sendMessage(currentTabId, { action: 'startRecording' });
      updateButtonState(button, true);
      setStatus('Recording started');
    } else {
      await chrome.tabs.sendMessage(currentTabId, { action: 'stopRecording' });
      updateButtonState(button, false);
      setStatus('Recording saved');
    }
  } catch (err) {
    console.error('Recording toggle error:', err);
    setStatus('Error toggling recording');
  }
});


document.getElementById('newProduct').addEventListener('click', () => {
  chrome.tabs.create({
      url: chrome.runtime.getURL('product/product.html')
  });
});