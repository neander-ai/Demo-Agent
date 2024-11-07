fetch('http://localhost:3001/api/flows')
      .then(response => response.json())
      .then(data => {
        const flowsContainer = document.getElementById('flows-container');

        data.flows.forEach(flow => {
          const flowCard = document.createElement('div');
          flowCard.classList.add('flow-card');

          const flowNumber = document.createElement('h2');
          flowNumber.textContent = `Event #${flow.eventNumber}`;

          const flowName = document.createElement('h3');
          flowName.textContent = flow.eventName;

          const flowDescription = document.createElement('p');
          flowDescription.textContent = flow.eventDescription;

          flowCard.appendChild(flowNumber);
          flowCard.appendChild(flowName);
          flowCard.appendChild(flowDescription);

          flowsContainer.appendChild(flowCard);
        });
      })
      .catch(error => {
        console.error('Error fetching flows:', error);
      });