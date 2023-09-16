import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-hot-toast";

import 'antd/dist/antd.css';


import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
// import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JS
import 'bootstrap-datepicker/dist/css/bootstrap-datepicker3.min.css'; // Import Bootstrap Datepicker CSS
import 'bootstrap-datepicker';

const Vet = () => {
    const [doctorList, setDoctorList] = useState([]);
    useEffect(() =>{
      axios.get('/api/user/get-all-approved-doctors',{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => setDoctorList(response.data.data))
      .catch((error) => console.error(error));
    },[]);
   
    // const [userDetails, setUserDetails] = useState({
    //   firstname: '',
    //   lastname: '',
    //   email: '',
    //   mobile: '',
    // });
    const [service, setService] = useState({
      module:'veterinary',
     // doctor:'',
      doctorId:'',
      service:'',
      breed: '',
      date:'',
      time:'',
      firstname:'',
      lastname:'',
      email:'',
      mobile:'',
      userId:''
    // password:''
  
    });
    useEffect(() => {
      // Fetch doctor list
      axios.get('/api/user/get-all-approved-doctors', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => setDoctorList(response.data.data))
      .catch((error) => console.error(error));
  
      // Fetch user details 
      const userId = localStorage.getItem('userId'); // Get user ID from localStorage

      axios.get(`/api/user/user-details/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        console.log(response);
        const userData = response.data.data;
        const [firstname, lastname] = userData.name.split(' ');
  
        setService({
          firstname: firstname,
          lastname: lastname,
          email: userData.email,
          mobile: userData.mobile,
          userId:userId,
          module:'veterinary',
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
  
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = await axios.post('/api/user/user-book-appointment', service, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
  
        if (response.data.success) {
          toast.success(response.data.message);
          // Do something else, like navigating to another page
        }
      } catch (error) {
        toast.error("Error in booking appointment.");
      }
    };
    return (
        <form onSubmit={handleSubmit}>

        <div className='card'>
           
            <div className='card-body mb-3  ' >
        <div className='row'>      
   
     
              </div>
              
              <div className='row'>
        <div className='col-md-6'>
        <div className='mb-2'>
              <label htmlFor="size">Choose Pet: </label>
              <select className='form-control' id='pet' name='pet' onChange={handleChange}>
                <option defaultValue="">Select Pet...</option>
                <option value={service.pet}>Dog</option>
                <option value={service.pet}>Cat</option>    
                <option value={service.pet}>Bird</option>    
                <option value={service.pet}>Other</option>    
    
              </select>
           
            </div>
            <div className='mb-2'>
              <label htmlFor="size">Choose Size: </label>
              <select className='form-control' id='size' name='size' onChange={handleChange}>
                <option defaultValue="">Select size...</option>
                <option value={service.size}>S (Small - upto 19 Kg)</option>
                <option value={service.size}>M (Medium - upto 30Kg)</option>    
                <option value={service.size}>L (Large - 30 to 50kg or plus)</option>   
              </select>
            </div>
        <div className='mb-2'>
              <label htmlFor="service">Choose Service: </label>
              <select className='form-control p-0' id='service' name='service' multiple onChange={handleChange} style={{height:'120px'}}>
         
                <option value={service.service}>Micro Chipping</option>
                <option value={service.service}>Vaccination</option>    
    
                <option value={service.service}>Consultation</option>    
    
              </select>
             
            </div>
        <div className='mb-2'>
              <label htmlFor="doctor">Choose Doctor: </label>
              <select className='form-control' id='doctor' name='doctorId' onChange={handleChange}>
                <option >Select Doctor...</option>
                {doctorList &&
                 doctorList.map((data, key) => {
                  return(
                    <option key ={data.key}  value= {data._id}>Dr. {data.firstName}</option>
                   
                    );
      
                 })
                  }
    
             
                <option value="Any">Any Doctor</option>
              </select>
            
            </div>
            
          
          
            <div className='mb-2'>
              <label htmlFor="breed">Breed:</label>
              <input className="form-control" 
                type="text"
                id="breed"
                name="breed"
                value={service.breed}
                onChange={handleChange}
                
              />
            </div>
            
           
            
            </div>
            <div className='col-md-6'>
            
            <div className='mb-2'>
              <label htmlFor="firstname">First Name:</label>
              <input className="form-control" 
                type="text"
                id="firstname"
                name="firstname"
                value={service.firstname}
                onChange={handleChange}
                
              />
            </div>
            <div className='mb-2'>
              <label htmlFor="lastname">Last Name:</label>
              <input className="form-control" 
                type="text"
                id="lastname"
                name="lastname"
                value={service.lastname}
                onChange={handleChange}
                
              />
            </div>
            <div className='mb-2'>
              <label htmlFor="email">Email:</label>
              <input className="form-control" 
                type="email"
                id="email"
                name="email"
                value={service.email}
                onChange={handleChange}
               
              />
            </div>
            <div className='mb-2'>
              <label htmlFor="mobile">Mobile Number:</label>
              <input className="form-control" 
                type="text"
                id="mobile"
                name="mobile"
                value={service.mobile}
                onChange={handleChange}
                
              />
            </div>
            <div className='mb-2'>
              <label htmlFor="date">Date:</label>
              <input className="form-control" 
                type="date"
                id="date"
                name="date"
              
                value={service.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className='mb-2'>
              <label htmlFor="time">Time:</label>
              <input className="form-control" 
                type="time"
                id="time"
                name="time"
                pattern="^([01]?[0-9]|2[0-3]):[0-5][0-9]$"
                value={service.time}
                onChange={handleChange}
                required
              />
            </div>
            </div>
            
            </div>
           
        
          
        </div> 
        <div className='card-footer mt-2'>
            <button type="submit" className='btn btn-success btn-sm'>Submit</button>
            </div>
        </div>
        </form>
        );
}
export default Vet;