// src/components/PetForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import jwt_decode from "jwt-decode";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const PetForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let counter = 1; // Initialize the counter

  const generateCustomID = () => {
    const formattedDate = moment().format("YYYYMMDD");
    const customID = `${formattedDate}-1${counter.toString().padStart(6, "0")}`;
    counter++; // Increment the counter for the next ID
    return customID;
  };
  const [users, setUsers] = useState([]);
  const [pet, setPet] = useState({
    userID: "",
    pet: "",
    size: "",
    breed: "",
    image: null,
    custompetId: generateCustomID(),
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPet((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPet((prevState) => ({
      ...prevState,
      image: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("pet", pet.pet);
    formData.append("size", pet.size);
    formData.append("breed", pet.breed);
    formData.append("image", pet.image);
    formData.append("userID", pet.userID);
    formData.append("custompetId", pet.custompetId);

    try {
      //dispatch(showLoading());
      const response = await axios.post("/api/pet/create-new-pet", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        // dispatch(hideLoading());
        navigate("/admin/petlist");
      }
      // Do something with the response, like showing a success message
    } catch (error) {
      toast.error("Error in adding New Pet.");
      dispatch(hideLoading());
    }
  };

  const getusersId = async () => {
    try {
      //dispatch(showLoading());
      const response = await axios.get("/api/user/get-all-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setUsers(response.data.data);
        // dispatch(hideLoading());
      }
      // Do something with the response, like showing a success message
    } catch (error) {
      toast.error("Error in adding New Pet.");
      dispatch(hideLoading());
    }
  };
  useEffect(() => {
    getusersId();
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-body mb-3">
            <div className="mb-2">
              <label htmlFor="userID">Choose User: </label>
              <select
                className="form-control"
                id="userID"
                name="userID"
                onChange={handleChange}
              >
                <option>Select User...</option>
                {users.length > 0 &&
                  users.map((data, key) => {
                    return (
                      <option key={data.key} value={data._id}>
                        {data._id}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="mb-2">
              <label htmlFor="pet">
                Pet:{" "}
                <small className="text-muted text-danger">
                  (Dog, Cat, Bird, Other)
                </small>
              </label>
              <input
                className="form-control"
                type="text"
                id="pet"
                name="pet"
                value={pet.pet}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor="size">Size (S/M/L):</label>
              <input
                className="form-control"
                type="text"
                id="size"
                name="size"
                value={pet.size}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-2">
              <label htmlFor="breed">Breed:</label>
              <input
                className="form-control"
                type="text"
                id="breed"
                name="breed"
                value={pet.breed}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor="image">Image:</label>
              <input
                className="form-control"
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                required
              />
            </div>
          </div>
          <div className="card-footer mt-2">
            <button type="submit" className="btn btn-success btn-sm">
              Submit
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default PetForm;
