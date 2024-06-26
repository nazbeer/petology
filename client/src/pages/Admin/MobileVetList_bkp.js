import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { Table } from "antd";
import { Button, Modal } from "react-bootstrap";
import moment from "moment";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import Geocode from "react-geocode"; // Import the Geocode library

// Set your Google Maps API key here
Geocode.setApiKey("AIzaSyAxdklbUsegbWsasCJpvfmin95xzIxiY3Y");

function MobileVetList(doctorId) {
  const [appointments, setAppointments] = useState([]);
  const [openappointments, setOpenAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pets, setPets] = useState([]);
  //const [getAddress, getAddressFromCoordinates] = useState([]);
  const dispatch = useDispatch();

  const changeOpenAppointmentStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `/api/admin/change-open-appointment-status/${record._id}`,
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
        getOpenAppointmentsData();
      }
    } catch (error) {
      // toast.error("Error changing appointment status");
      dispatch(hideLoading());
    }
  };
  const changeAppointmentStatus = async (record, status) => {
    try {
      dispatch(showLoading());

      const response = await axios.post(
        `/api/admin/change-appointment-status/${record?.appointment?._id}`, // Include the appointment ID in the URL
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
      // toast.error("Error changing appointment status");
      dispatch(hideLoading());
    }
  };

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
      console.log(response.data);
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
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [getAddress, setAddress] = useState();
  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await Geocode.fromLatLng(lat, lng);
      const address = response.results[0]?.formatted_address;
      // console.log(address);
      // return address;
      if (response.results) {
        setAddress(response.results.formatted_address);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Address not found";
    }
  };
  const getOpenAppointmentsData = async (lat, lng) => {
    try {
      const response = await axios.get(
        "/api/admin/get-all-mobvet-appointments",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setOpenAppointments(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Fetch doctor details based on selected appointment
    const fetchDoctorDetails = async () => {
      try {
        if (selectedAppointment && selectedAppointment.doctorInfo) {
          const response = await axios.get(
            `/api/admin/doctordetails/${selectedAppointment.doctorInfo._id}`
          );
          console.log(response);
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
    getOpenAppointmentsData();
  }, []);

  const opencolumns = [
    {
      title: "Appointment Date",
      dataIndex: "date",
      render: (text, record) => <span>{moment(record.date).format("LL")}</span>,
    },
    {
      title: "Appointment Time",
      dataIndex: "time",
      render: (text, record) => <span>{record.time}</span>,
    },
    {
      title: "Doctor",
      dataIndex: "doctor",
      render: (text, record) => (
        <span className="text-capitalize">{record.doctor}</span>
      ),
    },
    {
      title: "Services Requested",
      dataIndex: "service",
    },
    {
      title: "Pet Details",
      dataIndex: "petdetails",
      render: (text, record) => (
        <span>
          {record.pet} - {record.breed} ({record.size})
        </span>
      ),
    },
    {
      title: "Parent Name",
      dataIndex: "parentName",
      render: (text, record) => (
        <span className="text-capitalize">
          {record.firstname} {record.lastname}
        </span>
      ),
    },

    {
      title: "Mobile",
      dataIndex: "mobile",
      render: (text, record) => <span>{record.mobile}</span>,
    },
    {
      title: "Email Address",
      dataIndex: "email",
      render: (text, record) => <span>{record.email}</span>,
    },

    {
      title: "Appointment Location",
      dataIndex: "lng",
      // render:(text, record)=>(
      //   <span>{record.lng} {record.lat}</span>
      // )

      render: async (text, record) => {
        <span> {record.lat}</span>;
        if (record.lat && record.lng) {
          const address = await getAddressFromCoordinates(
            record.latitude,
            record.longitue
          );
          return <span>{address}</span>;
        } else {
          return <span>No location available</span>;
        }
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <span className="text-capitalize">{record.status}</span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex justify-content-evenly align-items-center gap-3">
          {record.status === "pending" ||
          record.status === "Pending" ||
          record.status === "blocked" ? (
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
    },
  ];
  const usercolumns = [
    {
      title: "Parent Name",
      dataIndex: "parentname",
      render: (text, record) => <span>{record.userInfo.name}</span>,
    },
    {
      title: "Doctor",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.doctorInfo.name ||
            record.doctorInfo.firstName + " " + record.doctorInfo.lastName}
        </span>
      ),
    },

    {
      title: "Specialization",
      dataIndex: "specialization",
      render: (text, record) => <span>{record.doctorInfo.specialization}</span>,
    },
    {
      title: "Booking Location",
      dataIndex: "location",
      render: (text, record) => <span>{record.lat}</span>,
    },
    // {
    //   title: "Appointment Location",
    //   dataIndex: "location",
    //   render: async (text, record) => {
    //     if (record.lat && record.lng) {
    //       const address = await getAddressFromCoordinates(
    //         record.lat,
    //         record.lng
    //       );
    //       return <span>{address}</span>;
    //     } else {
    //       return <span>No location available</span>;
    //     }
    //   },
    // },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => <span>{moment(record.date).format("LL")}</span>,
    },
    {
      title: "Time",
      dataIndex: "time",
      render: (text, record) => (
        <span>{moment(record.time).format("LTS")}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <span className="text-capitalize">{record.status}</span>
      ),
    },

    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex justify-content-evenly align-items-center gap-3">
          {record.status === "pending" ||
          record.status === "Pending" ||
          record.status === "blocked" ? (
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
              Cancelled
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="col-md-12">
        <div className="row d-fixed d-lg-flex justify-content-between align-items-center">
          <div className="col-md-6  d-lg-flex gap-3 justify-content-right align-items-center">
            <h6 className="page-header mb-0">Appointments List</h6>
          </div>
          <div className="col-md-6 d-lg-flex gap-3 justify-content-end align-items-center">
            <Link to="/admin/appointmentlist">
              <button className="btn btn-warning btn-sm" type="button">
                Veterinary
              </button>
            </Link>
            <Link to="/admin/groominglist">
              <button className="btn btn-warning btn-sm" type="button">
                Grooming
              </button>
            </Link>
            <Link to="/admin/mobilevetlist">
              <button className="btn btn-success btn-sm" type="button">
                Mobile Vet
              </button>
            </Link>
            <Link to="/admin/mobilegroominglist">
              <button className="btn btn-warning btn-sm" type="button">
                Mobile Grooming
              </button>
            </Link>
          </div>
        </div>
        <hr />
        <Table columns={usercolumns} dataSource={appointments} />
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
                <div className="d-lg-flex justify-content-between align-items-center gap-4 mb-3">
                  <label className="text-left">Parent Name: </label>
                  <span className="text-right">
                    {selectedAppointment &&
                      selectedAppointment.userInfo.firstName}
                  </span>
                </div>
                <div className="d-lg-flex justify-content-between align-items-center gap-4 mb-3">
                  <label className="text-left">Assign Doctor: </label>
                  <span className="text-right">
                    {" "}
                    <select className="form-control">
                      <option>--Select Doctor--</option>
                      {selectedAppointment &&
                        Array.from(
                          new Set(doctors.map((doctor) => doctor._id))
                        ).map((doctorId) => {
                          const doctor = doctors.find(
                            (doc) => doc._id === doctorId
                          );
                          return (
                            <option key={doctor._id} value={doctor._id}>
                              Dr. {doctor.firstName} {doctor.lastName}
                            </option>
                          );
                        })}
                    </select>
                  </span>
                </div>
                <div className="d-lg-flex justify-content-between align-items-center gap-4  ">
                  <label className="text-left">Doctor Specialization: </label>
                  <span className="text-right">
                    {selectedAppointment &&
                      selectedAppointment.doctorInfo.specialization}
                  </span>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="btn btn-success btn-sm"
                onClick={handleCloseModal}
              >
                Close
              </Button>
              <Button
                className="btn btn-success btn-sm"
                onClick={assignDoctorToAppointment}
              >
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
      <div className="col-md-12">
        <h6>Open Appointment Lists</h6>
        <Table columns={opencolumns} dataSource={openappointments} />
      </div>
    </Layout>
  );
}

export default MobileVetList;
