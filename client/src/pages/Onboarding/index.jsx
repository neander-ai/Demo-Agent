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
        "scripts":{
            "scriptID1": {
                "name": "scriptname1",
                "heading": "clicking on add product",
                "description": "Click on products tab on the left hand side and then click on add products button on the top right corner of the page. Wait for redirect to the product addition page."
            },
            "scriptID2": {
                "name": "scriptname2",
                "heading": "clicking on add product",
                "description": "Click on products tab on the left hand side and then click on add products button on the top right corner of the page. Wait for redirect to the product addition page."
            },
            "scriptID3": {
                "name": "scriptname3",
                "heading": "clicking on add product",
                "description": "Click on products tab on the left hand side and then click on add products button on the top right corner of the page. Wait for redirect to the product addition page."
            },
            "scriptID4": {
                "name": "scriptname4",
                "heading": "clicking on add product",
                "description": "Click on products tab on the left hand side and then click on add products button on the top right corner of the page. Wait for redirect to the product addition page."
            }
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