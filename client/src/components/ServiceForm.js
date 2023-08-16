// // src/components/ServiceForm.js
// import React, { useState } from 'react';
// import axios from 'axios';
// import { toast } from "react-hot-toast";
// import { Button, Form, Input } from "antd";
// import { hideLoading, showLoading } from "../redux/alertsSlice";
// import { useDispatch } from "react-redux";
// const ServiceForm = () => {
//   //const dispatch = useDispatch();
//   // const [sname, setName] = useState('');
//   // const [subservice, setSubservice] = useState('');

//   const [service, setService] = useState({
//     sname:'',
//     subservice:'',
//   });
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setService((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));

//   };

//   const handleSubmit = async () => {
//  //   e.preventDefault();
//  const formData = new FormData();
//  formData.append('sname', service.sname);
//  formData.append('subservice', service.subservice);
//     try {
//      // dispatch(showLoading());
//      const response = await axios.post('/api/admin/create-service', formData 
//     //  {
//     //   headers: { 'Content-Type': 'multipart/form-data',
//     //   Authorization: `Bearer ${localStorage.getItem("token")}`,
//     //   },
//     // }
//     );
//     console.log(response);
//      // console.log('Service saved successfully:', response.data.data);
//       if (response.data.success) {
//         toast.success(response.data.message);
//       }
//     } catch (error) {
//       toast.error("Error in adding New Service.");
//     //  dispatch(hideLoading());
//     }
//   };

//   return (
//     <>
//     <div className='col-md-6 col-lg-3 col-xs-1'>
//     <div className='col-md-12'>
//             <form >
//             <div className='mb-2'>
//               <label htmlFor="service">Enter Service Name: </label><br/>
//               <input name="sname" className="form-control" placeholder='Enter Service Name' onChange={handleChange} required />

             
//             </div>
//             <div className='mb-2'>
//              <label htmlFor="">Select Sub Services:</label>
//              <input name="subservice" className='form-control' placeholder='Enter Sub Service'  onChange={handleChange} required/>



//             </div>
//             <div className='mb-2'>
//               <button className='btn btn-success btn-sm' type='button' onClick={handleSubmit}>Add New Service</button>
//             </div>
//             </form>
//           </div>
//     </div>

//     </>
//   );
// };


// export default ServiceForm;




// src/components/ServiceForm.js
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const ServiceForm = () => {
  const [pack, setPackage] = useState({
    name: "",
    subservice: "",
  });

  const handleChange = (e) => {
    // const { name, value } = e.target;
    setPackage((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
  
    try {
      const response = await axios.post('/api/service/create-service', pack , {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }, 
      }
        
    );
    // console.log(pack);
    //   console.log("Service saved successfully:", response.data);
      if (response.data.success) {
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
      <form>
        <div className="card">
          <div className="card-body mb-3">
            <div className="mb-2">
              <label htmlFor="name">Name: </label>
              <input
                className="form-control"
                type="text"
                id="name"
                name="name"
                value={pack.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor="subservice">Sub Service:</label>
              <input
                className="form-control"
                type="text"
                id="subservice"
                name="subservice"
                value={pack.subservice}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="card-footer mt-2">
            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ServiceForm;


