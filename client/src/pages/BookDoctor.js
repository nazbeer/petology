import { Button, Col, DatePicker, Form, Input, Row, Select, TimePicker } from "antd";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import DoctorForm from "../components/DoctorForm";
import moment from "moment";
import booknow from '../images/booknow.png';
const { Option } = Select;

function BookDoctor() {
  const [isAvailable, setIsAvailable] = useState(false);
  const navigate = useNavigate();
  const [date, setDate] = useState();
  const [time, setTime] = useState(null);
  const [shift, setShift] =useState();
  const [selectedPet, setSelectedPet] = useState();
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const [userPets, setUserPets] = useState([]);
  const params = useParams();
  const dispatch = useDispatch();
 // console.log(userPets);
  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/get-doctor-info-by-id",
        {
          doctorId: params.doctorId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      console.log(error);
      dispatch(hideLoading());
    }
  };
  const getUserPets = async () => {
    try {
      const response = await axios.get("/api/pet/get-pets-by-user-id", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
   
      if (response.data.success) {
        setUserPets(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  const checkAvailability = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/check-booking-avilability",
        {
          doctorId: params.doctorId,
          date: date,
          time: time,
          shift: shift,
          //petId:selectedPet
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
    //  console.log(response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        setIsAvailable(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error booking appointment");
      dispatch(hideLoading());
    }
  };

  const bookNow = async () => {
    setIsAvailable(false);
    try {
      dispatch(showLoading());
      const selectedPetInfo = userPets.find(pet => pet._id === selectedPet);
     // console.log(selectedPet);
      const response = await axios.post(
        "/api/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user.userId,
          doctorInfo: doctor,
          userInfo: user,
          //petInfo: selectedPetInfo, // Only include the selected pet's info
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/user/appointmentlist');
      }
    } catch (error) {
      toast.error("Error booking appointment");
      dispatch(hideLoading());
    }
  };
  

  useEffect(() => {
    getDoctorData();
    getUserPets();
  }, []);

  return (
    <Layout>
      {doctor && (
        <div>
          <h1 className="page-title">
            Dr. {doctor.firstName} {doctor.lastName}
          </h1>
          <hr />
          <Row gutter={20} className="mt-5" align="middle">

            <Col span={8} sm={24} xs={24} lg={8}>
              <img
                src={booknow}
                alt=""
                width="100%"
               
              />
          
            </Col>
            <Col span={8} sm={24} xs={24} lg={8}>
              <div className="normal-text d-lg-flex justify-content-between align-items-center">
                <b>Timings :</b> {doctor.timings[0]} - {doctor.timings[1]}
              </div>
              <div className="d-lg-flex justify-content-between align-items-center">
                <b>Phone Number : </b>
                {doctor.phoneNumber}
              </div>
              <div className="d-lg-flex justify-content-between align-items-center">
                <b>Available Shift : </b>
                <Input  className="form-control " value={doctor.shift} onChange={(value) => setShift(value)}   style={{ width: "50%" }} disabled/>
              
              </div>
              <div className="d-lg-flex justify-content-between align-items-center">
                <b>Address : </b>
                {doctor.address}
              </div>
              <div className="d-lg-flex justify-content-between align-items-center">
                <b className="pr-3">Pet: </b>
                <select className="form-control"
              
                    onChange={(value) => setSelectedPet(value)}
                    style={{width:'50%'}}
                    >
                        {/* <option>-Select Pet-</option> */}
                    {userPets.map((pet) => (
                        <option value={pet._id} key={String(pet._id)}> 
                        {pet.pet} - {pet.breed}
                        </option>
                    ))}
                </select>

              </div>
              <div className="d-lg-flex justify-content-between align-items-center">
                <b>Fee per Visit : </b>
                {doctor.feePerCunsultation} AED
              </div>
              <div className="d-lg-flex justify-content-between align-items-center">
                <b>Website : </b>
                {doctor.website}
              </div>
              <div>
                
              </div>
              <div className="d-flex flex-column pt-2 mt-2">
                <DatePicker
                  format="DD-MM-YYYY"
                  onChange={(value) => {
                    setDate(moment(value).format("DD-MM-YYYY"));
                    setIsAvailable(false);
                  }}
                  disabledDate={(current) => {
                    return moment().add(-1, "days") >= current;
                  }}
                />
                <TimePicker
                  format="HH:mm"
                  className="mt-3"
                  onChange={(value) => {
                    setIsAvailable(false);
                    setTime(moment(value).format("HH:mm"));
                  }}
                />
                {/* {!isAvailable &&   <Button
                  className="primary-button mt-3 full-width-button"
                  onClick={checkAvailability}
                >
                  Check Availability
                </Button>} */}

                {/* {isAvailable && ( */}
                  <Button
                    className="primary-button mt-3 full-width-button"
                    onClick={bookNow}
                  >
                    Book Now
                  </Button>
                {/* )} */}
              </div>
            </Col>
           
          </Row>
        </div>
      )}
    </Layout>
  );
}

export default BookDoctor;
