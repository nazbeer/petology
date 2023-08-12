// src/components/ServiceForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from "react-hot-toast";

const ServiceForm = () => {
  const [service, setPet] = useState({
    name: '',
    subservice: '',
    
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPet((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', service.name);
    formData.append('subservice', service.subservice);
  

    try {
      const response = await axios.post('/api/admin/create-new-service', formData, {
        headers: { 'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log('Service saved successfully:', response.data.data);
      if (response.data.data.success) {
        toast.success(response.data.message);
        //navigate('/appointments');
      }
      // Do something with the response, like showing a success message
    } catch (error) {
      toast.error("Error in adding New Service.");
      //dispatch(hideLoading());
    }
  };

  return (
    <>
    
      <form onSubmit={handleSubmit}>
    <div className='card'>
        <div className='card-body mb-3'>
    
        <div className='mb-2'>
          <label htmlFor="pet">Service: </label>
          <input className="form-control" 
            type="text"
            id="name"
            name="name"
            value={service.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className='mb-2'>
          <label htmlFor="size">Subservice:</label>
          <input className="form-control" 
            type="text"
            id="subservice"
            name="subservice"
            value={service.subservice}
            onChange={handleChange}
            required
          />
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

export default ServiceForm;
