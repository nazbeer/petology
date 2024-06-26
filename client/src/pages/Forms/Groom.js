import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import "antd/dist/antd.css";
import { toast } from "react-hot-toast";
import OfficeTimeCalculate from "../../components/OfficeTimeCalculate";
const Groom = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState([]);
  const [service, setService] = useState({
    module: "grooming",
    doctorId: "",
    age: "",
    service: "",
    pet: "",
    petName: "",
    size: "",
    breed: "",
    date: "",
    time: "",
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    userId: "",
  });
  const [packs, setPacks] = useState({});

  const getOfficeTime = () => {
    axios
      .post(
        "/api/admin/get-office-time",
        { module: "groom" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
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
          60
        );

        setTime(data);
      })
      .catch((error) => console.error(error));
  };
  useEffect(() => {
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
          module: "grooming",
        });
      })
      .catch((error) => console.error(error));

    axios
      .post(
        "/api/user/get-pack-by-module",
        { module: "Grooming" },
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

    try {
      const response = await axios.post(
        "/api/user/user-book-appointment",
        service,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      //console.log('service saved successfully:', response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        const appointments = response?.data?.data;
        if (appointments?.paytab?.redirect_url) {
          localStorage.setItem("transId", appointments?.paytab?.tran_ref);
          window.location.href = appointments?.paytab?.redirect_url;
        } else {
          navigate("/user/payment-decline", {
            state: { service, appointments },
          });
        }
      }
    } catch (error) {
      toast.error("Error in adding New Appointment.");
      //dispatch(hideLoading());
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card">
        <div className="card-body mb-3 ">
          <div className="row ">
            <div className="col-md-6">
              <div className="mb-2 d-none">
                <label htmlFor="doctor">Choose Doctor: </label>
                <select
                  className="form-control p-0"
                  id="doctor"
                  name="doctorId"
                  onChange={handleChange}
                  style={{ height: "45px" }}
                >
                  <option value="Null">Null</option>
                </select>
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
              </div>
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
                  <option>Select Time...</option>
                  {time.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
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

export default Groom;
