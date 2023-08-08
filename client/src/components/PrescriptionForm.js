// src/components/PrescriptionForm.js
import React, { useState , useEffect} from 'react';

import axios from 'axios';
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import { resolveOnChange } from 'antd/lib/input/Input';

const PrescriptionForm = () => {

  const [selectedUser, setSelectedUser] = useState('');
  const [selectedPet, setSelectedPet] = useState('');
  const [appointments, setAppointments] = useState([]);

  const handleUserSelect = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);

    // Fetch pet details based on selected user ID
    const selectedUserPets = pets.filter((pet) => pet.userId === userId);
    setSelectedPet(selectedUserPets[0]?.key || ''); // Assuming there is only one pet per user
  };

  useEffect(() => {
    // Fetch appointments based on selected pet ID
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`/api/user/${selectedUser}/pet/${selectedPet}/appointments`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          setAppointments(response.data.data);
          console.log(response.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (selectedUser && selectedPet) {
      fetchAppointments();
    } else {
      setAppointments([]);
    }
  }, [selectedUser, selectedPet]);
  const [pets, setPets] = useState([]);
  const [users, setUsers] = useState([]);

  const dispatch = useDispatch();
  const getPetsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/pet/get-all-pets", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setPets(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };
  const getUsersData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/user/get-all-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getPetsData();
    getUsersData();
  }, []);
  const [prescription, setPrescription] = useState({
    prescription: '',
    medicine: '',
    description: '',
  
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
    formData.append('prescription', prescription.prescription);
    formData.append('medicine', prescription.medicine);
    formData.append('description', prescription.description);


    try {
      const response = await axios.post('/api/doctor/create-new-prescription', formData, {
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
    <div className='d-lg-flex  gap-2'>
    <div className='col-md-9 mb-3'>
    
      <form onSubmit={handleSubmit}>
        
    <div className='card '>
        <div className='card-body mb-3'>
        <div className='col-md-12 d-lg-flex justify-content-evenly align-items-center gap-2'>
              <div className='col-md-6 mb-2'>
                <label htmlFor="patient_id">User Details</label>:
                <select className="custom-select mr-sm-10 form-control" onChange={handleUserSelect}>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      <small className='text-muted'>{user._id}</small> | {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='col-md-6 mb-2'>
                <label htmlFor="patient_id">Pet Details</label>:
                <select className="custom-select mr-sm-10 form-control" value={selectedPet} onChange={(e) => setSelectedPet(e.target.value)}>
                  {pets.map((pet) => (
                    <option key={pet.key} value={pet.key}>
                      <small>{pet._id}</small> | {pet.pet}
                    </option>
                  ))}
                </select>
              </div>
            </div>
         
        <div className='mb-2'>
          <label htmlFor="Prescription">Prescription: </label>
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
          <label htmlFor="medicine">Medicine:</label>
          <input className="form-control" 
            type="text"
            id="medicine"
            name="medicine"
            value={prescription.medicine}
            onChange={handleChange}
            required
          />
        </div>
        <div className='mb-2'>
          <label htmlFor="description">Description:</label>
          <textarea className='form-control' rows="10" name="description"value={prescription.description} onChange={handleChange} required>

          </textarea>
         
        </div>
        <div className='mb-2'>
          <label htmlFor='Next Appointment'>Next Appointment</label>
          <div className='col-md-4 col-sm-12 d-flex jusify-content-evenly align-items-center gap-2'>
          <input type="date" className='form-control'/>
          <input type="time" className='form-control'/>
          </div>
        </div>
      
        </div>
        <div className='card-footer mt-2'>
        <button type="submit" className='btn btn-success btn-sm'>Submit</button>
        </div>
    
    
    </div>
    </form>
    </div>
    <div className='col-md-3'>
   
          {/* {appointments.length > 0 && ( */}
        <div className='card'>
          <div className='card-body'>
            <h4>Appointments for Selected Pet</h4>
            <ul>
              {appointments.map((appointment) => (
                <li key={appointment._id}>{appointment.date} adfasdf</li>
              ))}
            </ul>
          </div>
        </div>
      {/* )} */}
         
    </div>
    </div>
  );
};

export default PrescriptionForm;
