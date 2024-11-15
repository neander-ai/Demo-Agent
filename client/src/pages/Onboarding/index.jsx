import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import GraphBuilder from './scriptGraph';

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '20px'
  },
  backButton: {
    padding: '8px 16px',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: '#666',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    textDecoration: 'none',
    display: 'inline-block',
    marginTop: '20px'
  },

  graph:{
    width: '100%',
    height: '100vh',
    background: '#282c34',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  }
};

function Onboarding() {
  const [Data, setData] = useState({});

  // useEffect(() => {
  //   fetch('http://localhost:3001/api/onboarding/sampledatapoint')
  //     .then(response => response.json())
  //     .then(data => setData(data));
  // }, []);
  
  const sampleData = {
    "scripts": {
      "scriptID1": {
        name: 'Explore web design page',
        heading: 'Explore the web design page',
        description: 'Explore the web design page and start designing'
      },
      "scriptID2": {
        name: 'Signup',
        heading: 'Signup creating a new account',
        description: 'Signup by adding your details'
      },
      "scriptID3": {
        name: 'Look for templates',
        heading: 'Template searching',
        description: 'Look for templates and select one you like'
      },
      "scriptID4": {
        name: 'Logging In',
        heading: 'Logging to the wix account',
        description: 'Logging into the wix page to get things working'
      },
      // "scriptID5": {
      //   "name": "select countries to apply discount",
      //   "heading": "select countries to apply discount",
      //   "description": "Click on selected countries radius button and an input text box opens up. Clicking on it opens up a dialog box and select the countries you want to apply the discount by typing into input text box the name of the country and autocompleting it out",
      // },
      // "scriptID6": {
      //   "name": "input minimum purchase amount",
      //   "heading": "input minimum purchase amount",
      //   "description": "click on minimum purchase amount radius button and then in the input box that opens up, type out the minimum purchase amount you want to apply the discount on.",
        
      // },
      // "scriptID7": {
      //   "name": "select customer segments",
      //   "heading": "select customer segments",
      //   "description": "Under customer eligibility section, click on adding specific customer segments and then select the required customer segment. Customer segments are things like 'Email Subscribers' or 'Customers who have purchased atleast once' or 'Customers who have spent more than $1000'.",
        
      // },
      // "scriptID8": {
      //   "name": "add limit on discount uses",
      //   "heading": "add limit on discount uses",
      //   "description": "Under maximum discount uses section, click on the check box to 'add limit on maximum number of uses per customer'. Then an input box opens up and you can type in the maximum number of uses per customer.",
        
      // },
      // "scriptID9": {
      //   "name": "set an end date for discount",
      //   "heading": "set an end date for discount",
      //   "description": "Under active dates section, click on set end date check box and click on end date 'date selector' and select date, do the same for time.",
        
      // },
      // "scriptID10": {
      //   "name": "click on save button for discount",
      //   "heading": "click on save button for discount",
      //   "description": "Click on save discount button at the bottom right corner of the page and wait for the discount to be created.",
        
      // }
    }
  }
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Onboarding Page</h1>
      <p>Welcome to the onboarding experience!</p>
      <GraphBuilder scriptData={sampleData} style={styles.graph}/>
      <Link to="/" style={styles.backButton}>Back to Home</Link>
    </div>
  );
}

export default Onboarding;