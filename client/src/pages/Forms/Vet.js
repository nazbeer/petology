import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { useDispatch } from "react-redux";

import "antd/dist/antd.css";

import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
// import $ from 'jquery';
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Import Bootstrap JS
import "bootstrap-datepicker/dist/css/bootstrap-datepicker3.min.css"; // Import Bootstrap Datepicker CSS
import "bootstrap-datepicker";
import OfficeTimeCalculate from "../../components/OfficeTimeCalculate";

const Vet = () => {
  const navigate = useNavigate();
  const [doctorList, setDoctorList] = useState([]);
  const [doctorId, setDoctorId] = useState("");

  const [doctor, setDoctor] = useState({});

  const [packs, setPacks] = useState({});

  const [appointmentTime, setAppointment] = useState({});

  const [doctorTime, setDoctorTime] = useState("");

  const dispatch = useDispatch();

  const [time, setTime] = useState([]);

  const getOfficeTime = () => {
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

        console.log(data);

        setTime(data);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    axios
      .get("/api/user/get-all-approved-doctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => setDoctorList(response.data.data))
      .catch((error) => console.error(error));

    axios
      .post(
        "/api/user/get-pack-by-module",
        { module: "Veterinary" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setPacks(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => console.error(error));

    getOfficeTime();
    console.log(time);
  }, []);

  // const [userDetails, setUserDetails] = useState({
  //   firstname: '',
  //   lastname: '',
  //   email: '',
  //   mobile: '',
  // });
  const [service, setService] = useState({
    module: "veterinary",
    // doctor:'',
    doctorId: "",
    service: "",
    breed: "",
    petName: "",
    age: "",
    date: "",
    time: "",
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    userId: "",
    // password:''
  });
  console.log(service.service);
  useEffect(() => {
    getAppointmentInfo(doctorId);
    getDoctorInfo(doctorId);
    // Fetch doctor list
    axios
      .get("/api/user/get-all-approved-doctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => setDoctorList(response.data.data))
      .catch((error) => console.error(error));

    // Fetch user details
    const userId = localStorage.getItem("userId"); // Get user ID from localStorage

    axios
      .get(`/api/user/user-details/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response);
        const userData = response.data.data;
        const [firstname, lastname] = userData.name.split(" ");

        setService({
          firstname: firstname,
          lastname: lastname,
          email: userData.email,
          mobile: userData.mobile,
          userId: userId,
          module: "veterinary",
        });
      })
      .catch((error) => console.error(error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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

  const getDoctorInfo = async (id, appointments) => {
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
          appointments
        );
        setDoctor(response.data.data);
      }
    } catch (error) {
      console.log(error);
      dispatch(hideLoading());
    }
  };

  const createPayment = async (userId, appointmentId, amount) => {
    try {
      dispatch(showLoading());
      console.log(doctorId);
      const response = await axios.post(
        "/api/user/pay",
        {
          userId: userId,
          appointmentId: appointmentId,
          amount: amount,
          status: "paid",
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
      }
    } catch (error) {
      console.log(error);
      dispatch(hideLoading());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(service?.doctorId);

    try {
      console.log(service);
      const response = await axios.post(
        "/api/user/user-book-appointment",
        service,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        console.log(response?.data?.data);
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
    <form onSubmit={handleSubmit}>
      <div className="card">
        <div className="card-body mb-3  ">
          <div className="row"></div>

          <div className="row">
            <div className="col-md-6">
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
                    <option value="S (Small - upto 19 Kg)">
                      S (Small - upto 19 Kg)
                    </option>
                    <option value="M (Medium - upto 30Kg)">
                      M (Medium - upto 30Kg)
                    </option>
                    <option value="L (Large - 30 to 50kg or plus)">
                      L (Large - 30 to 50kg or plus)
                    </option>
                  </select>
                </div>
              )}
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

                <div className="mb-2">
                  <label htmlFor="petName">Pet Name:</label>
                  <input
                    className="form-control"
                    type="text"
                    id="petName"
                    name="petName"
                    value={service.petName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mb-2">
                <label htmlFor="service">Choose Package: </label>
                <select
                  className="form-control"
                  id="service"
                  name="service"
                  onChange={handleChange}
                >
                  <option>Select Package...</option>
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

                  <option value="Any">Any Doctor</option>
                </select>
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
                  min={new Date().toISOString().split("T")[0]}
                  max={
                    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0]
                  }
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
          </div>
        </div>
        <div className="card-footer mt-2">
          <button type="submit" className="btn btn-success btn-sm">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};
export default Vet;
