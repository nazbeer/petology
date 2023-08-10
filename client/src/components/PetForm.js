// src/components/PetForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from "react-hot-toast";

const PetForm = () => {
  const [pet, setPet] = useState({
    pet: '',
    size: '',
    //dimension: '',
    breed: '',
    image: null,
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
    formData.append('pet', pet.pet);
    formData.append('size', pet.size);
   // formData.append('dimension', pet.dimension);
    formData.append('breed', pet.breed);
    formData.append('image', pet.image);

    try {
      const response = await axios.post('/api/pet/create-new-pet', formData, {
        headers: { 'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log('Pet saved successfully:', response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        //navigate('/appointments');
      }
      // Do something with the response, like showing a success message
    } catch (error) {
      toast.error("Error in adding New Pet.");
      //dispatch(hideLoading());
    }
  };

  return (
    <>
    
      <form onSubmit={handleSubmit}>
    <div className='card'>
        <div className='card-body mb-3'>
    
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
        {/* <div className='mb-2'>
          <label htmlFor="dimension">Dimension (1.5x2 Ft):</label>
          <input className="form-control" 
            type="text"
            id="dimension"
            name="dimension"
            value={pet.dimension}
            onChange={handleChange}
            required
          />
        </div> */}
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
