const form = document.getElementById('scenario-form');
const urlParams = new URLSearchParams(window.location.search);
const filename = urlParams.get('filename');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Collect form data as usual
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries()); 

  // Get the large JSON from chrome.storage.local
  const largeJSON = await chrome.storage.local.get("file");
  console.log("file", largeJSON);
  
  // Combine form data and large JSON
  const combinedData = {
    filename: filename,  // Add the filename
    formData: data,      // Add form data
    largeJSON: largeJSON["file"],  // Add the large JSON data
  };

  // Convert combined data to JSON string and create a Blob
  const jsonString = JSON.stringify(combinedData);
  const jsonBlob = new Blob([jsonString], { type: 'application/json' });

  // Send the data to the server
  const url = 'http://localhost:3001/api/addEvent';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // We are sending JSON data
    },
    body: jsonBlob,
  });

  if (response.ok) {
    console.log('File sent successfully');
    // Optionally remove the large JSON from storage after sending
    chrome.storage.local.remove(filename);
  } else {
    console.error('Error sending file:', response.statusText);
  }
});
