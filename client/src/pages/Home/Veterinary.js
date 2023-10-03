// src/components/Veterinary.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Header from "../../frontend_components/Header";
import Footer from "../../frontend_components/Footer";

import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { useDispatch } from "react-redux";
import OfficeTimeCalculate from "../../components/OfficeTimeCalculate";

const Veterinary = () => {
  const [doctorList, setDoctorList] = useState([]);
  const [time, setTime] = useState([]);
  const dispatch = useDispatch();

  const [service, setService] = useState({
    module: "Veterinary",
    // doctor:'',
    doctorId: "",
    breed: "",
    age: "",
    date: "",
    time: "",
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    // password:''
  });

  const [doctorId, setDoctorId] = useState("");

  const [doctor, setDoctor] = useState({});

  const [appointment, setAppointment] = useState({});

  const [doctorTime, setDoctorTime] = useState("");
  const [packs, setPacks] = useState("");

  const getOfficeTime = () => {
    axios
      .post("/api/open/get-office-time", { module: "vet" })
      .then((response) => {
        console.log(
          response?.data?.data?.starttime1,
          response?.data?.data?.endtime2,
          response?.data?.data?.break
        );
        const data = OfficeTimeCalculate(
          response?.data?.data?.starttime1,
          response?.data?.data?.endtime2,
          response?.data?.data?.break,
          30
        );

        console.log(data);

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

    axios
      .post(
        "http://localhost:5000/api/open/get-pack-by-module",
        { module: "Veterinary" },
        {
          // headers: {
          //   Authorization: `Bearer ${localStorage.getItem("token")}`,
          // },
        }
      )
      .then((response) => setPacks(response.data.data))
      .catch((error) => console.error(error));

    getOfficeTime();
    console.log(time);
  }, []);

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
        "/api/open/get-appointments-by-doctor-id",
        {
          doctorId: id,
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
      const response = await axios.post("/api/open/get-doctor-info-by-id", {
        doctorId: id,
      });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/open/book-appointment", service);

      if (response.data.success) {
        toast.success(response.data.message);
        // Do something else, like navigating to another page
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <main className="bg-vet">
      <Header />
      <div className="container veh-100 mt-4 mb-4">
        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="card-header">
              <h3>Book Appointment in Clinic</h3>
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
                    >
                      <option defaultValue="">Select Service...</option>
                      {packs.length > 0 &&
                        packs.map((data, key) => {
                          return (
                            <option key={data.key} value={data._id}>
                              {data.subService} - Price: {data.price} AED
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
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
                        <option value={service.size}>S (Small)</option>
                        <option value={service.size}>M (Medium)</option>
                        <option value={service.size}>L (Large)</option>
                      </select>
                    </div>
                  )}
                  <div className="mb-2">
                    <label htmlFor="age">Age:</label>
                    <input
                      className="form-control"
                      type="text"
                      id="age"
                      name="age"
                      value={service.age}
                      onChange={handleChange}
                    />
                  </div>
                  {/* <div className='mb-2'>
          <label htmlFor="dimension">Dimension (1.5x2 Ft):</label>
          <input className="form-control" 
            type="text"
            id="dimension"
            name="dimension"
            value={service.dimension}
            onChange={handleChange}
            required
          />
        </div> */}
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
                      min={new Date().toISOString().split("T")[0]}
                      max={
                        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                          .toISOString()
                          .split("T")[0]
                      }
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
                      {service.doctorId === "Any" ? (
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
                <div className="col-md-12">
                  <small className=" text-danger">
                    The password will be autogenerated and will be sent to your
                    registered email id with the login link.
                  </small>
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
    </main>
  );
};

export default Veterinary;
