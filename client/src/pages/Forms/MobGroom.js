import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { toast } from "react-hot-toast";
import bootstrap from "react-bootstrap";
import {
  GoogleMap,
  Marker,
  LoadScript,
  Autocomplete,
} from "@react-google-maps/api";
const MobGroom = () => {
  const [autocomplete, setAutocomplete] = useState(null);

  const [subservices, setSubservices] = useState([]);

  const [location, setLocation] = useState({ lat: 25.2048, lng: 55.2708 });

  const navigate = useNavigate();
  const [service, setService] = useState({
    module: "mobile_grooming",
    doctor: null,
    doctorId: null,
    service: "",
    age: "",
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
    lat: "",
    lng: "",
  });

  useEffect(() => {
    // Fetch sub-services from your Express.js API
    axios
      .get("/api/user/subservices1", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log("subservices:", response.data.data);
        if (response.data.success) {
          setSubservices(response.data.data);
        } else {
          console.error("Failed to fetch sub-services");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    const userId = localStorage.getItem("userId"); // Get user ID from localStorage

    axios
      .get(`/api/user/user-details/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        // console.log(response);
        const userData = response.data.data;
        const [firstname, lastname] = userData.name.split(" ");

        setService({
          firstname: firstname,
          lastname: lastname,
          email: userData.email,
          mobile: userData.mobile,
          userId: userId,
          service: subservices,
          module: "mobile_grooming",
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
  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setLocation({ lat, lng });
        setService((prevState) => ({
          ...prevState,
          lat,
          lng,
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Service state before POST request:", subservices);
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

      console.log(
        "New mob grooming appointment successfully saved:",
        response.data.data
      );
      if (response.data.success) {
        toast.success(response.data.message);
        const appointments = response?.data?.data;
        navigate("/user/payment-successful", {
          state: {service, appointments },
        });
        //navigate('/appointments');
      }
      // Do something with the response, like showing a success message
    } catch (error) {
      toast.error("Error in adding Mobile Veterinary Appointment.");
      //dispatch(hideLoading());
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="card">
        <div className="card-body mb-3  ">
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

              {service.pet === "Other" && (
                <div className="mb-2">
                  <label htmlFor="otherPet">Other Pet: </label>
                  <input
                    className="form-control"
                    type="text"
                    id="otherpet"
                    name="otherpet"
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
              {service.pet === 'Dog' && (
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
                <label htmlFor="service">Chosen Package: </label>
                <select
                  className="form-control"
                  id="service"
                  name="service"
                  onChange={handleChange}
                >
                  <option defaultValue="">Select Package...</option>
                  {subservices.length > 0 ? (
                    
                    subservices.map((subservice, index) => (
                      <option key={index} value={subservice._id}>
                        {subservice.subService} - Price: ({subservice.price} AED)
                      </option>
                    ))
                  ) : (
                    <option value="NA">No Package available</option>
                  )}
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
                  value={service.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor="time">Time:</label>
                <input
                  className="form-control"
                  type="time"
                  id="time"
                  name="time"
                  value={service.time}
                  onChange={handleChange}
                  required
                />
              </div>
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
            </div>
            <div className="col-md-6 mb-3">
              <div className="mb-2">
                <label htmlFor="location">Location:</label>

                <div
                  style={{
                    width: "100%",
                    height: "400px",
                    borderRadius: "6px",
                  }}
                >
                  <GoogleMap
                    mapContainerStyle={{
                      width: "100%",
                      height: "98%",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                    center={{ lat: location.lat, lng: location.lng }}
                    zoom={14}
                  >
                    {location.lat && location.lng && (
                      <Marker
                        position={{ lat: location.lat, lng: location.lng }}
                        draggable={true} // Make the marker draggable
                        onDragEnd={(e) => {
                          const lat = e.latLng.lat();
                          const lng = e.latLng.lng();
                          setLocation({ lat, lng });
                          setService((prevState) => ({
                            ...prevState,
                            lat,
                            lng,
                          }));
                        }}
                      />
                    )}

                    <Autocomplete
                      onLoad={(autocomplete) => {
                        setAutocomplete(autocomplete);
                      }}
                      onPlaceChanged={onPlaceChanged}
                    >
                      <input
                        type="text"
                        placeholder="Search for a location"
                        style={{
                          boxSizing: "border-box",
                          border: "1px solid transparent",
                          width: "240px",
                          height: "32px",
                          padding: "12px 12px",
                          borderRadius: "6px",
                          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                          fontSize: "12px",
                          outline: "none",
                          textOverflow: "ellipses",
                          position: "absolute",
                          marginLeft: "10px",
                          marginTop: "55px",
                          justifyContent: "center",
                        }}
                        required
                      />
                    </Autocomplete>
                  </GoogleMap>
                </div>
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
export default MobGroom;
