import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { Table } from "antd";
import { Button, Modal } from "react-bootstrap";
import moment from "moment";
import {toast} from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Geocode from "react-geocode"; 

// Set your Google Maps API key here
Geocode.setApiKey('AIzaSyAxdklbUsegbWsasCJpvfmin95xzIxiY3Y');
const apiKey = 'AIzaSyAxdklbUsegbWsasCJpvfmin95xzIxiY3Y';

function MobileVetList(doctorId) {
  const [appointments, setAppointments] = useState([]);
  const [openappointments, setOpenAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [pets, setPets] = useState([]);

  const dispatch = useDispatch();

  const changeOpenAppointmentStatus = async (record, status) =>{
    try{
      dispatch(showLoading());
      const response = await axios.post(`/api/admin/change-open-appointment-status/${record._id}`,
      {
        status: status,
      },
      {
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if(response.data.success){
        toast.success(response.data.message);
        //getOpenAppointmentsData();
      }
    } catch (error){
    
      dispatch(hideLoading());
    }
  };
  const changeAppointmentStatus = async (record, status) => {
    try {
      dispatch(showLoading());

      const response = await axios.post(
        `/api/admin/change-appointment-status/${record._id}`, 
        {
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        getAppointmentsData();
      }
    } catch (error) {
    
      dispatch(hideLoading());
    }
  };
  

  const getDoctorsData = async () => {
    try {
      const response = await axios.get("/api/admin/get-all-approved-doctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getPetsData = async () => {
    try {
      const response = await axios.get("/api/pet/get-all-pets", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  
  const getAppointmentsData = async () => {
    try {
      const response = await axios.get("/api/user/get-all-appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
 

  const [doctorDetails, setDoctorDetails] = useState(null);
  const [data, setData] = useState([]);
  const fetchData = async () => {
    try {
      const response = await axios.get("/api/admin/get-all-mobvet-appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const modifiedData = [];
      for (const item of response.data.data) {
        const location = `${item.lat},${item.lng}`;
        const geocodeResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location}&key=${apiKey}`);
        const address = geocodeResponse.data.results[1]?.formatted_address || 'N/A';

        modifiedData.push({
          ...item,
          location,
          address,
        });
      }

      setOpenAppointments(modifiedData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
   
    const fetchDoctorDetails = async () => {
      try {
        if (selectedAppointment && selectedAppointment.doctorInfo) {
          const response = await axios.get(
            `/api/admin/doctordetails/${selectedAppointment.doctorInfo._id}`
          );
         
          if (response.data.success) {
            setDoctorDetails(response.data.data);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
   
    fetchDoctorDetails();
   
  }, [selectedAppointment]);
 
  useEffect(() => {
    getDoctorsData();
    getAppointmentsData();
    changeAppointmentStatus();
    changeOpenAppointmentStatus();
    getPetsData();
   // getOpenAppointmentsData();
  }, []);


  

  const opencolumns = [
    {
        title :"Appointment Date",
        dataIndex  :'date',
        render:(text, record)=>(
          <span>
            {moment(record.date).format('LL')}
          </span>
        ),
        responsive: ["xs", "md","sm", "lg"],
      },
      {
        title:"Appointment Time",
        dataIndex:"time",
        render:(text, record)=> (
          <span>
            {record.time}
          </span>
        ),
        responsive: ["xs", "md","sm", "lg"],
      },
      
    {
      title:"Doctor",
      dataIndex:"doctor",
      render:(text, record)=>(
        <span className="text-capitalize">
            {record.doctor}
        </span>
      ),
      responsive: ["xs", "md","sm", "lg"],
    },
    {
        title:"Services Requested",
        dataIndex: "service",
        responsive: ["xs", "md","sm", "lg"],
    },
    {
      title:'Pet Details',
      dataIndex : 'petdetails',
      render:(text, record)=>(
        <span>
            {record.pet} - {record.breed} ({record.size})
        </span>
      ),
      responsive: ["xs", "md","sm", "lg"],
    },
    {
        title:"Parent Name",
        dataIndex:"parentName",
        render :(text, record)=>(
          <span className="text-capitalize">{record.firstname} {record.lastname}</span>
        ),
        responsive: ["xs", "md","sm", "lg"],
      },

    
   
    {
      title:'Mobile',
      dataIndex:'mobile',
      render:(text,record)=>(
        <span>{record.mobile}</span>
      ),
      responsive: ["xs", "md","sm", "lg"],
    },
    {
      title:'Email Address',
      dataIndex: 'email',
      render:(text, record)=>(
        <span>{record.email}</span>
      ),
      responsive: ["xs", "md","sm", "lg"],
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (text, record) => (
        <a
          href={`https://www.google.com/maps/search/?api=${apiKey}&query=${record.lat},${record.lng}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Google Maps
        </a>
      ),
      responsive: ["xs", "md","sm", "lg"],
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render:(text, record)=>(
        <span>{record.address}</span>
      ),
     style:'width=50%',
      responsive: ["xs", "md","sm", "lg"],
 
    },
    {
      title:'Status',
      dataIndex:"status",
      render:(text, record)=>(
        <span className="text-capitalize">{record.status}</span>
      ),
      responsive: ["xs", "md","sm", "lg"],
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex justify-content-evenly align-items-center gap-3">
          {record.status === "pending" || record.status === "Pending" || record.status === "blocked" ? (
            <button
              type="button"
              className="btn btn-warning btn-sm text-capitalize"
              onClick={() => changeOpenAppointmentStatus(record, "approved")}
            >
              Approve
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-danger btn-sm text-capitalize"
              onClick={() => changeOpenAppointmentStatus(record, "blocked")}
            >
              Cancel
            </button>
          )}
    
        </div>
      ),
      responsive: ["xs", "md","sm", "lg"],
    },
    

  ]
  const usercolumns = [

    {
      title: "Parent Name",
      dataIndex: "parentname",
      render: (text, record) => (
        <span>
          {record.userInfo.name}
        </span>
      ),
      responsive: ["xs", "md","sm", "lg"],
    },
    {
      title: "Doctor",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.doctorInfo.name || record.doctorInfo.firstName + " " + record.doctorInfo.lastName}
        </span>
      ),
      responsive: ["xs", "md","sm", "lg"],
    },
 
    {
      title: "Specialization",
      dataIndex: "specialization",
      render: (text, record) => (
        <span>
          {record.doctorInfo.specialization}
        </span>
      ),
    },
  
    // {
    //   title: 'Location',
    //   dataIndex: 'location',
    //   key: 'location',
    //   render: (text, record) => (
    //     <a
    //       href={`https://www.google.com/maps/search/?api=${apiKey}&query=${record.lat},${record.lng}`}
    //       target="_blank"
    //       rel="noopener noreferrer"
    //       className="text-dark text-decoration-none"
    //     >
    //       View on Google Maps
    //     </a>
    //   ),
    //   responsive: ["xs", "md","sm", "lg"],
    // },
    // {
    //   title: 'Address',
    //   dataIndex: 'address',
    //   key: 'address',
    // },
    {
      title: "Date",
      dataIndex: "date",
      render:(text, record)=>(
        <span>
          {moment(record.date).format('LL')}
        </span>
      ),
      responsive: ["xs", "md","sm", "lg"],
    },
    {
      title: "Time",
      dataIndex: "time",
      render:(text, record)=>(
        <span>
          {moment(record.time).format('LTS')}
        </span>
      ),
      responsive: ["xs", "md","sm", "lg"],
    },
   {
    title: "Status",
    dataIndex: "status",
    render:(text, record) =>(
      <span className="text-capitalize">{record.status}</span>
    ),
    responsive: ["xs", "md","sm", "lg"],
   },

      {
        title: "Actions",
        dataIndex: "actions",
        render: (text, record) => (
          <div className="d-flex justify-content-evenly align-items-center gap-3">
            {record.status === "pending" || record.status === "Pending" || record.status === "blocked" ? (
              <button
                type="button"
                className="btn btn-warning btn-sm text-capitalize"
                onClick={() => changeAppointmentStatus(record, "approved")}
              >
                Approve
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-danger btn-sm text-capitalize"
                onClick={() => changeAppointmentStatus(record, "blocked")}
              >
                Cancel
              </button>
            )}
          
          </div>
        ),
        responsive: ["xs", "md","sm", "lg"],
      },
    
    
  ];

  return (
    <Layout>
      <div className="col-md-12">
        <div className="row d-fixed d-lg-flex justify-content-between align-items-center">
        <div className="col-md-6  d-lg-flex gap-3 justify-content-right align-items-center">
      <h6 className="page-header mb-0">Appointments List (Registered Users)</h6>
      </div>
      <div className="col-md-6 d-lg-flex d-md-flex d-sm-flex d-xs-flex gap-3 justify-content-end align-items-center">
       <Link to="/admin/appointmentlist"><button className="btn btn-warning btn-sm" type="button">Veterinary</button></Link>
        <Link to="/admin/groominglist"><button className="btn btn-warning btn-sm" type="button">Grooming</button></Link>
        <Link to="/admin/mobilevetlist"><button className="btn btn-success btn-sm" type="button">Mobile Vet</button></Link>
        <Link to="/admin/mobilegroominglist"><button className="btn btn-warning btn-sm" type="button">Mobile Grooming</button></Link>
      </div>
      </div>
      <hr />
      <Table columns={usercolumns} dataSource={appointments} responsive={true}
  scroll={{ x: true }}/>
   
      <div>
    
      </div>
      </div>
      <div className="col-md-12">
        <h6>Guest Appointments</h6>
        <Table columns={opencolumns} dataSource={openappointments} responsive={true}
  scroll={{ x: true }}/>
      </div>
    </Layout>
  );
}

export default MobileVetList;
