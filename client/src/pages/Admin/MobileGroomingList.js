import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { Table, DatePicker } from "antd";
import { Button, Modal } from "react-bootstrap";
import moment from "moment";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import Geocode from "react-geocode";
import OfficeTimeCalculate from "../../components/OfficeTimeCalculate";

Geocode.setApiKey("AIzaSyAxdklbUsegbWsasCJpvfmin95xzIxiY3Y");
const apiKey = "AIzaSyAxdklbUsegbWsasCJpvfmin95xzIxiY3Y";

function MobileGroomingList(doctorId) {
  const [appointments, setAppointments] = useState([]);
  const [openappointments, setOpenAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pets, setPets] = useState([]);

  const [showReschudleModal, setShowReschudleModal] = useState(false);
  const [appTime, setAppTime] = useState({});
  const [time, setTime] = useState([]);
  const [showOpenReschudleModal, setShowOpenReschudleModal] = useState(false);
  const [date, setDate] = useState([]);

  const dispatch = useDispatch();

  const handleChange = (event) => {
    setAppTime(event.target.value);
    console.log(event.target.value);
  };

  const handleShowReschudleModal = (record) => {
    setSelectedAppointment(record);
    setShowReschudleModal(true);
  };

  const handleCloseReschudleModal = () => {
    setSelectedAppointment(null);
    setSelectedDoctor(null);
    setShowReschudleModal(false);
  };

  const handleShowOpenReschudleModal = (record) => {
    setSelectedAppointment(record);
    setShowOpenReschudleModal(true);
  };

  const handleCloseOenReschudleModal = () => {
    setSelectedAppointment(null);
    setSelectedDoctor(null);
    setShowOpenReschudleModal(false);
  };

  const getOfficeTime = () => {
    axios
      .post(
        "/api/admin/get-office-time",
        { module: "groom" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(
          response?.data?.data?.starttime,
          response?.data?.data?.endtime,
          response?.data?.data?.break
        );
        const data = OfficeTimeCalculate(
          response?.data?.data?.starttime,
          response?.data?.data?.endtime,
          response?.data?.data?.break,
          30
        );

        console.log(data);

        setTime(data);
      })
      .catch((error) => console.error(error));
  };
  const parseTime = (time1) => {
    if (time1) {
      const [time, period] = time1.split(" ");

      let [hours, minutes] = time.split(":");
      hours = parseInt(hours, 10);

      if (period === "PM" && hours !== 12) {
        hours += 12;
      } else if (period === "AM" && hours === 12) {
        hours = 0;
      }

      // Ensure hours and minutes are two digits
      hours = hours < 10 ? "0" + hours : hours;
      // minutes = minutes < 10 ? "0" + minutes : minutes;

      return `${hours}:${minutes}`;
    }
  };
  const reschudleAppointment = async () => {
    try {
      console.log(
        selectedAppointment,
        selectedAppointment?.appointment?._id,
        appTime,
        date
      );
      const time = parseTime(appTime);
      console.log(time);
      const response = await axios.post(
        "/api/admin/reschudle-appointment-time",
        {
          appointmentId: selectedAppointment?.appointment?._id,
          time: time,
          date,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log(response);
      if (response.data.success) {
        toast.success(response.data.message);
        getAppointmentsData();
        handleCloseReschudleModal();
      }
    } catch (error) {
      toast.error("Error reschudling the appointment");
    }
  };
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
        // getOpenAppointmentsData();
      }
    } catch (error) {
      //toast.error("Error changing appointment status");
      dispatch(hideLoading());
    }
  };
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
      // toast.error("Error changing appointment status");
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
  const reschudleOpenAppointment = async () => {
    try {
      console.log(selectedAppointment, selectedDoctor, appTime, date);
      const time = parseTime(appTime);
      console.log(time);
      const response = await axios.post(
        "/api/admin/reschudle-open-appointment",
        {
          appointmentId: selectedAppointment?._id,
          doctorId: selectedDoctor,
          time: time,
          date
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log(response);
      if (response.data.success) {
        toast.success(response.data.message);
        getAppointmentsData();
        handleCloseOenReschudleModal();
      }
    } catch (error) {
      toast.error("Error reschudling the appointment");
    }
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "/api/admin/get-all-mobgroom-appointments",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const modifiedData = [];
      for (const item of response.data.data) {
        const location = `${item.lat},${item.lng}`;
        const geocodeResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location}&key=${apiKey}`
        );
        const address =
          geocodeResponse.data.results[1]?.formatted_address || "N/A";

        modifiedData.push({
          ...item,
          location,
          address,
        });
      }
      console.log(modifiedData);
      setOpenAppointments(modifiedData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getOfficeTime();
    fetchData();
  }, []);

  useEffect(() => {
    // Fetch doctor details based on selected appointment
    const fetchDoctorDetails = async () => {
      try {
        if (selectedAppointment && selectedAppointment.doctorInfo) {
          const response = await axios.get(
            `/api/admin/doctordetails/${selectedAppointment?.doctorInfo._id}`
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
    // getOpenAppointmentsData();
  }, []);
  const opencolumns = [
    {
      title: "Service",
      dataIndex: "service",
      responsive: ["xs", "md", "sm", "lg"],
    },

    {
      title: "Pet",
      dataIndex: "pet",
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Appointment Date",
      dataIndex: "date",
      render: (text, record) => (
        <span>{moment(record?.date).format("LL")}</span>
      ),
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Appointment Time",
      dataIndex: "time",
      render: (text, record) => <span>{record?.time}</span>,
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Parent Name",
      dataIndex: "parentName",
      render: (text, record) => (
        <span className="text-capitalize">
          {record?.firstname} {record?.lastname}
        </span>
      ),
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      render: (text, record) => <span>{record?.mobile}</span>,
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Email Address",
      dataIndex: "email",
      render: (text, record) => <span>{record?.email}</span>,
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (text, record) => (
        <a
          href={`https://www.google.com/maps/search/?api=${apiKey}&query=${record?.lat},${record?.lng}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Google Maps
        </a>
      ),
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text, record) => (
        <p className="address-custom ">{record?.address}</p>
      ),

      responsive: ["xs", "md", "sm", "lg"],
    },
    // {
    //   title: 'Doctor Details',
    //   dataIndex: 'doctorDetails',
    //   render: () => {
    //     if (!doctorDetails) {
    //       return null;
    //     }
    //     return (
    //       <div>
    //         <p>
    //           Doctor Name: {doctorDetails.firstName} {doctorDetails.lastName}
    //         </p>
    //         <p>Specialization: {doctorDetails.specialization}</p>
    //         {/* Add other doctor details as needed */}
    //       </div>
    //     );
    //   },
    // },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <span className="text-capitalize">{record?.status}</span>
      ),
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex justify-content-evenly align-items-center gap-3">
          <button
            type="button"
            className="btn btn-success btn-sm text-capitalize ml-2"
            onClick={() => handleShowOpenReschudleModal(record)}
          >
            Reschedule
          </button>
          {record?.status === "pending" ||
          record?.status === "Pending" ||
          record?.status === "blocked" ? (
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
          {/* <button
            type="button"
            className="btn btn-success btn-sm text-capitalize ml-2"
            onClick={() => handleShowModal(record)}
          >
            View & Assign Doctor
          </button> */}
        </div>
      ),
      responsive: ["xs", "md", "sm", "lg"],
    },
  ];
  const usercolumns = [
    {
      title: "Parent Name",
      dataIndex: "parentname",
      render: (text, record) => <span>{record?.user?.name}</span>,
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Doctor",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record?.doctor?.name ||
            record?.doctor?.firstName + " " + record?.doctor?.lastName}
        </span>
      ),
      responsive: ["xs", "md", "sm", "lg"],
    },

    {
      title: "Specialization",
      dataIndex: "specialization",
      render: (text, record) => <span>{record?.doctor?.specialization}</span>,
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
      render: (text, record) => <span>{moment(record?.appointment?.date).format("LL")}</span>,
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Time",
      dataIndex: "time",
      render: (text, record) => <span>{record?.appointment?.time}</span>,
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <span className="text-capitalize">{record?.appointment?.status}</span>
      ),
      responsive: ["xs", "md", "sm", "lg"],
    },

    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex justify-content-evenly align-items-center gap-3">
          <button
            type="button"
            className="btn btn-success btn-sm text-capitalize ml-2"
            onClick={() => handleShowReschudleModal(record)}
          >
            Reschedule
          </button>
          {record?.appointment?.status === "pending" ||
          record?.appointment?.status === "Pending" ||
          record?.appointment?.status === "blocked" ? (
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
      responsive: ["xs", "md", "sm", "lg"],
    },
  ];

  return (
    <Layout>
      <div className="col-md-12">
        <div className="row d-fixed d-lg-flex justify-content-between align-items-center">
          <div className="col-md-6  d-lg-flex gap-3 justify-content-right align-items-center">
            <h6 className="page-header mb-0">Appointments List</h6>
          </div>
          <div className="col-md-6 d-lg-flex d-md-flex d-sm-flex d-xs-flex gap-3 justify-content-end align-items-center">
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
              <button className="btn btn-warning btn-sm" type="button">
                Mobile Vet
              </button>
            </Link>
            <Link to="/admin/mobilegroominglist">
              <button className="btn btn-success btn-sm" type="button">
                Mobile Grooming
              </button>
            </Link>
          </div>
        </div>
        <hr />
        <Table
          columns={usercolumns}
          dataSource={appointments}
          responsive={true}
          scroll={{ x: true }}
        />
        <div></div>
      </div>
      <div className="col-md-12">
        <h6>Open Appointment Lists</h6>
        <Table
          columns={opencolumns}
          dataSource={openappointments}
          responsive={true}
          scroll={{ x: true }}
        />
      </div>
      <div>
        <Modal
          show={showReschudleModal}
          onHide={handleCloseReschudleModal}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <div className="d-lg-flex justify-content-between align-items-center">
                <span>Appointment Reschedule</span>
                {/* {selectedAppointment && selectedAppointment._id} */}
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="col-md-12 ">
              <div className="d-lg-flex justify-content-between align-items-center gap-4 mb-3">
                <label htmlFor="time">Date:</label>

                <DatePicker
                  getPopupContainer={() =>
                    document.getElementById("date-popup")
                  }
                  popupStyle={{
                    position: "relative",
                    width: "34%",
                  }}
                  style={{ width: "100%", zIndex: "1000 !important" }}
                  onChange={setDate}
                  disabledDate={(current) => {
                    return moment().add(-1, "days") >= current;
                  }}
                />
              </div>
              <div id="date-popup" />

              <div className="d-lg-flex justify-content-between align-items-center gap-4 mb-3">
                <label htmlFor="time">Time:</label>

                <select
                  className="form-control"
                  id="time"
                  name="time"
                  onChange={handleChange}
                >
                  {time.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseReschudleModal}>
              Close
            </Button>
            <Button variant="primary" onClick={reschudleAppointment}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <div>
        <Modal
          show={showOpenReschudleModal}
          onHide={handleCloseOenReschudleModal}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <div className="d-lg-flex justify-content-between align-items-center">
                <span>Appointment Reschedule</span>
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
                    selectedAppointment?.firstname +
                      " " +
                      selectedAppointment?.lastname}
                </span>
              </div>
              <div className="d-lg-flex justify-content-between align-items-center gap-4 mb-3">
                <label htmlFor="time">Date:</label>

                <DatePicker
                  getPopupContainer={() =>
                    document.getElementById("date-popup")
                  }
                  popupStyle={{
                    position: "relative",
                    width: "34%",
                  }}
                  style={{ width: "100%", zIndex: "1000 !important" }}
                  onChange={setDate}
                  disabledDate={(current) => {
                    return moment().add(-1, "days") >= current;
                  }}
                />
              </div>
              <div id="date-popup" />
              <div className="d-lg-flex justify-content-between align-items-center gap-4 mb-3">
                <label htmlFor="time">Time:</label>

                <select
                  className="form-control"
                  id="time"
                  name="time"
                  onChange={handleChange}
                >
                  {time.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseOenReschudleModal}>
              Close
            </Button>
            <Button variant="primary" onClick={reschudleOpenAppointment}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Layout>
  );
}

export default MobileGroomingList;
