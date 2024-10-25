import React from 'react';
import { Link } from 'react-router-dom';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px'
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '30px'
  },
  button: {
    padding: '12px 24px',
    margin: '10px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    textDecoration: 'none'
  }
};

function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>NenChat</h1>
      <div>
        <Link to="/onboarding" style={styles.button}>Onboarding</Link>
        <Link to="/demo" style={styles.button}>Demo</Link>
      </div>
    </div>
  );
}

export default Home;
