import React from 'react';
import { useParams } from 'react-router-dom';
import ProfilePage from './ProfilePage';
import Layout from '../../components/Layout';

const Profile = () => {
  const { userId } = useParams();

  return (
    <Layout>
    <div>
      <h1>Receptionist Profile Page</h1>
      <ProfilePage userId={userId} />
    </div>
    </Layout>
  );
};

export default Profile;
