import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-hot-toast";
import bootstrap from 'react-bootstrap';
import { GoogleMap, Marker, LoadScript, Autocomplete } from '@react-google-maps/api';
const MobGroom = () => {
    const [autocomplete, setAutocomplete] = useState(null);
    const [servicesList, setServicesList] = useState([]); 
    useEffect(() => {
        axios.get('/api/open/get-services')
        .then((response) => {
            setServicesList(response.data.data);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

    const [location, setLocation] = useState({ lat: 25.2048, lng: 55.2708 });
    const [service, setService] = useState({
    // doctor:'Any',
        service: '',
        pet:'',
        size: '',
        breed: '',
        date:'',
        time:'',
        firstname:'',
        lastname:'',
        email:'',
        mobile:'',
        lat:'',
        lng:'',
    });
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
        try {
        const response = await axios.post('/api/open/book-mobgroom-appointment', service);
        console.log('New appointment successfully saved:', response.data.data);
        if (response.data.success) {
            toast.success(response.data.message);
        }
        } catch (error) {
        toast.error("Error in adding Mobile Grooming Appointment.");
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <div className='card'>
            
                <div className='card-body mb-3  ' >
        
                <div className='row'>
            <div className='col-md-6'>
            <div className='mb-2'>
                <label htmlFor="service">Choose Service: </label>
                <select className='form-control' id='service'  name='service' onChange={handleChange}>
                    <option value="">Select Service...</option>
                    {servicesList.map((service) => (
                        <option key={service._id} value={service.subService}>{service.subService}</option>
                    ))}
                    </select>
                
                </div>
        
                <div className='mb-2'>
                    <label htmlFor="size">Choose Pet: </label>
                    <select className='form-control' id='pet' name='pet'  onChange={handleChange}>
                    <option defaultValue="">Select Pet...</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>    
                    <option value="Bird">Bird</option>    
                    <option value="Other">Other</option>    
                    </select>
                </div>
                
                {service.pet === "Other" && (
                    <div className='mb-2'>
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
                <div className='mb-2'>
                <label htmlFor="size">Choose Size: </label>
                <select className='form-control' id='size' name='size' onChange={handleChange}>
                    <option defaultValue="">Select size...</option>
                    <option value="S">S (Small)</option>
                    <option value="M">M (Medium)</option>    
                    <option value="L">L (Large)</option>   
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
                </div>
                <div className='col-md-6 mb-3'>
                <div className='mb-2'>
                <label htmlFor="location" >Location:</label>
            
            <div style={{ width: '100%', height: '400px', borderRadius:'6px' }}>
           
                <GoogleMap
                mapContainerStyle={{ width: '100%', height: '98%', borderRadius:'6px', border:'1px solid #ccc' }}
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
                    type='text'
                    placeholder='Search for a location'
                    style={{
                        boxSizing: 'border-box',
                        border: '1px solid transparent',
                        width: '240px',
                        height: '32px',
                        padding: '12px 12px',
                        borderRadius: '6px',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                        fontSize: '12px',
                        outline: 'none',
                        textOverflow: 'ellipses',
                        position: 'absolute',
                        marginLeft:'10px',
                        marginTop:'55px',
                        justifyContent:'center'
                    }}
                    
                    required  
                    />

                </Autocomplete>
                </GoogleMap>
        


                </div>
            
        
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
export default MobGroom;