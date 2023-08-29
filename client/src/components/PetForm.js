// src/components/PetForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from "react-hot-toast";
import jwt_decode from 'jwt-decode'; 
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const PetForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let counter = 1; // Initialize the counter

  const generateCustomID = () => {
    const formattedDate = moment().format("YYYYMMDD");
    const customID = `${formattedDate}-1${counter.toString().padStart(6, '0')}`;
    counter++; // Increment the counter for the next ID
    return customID;
  };
  const [pet, setPet] = useState({
    pet: '',
    size: '',
    breed: '',
    image: null,
    userId:'',
    custompetId: generateCustomID(),
  });
  const userToken = localStorage.getItem('token');
  const decodedToken = jwt_decode(userToken);
  const userId = decodedToken.id; // Extract the user ID from the decoded token
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
    formData.append('pet', pet.pet);
    formData.append('size', pet.size);
    formData.append('breed', pet.breed);
    formData.append('image', pet.image);
    formData.append('userId', userId);
    formData.append('custompetId', pet.custompetId);

    try {
      //dispatch(showLoading());
      const response = await axios.post('/api/pet/create-new-pet', formData, {
        headers: { 'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
       // dispatch(hideLoading());
        navigate('/petlist');
      }
      // Do something with the response, like showing a success message
    } catch (error) {
      toast.error("Error in adding New Pet.");
      dispatch(hideLoading());
    }
  };

  return (
    <>
    
      <form onSubmit={handleSubmit}>
    <div className='card'>
        <div className='card-body mb-3'>
        <div className='mb-2 d-none'>
              <label htmlFor='userId'>User ID:</label>
              <input
                className='form-control cursor-disabled bg-light'
                type='text'
                id='userId'
                name='userId'
                value={userId}
                onChange={handleChange}
                readOnly // User ID is read-only
              />
            </div>
        <div className='mb-2'>
          <label htmlFor="pet">Pet: <small className='text-muted text-danger'>(Dog, Cat, Bird, Other)</small></label>
          <input className="form-control" 
            type="text"
            id="pet"
            name="pet"
            value={pet.pet}
            onChange={handleChange}
            required
          />
        </div>
        <div className='mb-2'>
          <label htmlFor="size">Size (S/M/L):</label>
          <input className="form-control" 
            type="text"
            id="size"
            name="size"
            value={pet.size}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className='mb-2'>
          <label htmlFor="breed">Breed:</label>
          <input className="form-control" 
            type="text"
            id="breed"
            name="breed"
            value={pet.breed}
            onChange={handleChange}
            required
          />
        </div>
        <div className='mb-2'>
          <label htmlFor="image">Image:</label>
          <input className="form-control"  type="file" id="image" name="image" onChange={handleImageChange} required />
        </div>
        </div>
        <div className='card-footer mt-2'>
        <button type="submit" className='btn btn-success btn-sm'>Submit</button>
        </div>
    
    
    </div>
    </form>
    </>
  );
};

export default PetForm;