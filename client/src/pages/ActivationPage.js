// ActivationPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActivationPage = ({ match }) => {
  const [activationStatus, setActivationStatus] = useState('Activating...');

  useEffect(() => {
    // Get the activation token from the URL params
    const { token } = match.params;

    // Send a request to your server to activate the email
    axios
      .get(`/api/activate?token=${token}`)
      .then((response) => {
        if (response.data === 'Activation successful') {
          setActivationStatus('Activation successful');
        } else {
          setActivationStatus('Invalid activation token');
        }
      })
      .catch((error) => {
        console.error('Error activating email:', error);
        setActivationStatus('Error activating email');
      });
  }, [match.params]);

  return (
    <div>
      <h2>Email Activation</h2>
      <p>{activationStatus}</p>
    </div>
  );
};

export default ActivationPage;
