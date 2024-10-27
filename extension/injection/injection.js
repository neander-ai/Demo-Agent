// Load rrweb
const rrwebScript = document.createElement("script");
rrwebScript.src = "https://cdn.jsdelivr.net/npm/rrweb@latest/dist/rrweb.min.js";
document.head.appendChild(rrwebScript);

// Wait for rrweb to load
rrwebScript.onload = () => {
  // Start recording
  let events = [];
  rrweb.record({
    emit(event) {
      events.push(event);
    },
  });

  // Function to download recorded events as a JSON file
  function downloadRecording() {
    const blob = new Blob([JSON.stringify(events)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recording.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Add a button to stop recording and download
  const downloadButton = document.createElement("button");
  downloadButton.innerText = "Download Recording";
  downloadButton.style.position = "fixed";
  downloadButton.style.top = "10px";
  downloadButton.style.right = "10px";
  downloadButton.style.zIndex = 9999;
  downloadButton.onclick = () => downloadRecording();

  document.body.appendChild(downloadButton);
};
