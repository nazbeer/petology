import React, { useState } from 'react';
import { toast } from "react-hot-toast";
import axios from 'axios';

function FormService() {
  const [sname, setName] = useState([]);
  const [subservice, setSubservice] = useState([]);

  const handleSubmit = async () => {
    //e.preventDefault();

    try {
  const response =    await axios.post('/api/admin/create-service', { sname, subservice },
      {
        headers: { 'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    }});
    toast.success(response.data.message);
      
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  return (
    <div className="col-md-6 col-lg-4 col-xs-1">
      <h1>Service Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input className='form-control'
            type="text"
            name="sname"
            //onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className='mb-2'>
          <label>Subservice:</label>
          <input  className='form-control'
            type="text"
            name="subservice"
          //  onChange={(e) => setSubservice(e.target.value)}
          />
        </div>
        <button type="submit" className='btn btn-success btn-sm'>Add Service</button>
      </form>
    </div>
  );
}

export default FormService;
