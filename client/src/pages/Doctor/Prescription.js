import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';

const Prescription = () => {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    getPrescriptions();
  }, []);
  const getPrescriptions = async () => {
    try {
      const response = await axios.get('/api/doctor/get-prescription', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log(response.data); // Assuming the prescriptions are in response.data

      if (response.data) {
        setPrescriptions(response.data.data); // Update the state with prescriptions data
      } else {
        throw new Error('Error while fetching data');
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }

  return (
    <Layout>
      <div>
        <h3 className="text-center">All Prescriptions</h3>
        <br />
        <div className="card">
          <div className="card-body">
            <div className="table-responsive-sm">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Appointment Id</th>
                    <th>Prescription</th>
                    <th>Description</th>
                    <th>Next Appointment</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((presc) => (
                    <tr key={presc._id}>
                      <td>{presc.appointmentId}</td>
                      <td>{presc.prescription}</td>
                      <td>{presc.description}</td>
                      <td>{presc.ndate}</td>
                    
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Prescription;
