// BreakTime.js
import Layout from "../../components/Layout";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const BreakTime = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [duration, setDuration] = useState('');
  const [breakTimes, setBreakTimes] = useState([]);

  useEffect(() => {
    fetchDoctors();
    fetchBreakTimes();
  }, []);

  const fetchBreakTimes = async () => {
    try {
      const response = await axios.get("/api/admin/get-all-breaktimes",  {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(response.data);
      setBreakTimes(response.data);
    } catch (error) {
      console.error("Error fetching break times:", error);
    }
  };
  const fetchDoctors = async () => {
    try {
      const response = await axios.get("/api/admin/get-all-approved-doctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(response.data);
      setDoctors(response.data.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/admin/set-break-time', {
        doctorId: selectedDoctor,
        duration: duration
      });

      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error('Error setting break time.');
    }
  };
  
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/admin/delete-breaktime/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchBreakTimes();
      }
    } catch (error) {
      toast.error("Error deleting break time.");
    }
  };

  return (
    <Layout>
      <div className="card">
        <div className="card-header">
          <h5 className='mb-0'>Set Break Time</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="col-md-12 mb-3">
              <label htmlFor="doctors">Select Doctors:</label>
            </div>
            <div className="col-md-3 mb-3">
              <select
                name="doctor"
                className="form-control"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
              >
                <option value="">Select Doctor...</option>
                {doctors.map(doctor => (
                  <option key={doctor._id} value={doctor._id}>
                 Dr. {doctor.firstName} {doctor.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-12 mb-3">
              <label htmlFor="duration">Select Duration:</label>
            </div>
            <div className="col-md-3  mb-3">
              <select
                id="duration"
                name="duration"
                className="form-control"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                <option value="">Select duration...</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>
            <div className="col-md-12  mb-3">
              <button type="submit" className="btn btn-success btn-sm"  >Set Break Time</button>
            </div>
          </form>
        </div>
      </div>
      <div className="card mt-4">
        <div className="card-header">
          <h5 className="mb-0">Break Times and Doctor Details</h5>
        </div>
        <div className="card-body">
          <div className="col-md-12 mb-3">
            <h6>Break Times and Doctor Details:</h6>
            <table className="table">
              <thead>
                <tr>
                  <th>Doctor Name</th>
                  <th>Duration (minutes)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {breakTimes.map((breakTime) => (
                  <tr key={breakTime._id}>
                    <td>Dr. {breakTime.doctorName} <small>({breakTime.doctorId})</small></td>
                    <td>{breakTime.duration}</td>
                    <td className="text-center"><button className="btn btn-danger btn-sm" type="button" onClick={() => handleDelete(breakTime._id)}><i className="ri-delete-bin-line"></i></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default BreakTime;
