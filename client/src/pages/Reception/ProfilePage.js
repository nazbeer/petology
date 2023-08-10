import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = ({ userId }) => {
  const [receptionist, setReceptionist] = useState(null);

  useEffect(() => {
    axios.get(`/reception/profile/${userId}`)
      .then(response => {
        if (response.data.success) {
          setReceptionist(response.data.data);
        }
      })
      .catch(error => console.error(error));
  }, [userId]);

  return (
    <div>
      {receptionist ? (
        <div>
          <h2>Receptionist Profile</h2>
          <p>Name: {receptionist.name}</p>
          <p>Email: {receptionist.email}</p>
          {/* Add more profile fields here */}
        </div>
      ) : (
        <p>Loading receptionist profile...</p>
      )}
    </div>
  );
};

export default ProfilePage;
