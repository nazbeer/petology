import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { Table, DatePicker } from "antd";
import { Button, Modal } from "react-bootstrap";
import moment from "moment";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

import JsPDF from "jspdf";
import "jspdf-autotable";

function Appointmentlist(doctorId) {
  const [appointments, setAppointments] = useState([]);
  const [openappointments, setOpenAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pets, setPets] = useState([]);

  const [filter, setFilter] = useState(true);


  const [filterType, setFilterType] = useState("");
  let [onlyDate, setOnlyDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filteredGuestData, setFilteredGuestData] = useState([]);

  const { RangePicker } = DatePicker;

  const dispatch = useDispatch();

  const handleFilterType = (event) => {
    console.log(event.target.value);
    setFilterType(event.target.value);
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
      const response = await axios.get(
        "/api/admin/get-all-approved-doctors-assign",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("response", response.data.data);
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
        setPets(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const assignDoctorToAppointment = async () => {
    try {
      console.log(selectedAppointment, selectedDoctor);
      const response = await axios.post(
        "/api/admin/assign-doctor-to-appointment",
        {
          appointmentId: selectedAppointment?.appointment?._id,
          doctorId: selectedDoctor,
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
        console.log(response.data.data);
        setAppointments(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const [doctorDetails, setDoctorDetails] = useState(null);

  // useEffect(() => {
  //   const fetchDoctorDetails = async (record) => {
  //     try {
  //       const response = await axios.get(`/api/admin/doctordetails/${record._id}`);
  //       console.log(response);
  //       if (response.data.success) {
  //         setDoctorDetails(response.data.data);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchDoctorDetails();
  // }, [doctorId]);

  const getOpenAppointmentsData = async () => {
    try {
      const response = await axios.get("/api/admin/get-all-open-appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

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
        if (selectedAppointment && selectedAppointment?.doctor) {
          const response = await axios.get(
            `/api/admin/doctordetails/${selectedAppointment?.doctor?._id}`
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
      title: "Service",
      dataIndex: "module",
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Services Requested",
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
        <span>
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
          <button
            type="button"
            className="btn btn-success btn-sm text-capitalize ml-2"
            onClick={() => handleShowModal(record)}
          >
            View & Assign Doctor
          </button>
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
    {
      title: "Doctor",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record?.doctor?.firstName} {record?.doctor?.lastName}
        </span>
      ),
      responsive: ["xs", "md", "sm", "lg"],
    },
    // {
    //   title:'Pet',
    //   dataIndex:'pet',
    //   render:(text, record)=>(
    //     <span>
    //       {record.petInfo.name}
    //     </span>
    //   )
    // },
    {
      title: "Specialization",
      dataIndex: "specialization",
      render: (text, record) => (
        <span className="text-capitalize">
          {record?.doctor?.specialization}
        </span>
      ),
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => (
        <span>{moment(record?.appointment.date).format("LL")}</span>
      ),
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Time",
      dataIndex: "time",
      render: (text, record) => (
        <span>{moment(record?.time).format("LTS")}</span>
      ),
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <span className="text-capitalize">{record?.doctor?.status}</span>
      ),
      responsive: ["xs", "md", "sm", "lg"],
    },

    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex justify-content-evenly align-items-center gap-3">
          {record.status === "pending" ||
          record?.status === "Pending" ||
          record?.status === "blocked" ? (
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
          <button
            type="button"
            className="btn btn-success btn-sm text-capitalize ml-2"
            onClick={() => handleShowModal(record)}
          >
            View & Assign Doctor
          </button>
        </div>
      ),
      responsive: ["xs", "md", "sm", "lg"],
    },
  ];
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

    setFilter(false)
  };


  const createPdfWithTable = async (data) => {
    const doc = new JsPDF();
    doc.setFontSize(30);
    doc.text(70, 20, "Appointments");

    doc.setFontSize(20);
    doc.text(10, 40, "Appointments List (Registered Users)");
    
    const headers = [
      "ParentName",
      "Doctor",
      "Specialization",
      "Date",
      "Status",
      "Time",
    ];
    const datas = filteredData.map((item) => [
      item?.user?.name,
      `${item?.doctor?.firstName} ${item?.doctor?.lastName}`,
      item?.doctor?.specialization,

      moment(item?.appointment?.date).format("LL"),
      item?.appointment?.status,
      moment(item?.appointment?.createdAt).format("LTS"),
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
    const datas1 = filteredGuestData?.map((item) => [
      item?.module,
      item?.service,
      item?.pet,
      moment(item?.date).format("LL"),
      moment(item?.createdAt).format("LTS"),
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
            <h6 className="page-header mb-0">
              Appointments List (Registered Users)
            </h6>
          </div>
          <div className="col-md-6 d-lg-flex d-md-flex d-sm-flex d-xs-flex gap-3 justify-content-end align-items-center">
            <Link to="/admin/appointmentlist">
              <button className="btn btn-success btn-sm" type="button">
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
              <button className="btn btn-warning btn-sm" type="button">
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
                      selectedAppointment?.user?.firstName}
                  </span>
                </div>
                <div className="d-lg-flex justify-content-between align-items-center gap-4 mb-3">
                  <label className="text-left">Assign Doctor: </label>
                  <span className="text-right">
                    {" "}
                    <select className="form-control" onChange={handleDoctorSelect}>
                      <option>--Select Doctor--</option>
                      {selectedAppointment &&
                        doctors.map((doctoro) => (
                          <option key={doctoro._id} value={doctoro._id}>
                            Dr. {doctoro?.firstName} {doctoro?.lastName}
                          </option>
                        ))}
                    </select>
                  </span>
                </div>
                <div className="d-lg-flex justify-content-between align-items-center gap-4  ">
                  <label className="text-left">Doctor Specialization: </label>
                  <span className="text-right">
                    {selectedAppointment &&
                      selectedAppointment?.doctor?.specialization}
                  </span>
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
      </div>
      <div className="col-md-12">
        <h6>Guest Appointments</h6>

        {filteredGuestData !== null ? (
          filteredGuestData.length > 0 ? (
            <Table
              columns={opencolumns}
              dataSource={filteredGuestData}
              responsive={true}
              scroll={{ x: true }}
            />
          ) : (
            <Table
              columns={opencolumns}
              dataSource={openappointments}
              responsive={true}
              scroll={{ x: true }}
            />
          )
        ) : (
          <div className="text-center m-5">No result found</div>
        )}
      </div>
    </Layout>
  );
}

export default Appointmentlist;
