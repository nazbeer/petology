import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Col, Row } from "antd";
import Doctor from "../components/Doctor";
import { useNavigate } from "react-router-dom";
import PetLists from "../components/PetLists";

import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import DoctorsPetlist from "../components/DoctorsPetlist";
function GroomerHome() {
 
  const [doctorCount, setDoctorCount] = useState('');
  const [appointmentCount, setAppointmentCount] = useState('');
  const [userCount, setUserCount] = useState('');
  const [petCount, setPetCount]= useState('');
  useEffect(() =>{
    axios.get('/api/user/usercount')
    .then((response) => setUserCount(response.data.count))
    .catch((error) => console.error(error));
  },[]);
  useEffect(()=>{
    axios.get('/api/user/appointmentcount')
    .then((response) => setAppointmentCount(response.data.count))
    .catch((error) => console.error(error));
  }, []);
  useEffect(() => {
    // Fetch doctor count from the backend API
    axios.get('/api/user/doctorcount')
      .then((response) => setDoctorCount(response.data.count))
      .catch((error) => console.error(error));
  }, []);
  useEffect(()=>{
    axios.get('/api/user/petcount')
    .then((response) => setPetCount(response.data.count))
    .catch((error)=>console.error());   
  }, []);
  const dispatch = useDispatch();
    // Fetch the count from the backend API
    // const fetchDoctorsCount = async () => {
    //   try {
    //     const response = await axios.get('/api/user/count-records');
    //     console.log(response.data.data);
    //     setDoctorsCount(response.data.data.count);

    //   } catch (error) {
    //     console.error('Error fetching data:', error);
    //   }
    // };
 


  return (
    <>
    <Layout>
    <div className="col-md-12 d-lg-flex justify-content-around align-items-center gap-2 p-3 ">
      <div className="col-md-3 mb-2">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p style={{ fontSize: 16, fontWeight:"bold" }}>No of Groomers</p>
              </div>
              <div>
                <p className="font-weight-600">{doctorCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-2">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p style={{ fontSize: 16, fontWeight:"bold" }}>Total No of Appointments</p>
              </div>
              <div>
              <p>{appointmentCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-2">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p style={{ fontSize: 16, fontWeight:"bold" }}>All Users</p>
              </div>
              <div>
                <p  className="font-weight-600">{userCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-2">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p style={{ fontSize: 16, fontWeight:"bold" }}>Total Pets</p>
              </div>
              <div >
                <p className="font-weight-600">{petCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="col-md-12">
      <DoctorsPetlist/>
    </div>
    </Layout>
    </>
  );
}

export default GroomerHome;
