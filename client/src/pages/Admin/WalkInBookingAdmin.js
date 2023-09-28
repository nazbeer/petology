import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { toast } from "react-hot-toast";
import { showLoading, hideLoading } from "../../redux/alertsSlice";

import Header from "../../frontend_components/Header";
import Footer from "../../frontend_components/Footer";
import Layout from "../../components/Layout";
import OfficeTimeCalculate from "../../components/OfficeTimeCalculate";

const WalkInBookingAdmin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [doctorList, setDoctorList] = useState([]);
  const [time, setTime] = useState([]);
  const [service, setService] = useState({
    module: "Veterinary",
    // doctor:'',
    doctorId: "",
    breed: "",
    service: "",
    package: "",
    age: "",
    petName: "",
    pet: "",
    date: "",
    time: "",
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    userId: "",
    isWalkin: true,
    // password:''
  });

  const [doctorId, setDoctorId] = useState("");

  const [doctor, setDoctor] = useState({});

  const [appointment, setAppointment] = useState({});

  const [doctorTime, setDoctorTime] = useState("");

  const doctorAvailable = (startTime, endTime, timeList, appointments) => {
    const data = OfficeTimeCalculate(startTime, endTime, 1, 0);
    console.log(data);

    // Convert list1 to a Set for faster lookup
    const setList1 = new Set(timeList);

    // Filter values from list2 that are present in list1
    const filteredList = data.filter((value) => setList1.has(value));

    // Filter out elements from firstList that are present in secondList
    if (appointments.length > 0) {
      const finalList = filteredList.filter(
        (item) => !appointments.includes(item)
      );
      setDoctorTime(finalList);

      return finalList;
    }
  };

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    getAppointmentInfo(e.target.value);
    setDoctorId(doctorId);
    console.log(doctorId);
    setService((prevState) => ({
      ...prevState,
      doctorId: doctorId,
    }));

    // getDoctorInfo(e.target.value);
  };

  const getAppointmentInfo = async (id) => {
    try {
      dispatch(showLoading());
      console.log(doctorId);
      const response = await axios.post(
        "/api/user/get-appointments-by-doctor-id",
        {
          doctorId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      if (response.data.success) {
        console.log(response.data.data);
        const appointments = response.data.data.map((item) => {
          return timeFormat(item.time);
        });
        setAppointment(appointments);
        getDoctorInfo(id, appointments);
      }
    } catch (error) {
      console.log(error);
      dispatch(hideLoading());
    }
  };

  const timeFormat = (value) => {
    let [hour, minute] = value.split(":").map(Number);
    let amPm = "AM";
    minute = String(minute).padStart(2, "0");
    if (hour >= 12) {
      amPm = "PM";
      if (hour > 12) {
        hour -= 12;
      }
    }
    hour = String(hour);
    return `${hour}:${minute} ${amPm}`;
  };

  const getDoctorInfo = async (id, appointment) => {
    try {
      dispatch(showLoading());
      console.log(doctorId);
      const response = await axios.post(
        "/api/doctor/get-doctor-info-by-id",
        {
          doctorId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      if (response.data.success) {
        console.log(response.data.data);

        doctorAvailable(
          response?.data?.data?.starttime,
          response?.data?.data?.endtime,
          time,
          appointment
        );
        setDoctor(response.data.data);
      }
    } catch (error) {
      console.log(error);
      dispatch(hideLoading());
    }
  };

  const getOfficeTime = (module) => {
    axios
      .post(
        "/api/admin/get-office-time",
        { module: "vet" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(
          response?.data?.data?.starttime,
          response?.data?.data?.endtime,
          response?.data?.data?.break
        );
        const data = OfficeTimeCalculate(
          response?.data?.data?.starttime,
          response?.data?.data?.endtime,
          response?.data?.data?.break,
          30
        );

        setTime(data);
      })
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    getAppointmentInfo(doctorId);
    getDoctorInfo(doctorId);
    axios
      .get("http://localhost:5000/api/open/get-all-approved-doctors", {
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem("token")}`,
        // },
      })
      .then((response) => setDoctorList(response.data.data))
      .catch((error) => console.error(error));

    getOfficeTime();
  }, []);

  const [vetPackage, setVetPackage] = useState([]);
  const [grromPackage, setGroomPackage] = useState([]);

  const getVetPackage = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/admin/get-all-vet-packs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        console.log(response.data.data);
        setVetPackage(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const getGroomPackage = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/admin/get-all-groom-packs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        console.log(response.data.data);
        setGroomPackage(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  console.log(service);

  useEffect(() => {
    getVetPackage();
    getGroomPackage();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    service.isWalkin = true;
    console.log(service);
    try {
      const response = await axios.post(
        "/api/reception/user-book-appointment",
        service,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        const appointments = response?.data?.data;

        navigate("/user/payment-successful", {
          state: { service, appointments },
        });
        // Do something else, like navigating to another page
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in booking appointment.");
    }
  };
  return (
    <>
      <Layout>
        {/* <main className="bg-vet"> */}
        <div className="container veh-100 mt-4 mb-4">
          <form onSubmit={handleSubmit}>
            <div className="card">
              <div className="card-header">
                <h3>WalkIn Booking Appointment</h3>
              </div>
              <div className="card-body mb-3  ">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-2">
                      <label htmlFor="service">Choose Service: </label>
                      <select
                        className="form-control"
                        id="service"
                        name="service"
                        onChange={handleChange}
                        required
                      >
                        <option>Select Service...</option>
                        <option value="Veterinary">Veterinary</option>
                        <option value="Grooming">Grooming</option>
                      </select>
                    </div>
                  </div>
                </div>

                {service.service === "Veterinary" && (
                  <div className="mb-2">
                    <label htmlFor="package">Choose Package: </label>
                    <select
                      className="form-control"
                      id="package"
                      name="package"
                      onChange={handleChange}
                    >
                      <option>Select Package...</option>
                      {vetPackage &&
                        vetPackage.map((data, key) => {
                          return (
                            <option key={data.key} value={data._id}>
                              {data.subService}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                )}

                {service.service === "Grooming" && (
                  <div className="mb-2">
                    <label htmlFor="package">Choose Package: </label>
                    <select
                      className="form-control"
                      id="package"
                      name="package"
                      onChange={handleChange}
                    >
                      <option>Select Package...</option>
                      {grromPackage &&
                        grromPackage.map((data, key) => {
                          return (
                            <option key={data.key} value={data._id}>
                              {data.subService}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                )}

                <div className="row">
                  <div className="col-md-6">
                    {service.service === "Veterinary" && (
                      <div className="mb-2">
                        <label htmlFor="doctor">Choose Doctor: </label>
                        <select
                          className="form-control"
                          id="doctor"
                          name="doctorId"
                          onChange={handleDoctorChange}
                        >
                          <option>Select Doctor...</option>
                          {doctorList &&
                            doctorList.map((data, key) => {
                              return (
                                <option key={data.key} value={data._id}>
                                  Dr. {data.firstName}
                                </option>
                              );
                            })}

                          {/* <option value={service.doctor}>Hair Cut</option>
              <option value={service.doctor}>Bath</option>     */}
                          <option value="Any">Any Doctor</option>
                        </select>
                        {/* {doctorList &&
               doctorList.map((data, key) => { 
                return(<input type='hidden' value={data._id} name='doctorId'/>
                );
    
              })
               } */}
                      </div>
                    )}

                    <div className="mb-2">
                      <label htmlFor="size">Choose Pet: </label>
                      <select
                        className="form-control"
                        id="pet"
                        name="pet"
                        onChange={handleChange}
                      >
                        <option defaultValue="">Select Pet...</option>
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                        <option value="Bird">Bird</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    {service.pet === "Dog" && (
                      <div className="mb-2">
                        <label htmlFor="size">Choose Size: </label>
                        <select
                          className="form-control"
                          id="size"
                          name="size"
                          onChange={handleChange}
                        >
                          <option defaultValue="">Select size...</option>
                          <option value="S (Small)">S (Small)</option>
                          <option value="M (Medium)">M (Medium)</option>
                          <option value="L (Large)">L (Large)</option>
                        </select>
                      </div>
                    )}
                    <div className="mb-2">
                      <label htmlFor="PetName">Pet Name:</label>
                      <input
                        className="form-control"
                        type="text"
                        id="PetName"
                        name="PetName"
                        value={service.petName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-2">
                      <label htmlFor="Age">Age:</label>
                      <input
                        className="form-control"
                        type="text"
                        id="Age"
                        name="Age"
                        value={service.age}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-2">
                      <label htmlFor="breed">Breed:</label>
                      <input
                        className="form-control"
                        type="text"
                        id="breed"
                        name="breed"
                        value={service.breed}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-2">
                      <label htmlFor="date">Date:</label>
                      <input
                        className="form-control"
                        type="date"
                        id="date"
                        name="date"
                        value={service.date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-2">
                      <label htmlFor="firstname">First Name:</label>
                      <input
                        className="form-control"
                        type="text"
                        id="firstname"
                        name="firstname"
                        value={service.firstname}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label htmlFor="lastname">Last Name:</label>
                      <input
                        className="form-control"
                        type="text"
                        id="lastname"
                        name="lastname"
                        value={service.lastname}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label htmlFor="email">Email:</label>
                      <input
                        className="form-control"
                        type="email"
                        id="email"
                        name="email"
                        value={service.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label htmlFor="mobile">Mobile Number:</label>
                      <input
                        className="form-control"
                        type="text"
                        id="mobile"
                        name="mobile"
                        value={service.mobile}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label htmlFor="time">Time:</label>

                      <select
                        className="form-control"
                        id="time"
                        name="time"
                        onChange={handleChange}
                      >
                        {service.doctorId === "Any" ||
                        service.service === "Grooming" ? (
                          time.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))
                        ) : doctorTime.length > 0 ? (
                          doctorTime.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))
                        ) : (
                          <option>Fully Booked</option>
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer mt-2">
                <button type="submit" className="btn btn-success btn-sm">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
        <Footer />
        {/* </main> */}
      </Layout>
    </>
  );
};

export default WalkInBookingAdmin;
