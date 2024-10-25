import React from 'react';
import { Link } from 'react-router-dom';

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
  }
};

function Demo() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Demo Page</h1>
      <p>This is the demo section of the application.</p>
      <Link to="/" style={styles.backButton}>Back to Home</Link>
    </div>
  );
}

export default Demo;