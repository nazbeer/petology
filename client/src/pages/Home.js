import React from 'react';
import Layout from '../components/Layout';
import logo from '../images/logo-petology.png';
const Home = () => {
  return (
    <Layout>
    <div className='d-lg-block text-center py-4'>
      <img src={logo} alt="Petology" className='mt-4 mb-4 logoimg'/>
      <h1 className='mt-4 mb-4'>Welcome to the Dashboard!</h1>
      
    </div>
    </Layout>
  );
};

export default Home;
