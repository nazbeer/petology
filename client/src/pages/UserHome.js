import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Col, Row } from "antd";
import Doctor from "../components/Doctor";
import PetLists from "../components/PetLists";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import AppointmentCharts from "./AppointmentCharts";
function Home() {
  const [doctors, setDoctors] = useState([]);
  const [pets, setPets]= useState([]);
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

  const getData = async () => {
    try {
      dispatch(showLoading())
      const response = await axios.get("/api/user/get-all-approved-doctors", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      dispatch(hideLoading())
      if (response.data.success) {
        setDoctors(response.data.data);
        // const approvedD = response.data;
        // setApprovedDoctors(approvedD);
      }
    } catch (error) {
      dispatch(hideLoading())
    }
  };
  
  const getPetData = async () => {
    try {
      dispatch(showLoading())
      const response = await axios.get("/api/pet/get-all-pets", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      dispatch(hideLoading())
      if (response.data.success) {
        setPets(response.data.data);
        // const approvedD = response.data;
        // setApprovedDoctors(approvedD);
      }
    } catch (error) {
      dispatch(hideLoading())
    }
  };

  useEffect(() => {
    getData();
    getPetData();
  
  }, []);



  return (
    <>
    <Layout>
    <div className="col-md-12 d-lg-flex justify-content-around align-items-center gap-2 p-3">
      <div className="col-md-3 mb-2">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p style={{ fontSize: 16, fontWeight:"bold" }}>No of Doctors</p>
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
      <AppointmentCharts/>
    </div>
    <div className="p-2">
       <div><h3>Doctor's List</h3></div>
      <Row gutter={20}>
        {doctors.map((doctor) => (
          <Col span={4} xs={24} sm={24} lg={8}>
            <Doctor doctor={doctor} />
          </Col>
        ))}
      </Row>
      {/* <div className="col-md-12"><h3>Pet's List</h3></div>
      <Row gutter={20}>
        {pets.map((pet) => (
          <Col span={8} xs={24} sm={24} lg={8}>
            <PetLists pet={pet} />
          </Col>
        ))}
      </Row> */}
      </div>
    
    </Layout>
    </>
  );
}

export default Home;
