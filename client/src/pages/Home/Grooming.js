// src/components/Grooming.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Header from "../../frontend_components/Header";
import Footer from "../../frontend_components/Footer";
import OfficeTimeCalculate from "../../components/OfficeTimeCalculate";

const Grooming = () => {
  const [time, setTime] = useState([]);
  const [packs, setPacks] = useState("");

  const [service, setService] = useState({
    module: "Grooming",
    service: "",
    pet: "",
    size: "",
    age: "",
    breed: "",
    date: "",
    time: "",
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
  });

  useEffect(() => {
    axios
      .post(
        "http://localhost:5000/api/open/get-pack-by-module",
        { module: "Grooming" },
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/open/book-appointment", service);

      //console.log('service saved successfully:', response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        //navigate('/appointments');
      }
      // Do something with the response, like showing a success message
    } catch (error) {
      toast.error(error.response.data.message);
      //dispatch(hideLoading());
    }
  };

  return (
    <main className="bg-grooming">
      <Header />
      <div className="container veh-100 mt-4 mb-4">
        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="card-header">
              <h3>Book Grooming</h3>
            </div>
            <div className="card-body mb-3 ">
              <div className="row ">
                <div className="col-md-6">
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
              <div className="col-md-12">
                <small className=" text-danger">
                  The password will be autogenerated and will be sent to your
                  registered email id with the login link.
                </small>
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

export default Grooming;
