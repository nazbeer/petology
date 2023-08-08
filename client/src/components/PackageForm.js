// src/components/PrescriptionForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from "react-hot-toast";

const PackageForm = () => {
  const [prescription, setPrescription] = useState({
    parseIntrescription: '',
    size: '',
    dimension: '',
    breed: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPrescription((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPrescription((prevState) => ({
      ...prevState,
      image: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('Prescription', prescription.Prescription);
    formData.append('size', prescription.size);
    formData.append('dimension', prescription.dimension);
    formData.append('breed', prescription.breed);
    formData.append('image', prescription.image);

    try {
      const response = await axios.post('/api/Prescription/create-new-Prescription', formData, {
        headers: { 'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log('Prescription saved successfully:', response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        //navigate('/appointments');
      }
      // Do something with the response, like showing a success message
    } catch (error) {
      toast.error("Error in adding New Prescription.");
      //dispatch(hideLoading());
    }
  };

  return (
    <>
    
      <form onSubmit={handleSubmit}>
    <div className='card'>
        <div className='card-body mb-3'>
    
        <div className='mb-2'>
          <label htmlFor="Prescription">Prescription: <small className='text-muted text-danger'>(Dog, Cat, Bird, Other)</small></label>
          <input className="form-control" 
            type="text"
            id="prescription"
            name="prescription"
            value={prescription.prescription}
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
            value={prescription.size}
            onChange={handleChange}
            required
          />
        </div>
        <div className='mb-2'>
          <label htmlFor="dimension">Dimension (1.5x2 Ft):</label>
          <input className="form-control" 
            type="text"
            id="dimension"
            name="dimension"
            value={prescription.dimension}
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
            value={prescription.breed}
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

export default PackageForm;
