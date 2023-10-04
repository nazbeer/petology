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

import JsPDF from "jspdf";
import "jspdf-autotable";

Geocode.setApiKey("AIzaSyAxdklbUsegbWsasCJpvfmin95xzIxiY3Y");
const apiKey = "AIzaSyAxdklbUsegbWsasCJpvfmin95xzIxiY3Y";

function MobileGroomingList(doctorId) {
  const { RangePicker } = DatePicker;
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

  const [filter, setFilter] = useState(true);

  const [filterType, setFilterType] = useState("");
  let [onlyDate, setOnlyDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filteredGuestData, setFilteredGuestData] = useState([]);

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
          response?.data?.data?.starttime1,
          response?.data?.data?.endtime2,
          response?.data?.data?.break
        );
        const data = OfficeTimeCalculate(
          response?.data?.data?.starttime1,
          response?.data?.data?.endtime2,
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
      const response = await axios.post(
        "/api/admin/get-all-module-appointments",
        { module: "mobile_grooming" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        console.log(response.data.data);
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
        handleCloseOenReschudleModal();
      }
    } catch (error) {
      toast.error("Error reschudling the appointment");
    }
  };
  const fetchData = async () => {
    try {
      const response = await axios.post(
        "/api/admin/get-all-open-appointments",
        { module: "Mobile Grooiming" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data.data);

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
          {record?.status === "pending" ||
          record?.status === "Pending" ||
          record?.status === "blocked" ? (
            <button
              type="button"
              style={{ width: 90 }}
              className="btn btn-warning btn-sm text-capitalize"
              onClick={() => changeOpenAppointmentStatus(record, "approved")}
            >
              Approve
            </button>
          ) : (
            <button
              type="button"
              style={{ width: 90 }}
              className="btn btn-danger btn-sm text-capitalize"
              onClick={() => changeOpenAppointmentStatus(record, "blocked")}
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            className="btn btn-success btn-sm text-capitalize ml-2"
            onClick={() => handleShowOpenReschudleModal(record)}
          >
            Reschedule
          </button>
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
    // {
    //     title: "Id",
    //     dataIndex: "_id",
    // },
    {
      title: "Parent Name",
      dataIndex: "parentname",
      render: (text, record) => <span>{record?.user?.name}</span>,
      responsive: ["xs", "md", "sm", "lg"],
    },
    // {
    //   title: "Doctor",
    //   dataIndex: "name",
    //   render: (text, record) => (
    //     <span>
    //       {record?.doctorInfo?.name ||
    //         record?.doctorInfo?.firstName + " " + record?.doctorInfo?.lastName}
    //     </span>
    //   ),
    //   responsive: ["xs", "md", "sm", "lg"],
    // },
    {
      title: "Pet Name",
      dataIndex: "petName",
      render: (text, record) => <span>{record?.appointment?.petName}</span>,
    },
    // {
    //   title: "Specialization",
    //   dataIndex: "specialization",
    //   render: (text, record) => <span>{record?.doctorInfo?.specialization}</span>,
    //   responsive: ["xs", "md", "sm", "lg"],
    // },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => (
        <span>{moment(record?.appointment?.date).format("LL")}</span>
      ),
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Time",
      dataIndex: "time",
      render: (text, record) => <span>{record?.appointment?.time}</span>,
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Payment Status",
      dataIndex: "payment status",
      render: (text, record) => (
        <span className="text-capitalize">{record?.payment?.status}</span>
      ),
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Amount",
      dataIndex: "payment status",
      render: (text, record) => (
        <span className="text-capitalize">{record?.payment?.amount} AED</span>
      ),
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
          {record?.appointment?.status === "user cancelled" ? (
            <button
              type="button"
              style={{ width: 90 }}
              className="btn btn-danger btn-sm text-capitalize"
              onClick={() => changeAppointmentStatus(record, "blocked")}
              disabled
            >
              Cancelled
            </button>
          ) : record?.appointment?.status === "pending" ||
            record?.appointment?.status === "blocked" ? (
            <button
              type="button"
              style={{ width: 90 }}
              className="btn btn-warning btn-sm text-capitalize"
              onClick={() => changeAppointmentStatus(record, "approved")}
            >
              Approve
            </button>
          ) : (
            <button
              type="button"
              style={{ width: 90 }}
              className="btn btn-danger btn-sm text-capitalize"
              onClick={() => changeAppointmentStatus(record, "blocked")}
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            className="btn btn-success btn-sm text-capitalize ml-2"
            onClick={() => handleShowReschudleModal(record)}
          >
            Reschedule
          </button>

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

  const handleFilterType = (event) => {
    console.log(event.target.value);
    setFilterType(event.target.value);
  };

  const onChangeDate = (date, dateString) => {
    setOnlyDate(moment(dateString).format("LL"));

    console.log(moment(dateString).format("LL"));
  };

  const onChangeRange = (date, dateString) => {
    setStartDate(moment(dateString[0]).format("LL"));
    setEndDate(moment(dateString[1]).format("LL"));
    console.log(
      moment(dateString[0]).format("LL"),
      moment(dateString[1]).format("LL")
    );
  };

  const handleFilter = () => {
    onlyDate = new Date(onlyDate);
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    const filtered = appointments.filter((item) => {
      console.log(item);
      const itemDate = new Date(item?.appointment?.date);
      console.log(
        onlyDate.toDateString(),
        startDateObj.toDateString(),
        endDateObj.toDateString(),
        itemDate.toDateString()
      );
      if (filterType === "Date") {
        return itemDate.toDateString() === onlyDate.toDateString();
      } else {
        // Date range filter
        console.log(
          itemDate.toDateString(),
          startDateObj.toDateString(),
          endDateObj.toDateString()
        );

        return (
          itemDate.toDateString() >= startDateObj.toDateString() &&
          itemDate.toDateString() <= endDateObj.toDateString()
        );
      }
    });

    const filteredGuest = openappointments.filter((item) => {
      console.log(item);
      const itemDate = new Date(item?.date);
      console.log(
        onlyDate.toDateString(),
        startDateObj.toDateString(),
        endDateObj.toDateString(),
        itemDate.toDateString()
      );
      if (filterType === "Date") {
        return itemDate.toDateString() === onlyDate.toDateString();
      } else {
        // Date range filter
        return (
          itemDate.toDateString() >= startDateObj.toDateString() &&
          itemDate.toDateString() <= endDateObj.toDateString()
        );
      }
    });

    console.log(filtered);

    setFilteredData(filtered.length > 0 ? filtered : null);
    setFilteredGuestData(filteredGuest.length > 0 ? filteredGuest : null);

    console.log(filtered.length > 0 ? filtered : null);

    setFilter(false);
  };

  const createPdfWithTable = async (data) => {
    const doc = new JsPDF();
    doc.setFontSize(30);
    doc.text(70, 20, "Appointments");

    doc.setFontSize(20);
    doc.text(10, 40, "Appointments List (Registered Users)");

    const headers = [
      "ParentName",
      "Pet Name",
      // "Doctor",
      // "Specialization",
      "Date",
      "Status",
      "Time",
    ];
    const datas =
      filteredData &&
      filteredData.map((item) => [
        item?.user?.name,
        item?.appointment?.petName,
        // `${item?.doctor?.firstName} ${item?.doctor?.lastName}`,
        // item?.doctor?.specialization,

        moment(item?.appointment?.date).format("LL"),
        item?.appointment?.status,
        item?.appointment?.time,
      ]);
    console.log(datas);

    doc.autoTable({
      head: [headers],
      body: datas,
      theme: "striped",
      margin: { top: 50 },
    });

    const headers1 = [
      "Service",
      "Requested",
      "Pet",
      "Date",
      "Time",
      "Mobile",
      "Status",
    ];
    const datas1 =
      filteredGuestData &&
      filteredGuestData.map((item) => [
        item?.module,
        item?.service,
        item?.pet,
        moment(item?.date).format("LL"),
        item?.time,
        item?.mobile,
        item?.status,
      ]);
    const tableHeight = doc.autoTable.previous.finalY;

    doc.setFontSize(20);
    doc.text(10, tableHeight + 20, "Guest Appointments");
    doc.autoTable({
      startY: tableHeight + 30,
      head: [headers1],
      body: datas1,
      theme: "striped",
    });

    const pdfBytes = doc.save("appointments.pdf");

    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = "appointments.pdf";
    a.click();

    // Clean up
    URL.revokeObjectURL(url);
  };

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
        <div className="row">
          <div className="mb-2 col">
            <select
              className="form-control"
              id="break"
              name="break"
              value={filterType}
              onChange={handleFilterType}
            >
              <option defaultValue="">Select Filter...</option>
              <option value="Date">Date</option>
              <option value="Range">Range</option>
              {/* <option value="Weekly">Weekly</option>
              <option value="Montly">Montly</option> */}
            </select>
          </div>
          {filterType === "Range" && (
            <div className="mb-2 col">
              <RangePicker onChange={onChangeRange} style={{ width: "100%" }} />
            </div>
          )}
          {filterType === "Date" && (
            <div className="mb-2 col">
              <DatePicker
                onChange={onChangeDate}
                size="large"
                style={{ width: "100%" }}
              />
            </div>
          )}
          <div className="mt-1 col">
            <button
              type="submit"
              className="btn btn-success btn-sm me-3"
              onClick={handleFilter}
            >
              Filter
            </button>
            <button
              type="submit"
              className="btn btn-success btn-sm"
              onClick={createPdfWithTable}
              disabled={filter}
            >
              Export to PDF
            </button>
          </div>
        </div>
        {filteredData !== null ? (
          filteredData.length > 0 ? (
            <Table
              columns={usercolumns}
              dataSource={filteredData}
              responsive={true}
              scroll={{ x: true }}
            />
          ) : (
            <Table
              columns={usercolumns}
              dataSource={appointments}
              responsive={true}
              scroll={{ x: true }}
            />
          )
        ) : (
          <div className="text-center m-5">No result found</div>
        )}

        <div></div>
      </div>
      {filteredGuestData !== null ? (
        filteredGuestData.length > 0 ? (
          <div className="col-md-12">
            <h6>Open Appointment Lists</h6>
            <Table
              columns={opencolumns}
              dataSource={filteredGuestData}
              responsive={true}
              scroll={{ x: true }}
            />
          </div>
        ) : (
          <div className="col-md-12">
            <h6>Open Appointment Lists</h6>
            <Table
              columns={opencolumns}
              dataSource={openappointments}
              responsive={true}
              scroll={{ x: true }}
            />
          </div>
        )
      ) : (
        <div className="text-center m-5">No result found</div>
      )}
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
                    return (
                      current &&
                      (current < moment().startOf("day") ||
                        current > moment().endOf("day").add(7, "days"))
                    );
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
                  <option>Select Time...</option>
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
            <Button
              className="btn btn-success btn-sm"
              onClick={handleCloseReschudleModal}
            >
              Close
            </Button>
            <Button
              className="btn btn-success btn-sm"
              onClick={reschudleAppointment}
            >
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
                    return (
                      current &&
                      (current < moment().startOf("day") ||
                        current > moment().endOf("day").add(7, "days"))
                    );
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
                  <option>Select Time...</option>
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
            <Button
              className="btn btn-success btn-sm"
              onClick={handleCloseOenReschudleModal}
            >
              Close
            </Button>
            <Button
              className="btn btn-success btn-sm"
              onClick={reschudleOpenAppointment}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Layout>
  );
}

export default MobileGroomingList;
