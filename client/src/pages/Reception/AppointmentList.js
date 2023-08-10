import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { Table } from "antd";
import { Button, Modal } from "react-bootstrap";
import moment from "moment";
import {toast} from 'react-hot-toast';
function Appointmentlist() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pets, setPets] = useState([]);

  // const [appointments, setAppointments] = useState([]);
  // const [doctors, setDoctors] = useState([]); // Assuming you fetch the list of doctors
  // const [selectedAppointment, setSelectedAppointment] = useState(null);
  // const [selectedDoctor, setSelectedDoctor] = useState(null);
  // const [showModal, setShowModal] = useState(false);

  // const handleShowModal = (record) => {
  //   setSelectedAppointment(record);
  //   setShowModal(true);
  //   if (!selectedDoctor) {
  //     toast.error("Please select a doctor.");
  //     return;
  //   }
  // };

  // const handleCloseModal = () => {
  //   setShowModal(false);
  //   setSelectedAppointment(null);
  //   setSelectedDoctor(null);
  // };

  // const handleDoctorSelect = (event) => {
  //   setSelectedDoctor(event.target.value);
  // };

  const dispatch = useDispatch();
  // const getDoctorsData = async () => {
  //   try {
  //     dispatch(showLoading());
  //     const response = await axios.get("/api/admin/get-all-approved-doctors", {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     console.log(response.data.data);
  //     dispatch(hideLoading());
  //     if (response.data.success) {
        
  //       setDoctors(response.data.data);
  //     }
  //   } catch (error) {
  //     dispatch(hideLoading());
  //   }
  // };
  // const getAppointmentsData = async () => {
  //   try {
  //     dispatch(showLoading());
  //     const response = await axios.get("/api/user/get-all-appointments", {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     dispatch(hideLoading());
  //     if (response.data.success) {
  //       setAppointments(response.data.data);
  //     }
  //   } catch (error) {
  //     dispatch(hideLoading());
  //   }
  // };

  const changeAppointmentStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `/api/admin/change-appointment-status/${record._id}`, // Include the appointment ID in the URL
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
      toast.error("Error changing appointment status");
      dispatch(hideLoading());
    }
  };
  // const assignDoctorToAppointment = async () => {
    

  //   try {
  //     dispatch(showLoading());
  //     const response = await axios.post(
  //       "/api/admin/assign-doctor-to-appointment",
  //       {
  //         appointmentId: selectedAppointment._id,
  //         doctorId: selectedDoctor,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     dispatch(hideLoading());
  //     if (response.data.success) {
  //       toast.success(response.data.message);
  //       getAppointmentsData();
  //       handleCloseModal();
  //     }
  //   } catch (error) {
  //     toast.error("Error assigning doctor to appointment");
  //     dispatch(hideLoading());
  //   }
  // };
  
  // useEffect(() => {
  //   getAppointmentsData();
  //   getDoctorsData();
  //   assignDoctorToAppointment();
  // }, []);

  
  const handleShowModal = (record) => {
    setSelectedAppointment(record);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedAppointment(null);
    setSelectedDoctor(null);
    setShowModal(false);
  };

  const handleDoctorSelect = (event) => {
    setSelectedDoctor(event.target.value);
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
      const response = await axios.get("/api/admin/get-all-pets", {
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

  const assignDoctorToAppointment = async () => {
    try {
      const response = await axios.post(
        "/api/admin/assign-doctor-to-appointment",
        {
          appointmentId: selectedAppointment._id,
          doctorId: selectedDoctor,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
        console.log(response);
      if (response.data.success) {

        toast.success(response.data.message);
        getAppointmentsData();
        handleCloseModal();
      }
    } catch (error) {
      toast.error("Error assigning doctor to appointment");
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

  useEffect(() => {
    getDoctorsData();
    getAppointmentsData();
    changeAppointmentStatus();
    getPetsData();
  }, []);

  const columns = [
    {
        title: "Id",
        dataIndex: "_id",
    },
    {
      title: "Parent Name",
      dataIndex: "parentname",
      render: (text, record) => (
        <span>
          {record.userInfo.name}
        </span>
      ),
    },
    {
      title: "Doctor",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.doctorInfo.name || record.doctorInfo.firstName + " " + record.doctorInfo.lastName}
        </span>
      ),
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
    {
      title: "Date",
      dataIndex: "date",
      render:(text, record)=>(
        <span>
          {moment(record.date).format('LL')}
        </span>
      )
    },
    {
      title: "Time",
      dataIndex: "time",
      render:(text, record)=>(
        <span>
          {moment(record.time).format('LTS')}
        </span>
      )
    },
   {
    title: "Status",
    dataIndex: "status",
    render:(text, record) =>(
      <span className="text-capitalize">{record.status}</span>
    )
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
                Block
              </button>
            )}
            <button
              type="button"
              className="btn btn-success btn-sm text-capitalize ml-2"
              onClick={() => handleShowModal(record)}
            >
              View & Assign Doctor
            </button>
          </div>
        ),
      },
    
    
  ];

  return (
    <Layout>
      <h4 className="page-header">Appointments List</h4>
      <hr />
      <Table columns={columns} dataSource={appointments}/>
      <div>
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
      <Modal.Header closeButton>
            <Modal.Title>
              <div className="d-lg-flex justify-content-between align-items-center">
                <span>Appointment Details</span>
                {/* {selectedAppointment && selectedAppointment._id} */}
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="col-md-12 ">
           <div className="d-lg-flex justify-content-between align-items-center gap-4 mb-3" >
            <label className="text-left">Parent Name: </label> 
            <span className="text-right">{selectedAppointment && selectedAppointment.userInfo.name}</span>
            </div> 
            <div className="d-lg-flex justify-content-between align-items-center gap-4 mb-3" >
            <label className="text-left">Assign Doctor: </label> 
            <span className="text-right"> <select className="form-control">
              <option>--Select Doctor--</option>
              {selectedAppointment && doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  Dr. {doctor.firstName} {doctor.lastName}
                </option>
              ))}
              
            </select></span>
            </div> 
            <div className="d-lg-flex justify-content-between align-items-center gap-4  " >
            <label className="text-left">Doctor Specialization: </label> 
            <span className="text-right">{selectedAppointment && selectedAppointment.doctorInfo.specialization}</span>
            </div> 
           </div>
          
          
               
            

           
          </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={assignDoctorToAppointment}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
    </Layout>
  );
}

export default Appointmentlist;
