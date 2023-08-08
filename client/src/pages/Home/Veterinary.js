// src/components/Veterinary.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-hot-toast";
import Header from '../../frontend_components/Header';
import Footer from '../../frontend_components/Footer';

const Veterinary = () => {
  const [doctorList, setDoctorList] = useState([]);
  useEffect(() =>{
    axios.get('/api/user/get-all-approved-doctors',{
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },})
    .then((response) => setDoctorList(response.data))
    .catch((error) => console.error(error));
  },[]);
  const [service, setService] = useState({
    doctor:'',
    service: '',
    pet:'',
    size: '',
    dimension: '',
    breed: '',
   // image: null,
    date:'',
    time:'',
    building:'',
    flat:'',
    landmark:'',
    firstname:'',
    lastname:'',
    email:'',
    mobile:'',


  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   setService((prevState) => ({
  //     ...prevState,
  //     image: file,
  //   }));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('doctor', service.doctor);
    formData.append('service', service.service);
    formData.append('pet', service.pet);
    formData.append('size', service.size);
    formData.append('dimension', service.dimension);
    formData.append('breed', service.breed);
    //formData.append('image', service.image);
    formData.append('date', service.date);
    formData.append('time', service.time);
    formData.append('building',service.building);
    formData.append('flat', service.flat);
    formData.append('landmark', service.landmark);
    formData.append('firstname', service.firstname);
    formData.append('lastname', service.lastname);
    formData.append('email', service.email);
    formData.append('mobile', service.mobile);

    try {
      const response = await axios.post('/create-new-appointment', formData, {
        headers: { 'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log('service saved successfully:', response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        //navigate('/appointments');
      }
      // Do something with the response, like showing a success message
    } catch (error) {
      toast.error("Error in adding New service.");
      //dispatch(hideLoading());
    }
  };

  return (
    <main className='bg-vet'>
    <Header/>
    <div className='container veh-100 mt-4 mb-4'>
    
      <form onSubmit={handleSubmit}>

    <div className='card'>
        <div className='card-header'>
            <h3>Book Appointment in Clinic</h3>
        </div>
        <div className='card-body mb-3  ' >
    <div className='row'>      
    <div className='col-md-12'>
            
        <div className='mb-2'>
          <label htmlFor="service">Choose Service: </label>
          <select className='form-control' id='service' name='service' onChange={handleChange}>
            <option defaultValue="">Select Service...</option>
            <option value={service.service}>Hair Cut</option>
            <option value={service.service}>Bath</option>    

          </select>
         
        </div>
          </div>
 
          </div>
          <div className='mb-2'>
          <label htmlFor="doctor">Choose Doctor: </label>
          <select className='form-control' id='doctor' name='doctor' onChange={handleChange}>
            <option defaultValue="">Select Doctor...</option>
            {doctorList &&
             doctorList.map((data, key) => {
              return(
                <option key ={data.key}  value= {data}>{`${data}`}</option>
                );
  
             })
              }

            {/* <option value={service.doctor}>Hair Cut</option>
            <option value={service.doctor}>Bath</option>     */}
            <option value="Any">Any Doctor</option>
          </select>
         
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
            <option value={service.size}>S (Small)</option>
            <option value={service.size}>M (Medium)</option>    
            <option value={service.size}>L (Large)</option>   
          </select>
        </div>
        <div className='mb-2'>
          <label htmlFor="dimension">Dimension (1.5x2 Ft):</label>
          <input className="form-control" 
            type="text"
            id="dimension"
            name="dimension"
            value={service.dimension}
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
            value={service.breed}
            onChange={handleChange}
            required
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
            required
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
            required
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
            required
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
            required
          />
        </div>
        <div className='mb-2'>
          <label htmlFor="time">Time:</label>
          <input className="form-control" 
            type="time"
            id="time"
            name="time"
            value={service.time}
            onChange={handleChange}
            required
          />
        </div>
        </div>
        <div className='col-md-12'>
          <small className=' text-danger'>The password will be autogenerated and will be sent to your registered email id with the login link.</small>
        </div>
        </div>
       
    
      
    </div> 
    <div className='card-footer mt-2'>
        <button type="submit" className='btn btn-success btn-sm'>Submit</button>
        </div>
    </div>
    </form>
    </div>
    <Footer/>
    </main>
  );
};

export default Veterinary;