import React from 'react';
import { Link } from 'react-router-dom';
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
  const sampleData = {
    scripts: {
      'script1': 'script1',
      'script2': 'script2',
      'script3': 'script3',
      'script4': 'script4',
      'script5': 'script5'
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