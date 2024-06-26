import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Table } from "antd";
import moment from "moment";

function GroomerAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [mobappointments, setmobAppointments] = useState([]);
  const dispatch = useDispatch();
  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/groomer/get-all-appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointments(response.data.data);
        console.log(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const getmobAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        "/api/groomer/get-all-mob-appointments",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setmobAppointments(response.data.data);
        console.log(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const changeAppointmentStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/change-appointment-status",
        { appointmentId: record._id, status: status },
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
      toast.error("Error changing doctor account status");
      dispatch(hideLoading());
    }
  };
  const columns = [
    {
      title: "Id",
      dataIndex: "customId",
      render: (text, record) => (
        <span className="text-capitalize">{record?.appointment?.customId}</span>
      ),
    },
    {
      title: "Client",
      dataIndex: "name",
      render: (text, record) => (
        <span className="text-capitalize">{record?.user?.name}</span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (text, record) => <span>{record?.user?.mobile}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => <span>{record?.user?.email}</span>,
    },
    {
      title: "Services Needed",
      dataIndex: "service",
      render: (text, record) => <span>{record?.appointment?.service}</span>,
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span>
          {moment(record?.appointment?.date).format("DD-MM-YYYY")}
          {" | "}
          {record?.appointment?.time}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <span className="text-capitalize">{record?.appointment?.status}</span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record?.appointment?.status === "pending" && (
            <div className="d-flex">
              <h1
                className="anchor px-2"
                onClick={() => changeAppointmentStatus(record, "approved")}
              >
                <button className="btn btn-success btn-sm">Approve</button>
              </h1>
              <h1
                className="anchor"
                onClick={() => changeAppointmentStatus(record, "rejected")}
              >
                <button className="btn btn-danger btn-sm">Reject</button>
              </h1>
            </div>
          )}
          {record?.appointment?.status === "approved" && (
            <div className="d-flex">
              <h1
                className="anchor px-2"
                onClick={() => changeAppointmentStatus(record, "rejected")}
              >
                <button className="btn btn-danger btn-sm">Reject</button>
              </h1>
            </div>
          )}
        </div>
      ),
    },
  ];

  const mobcolumns = [
    {
      title: "Id",
      dataIndex: "customId",
      render: (text, record) => (
        <span className="text-capitalize">{record?.appointment?.customId}</span>
      ),
    },
    {
      title: "Client",
      dataIndex: "name",
      render: (text, record) => (
        <span className="text-capitalize">{record?.user?.name}</span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (text, record) => <span>{record?.user?.mobile}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => <span>{record?.user?.email}</span>,
    },
    {
      title: "Services Needed",
      dataIndex: "service",
      render: (text, record) => <span>{record?.appointment?.service}</span>,
    },

    {
      title: "Location",
      dataIndex: "location",
      render: (text, record) => (
        <span
        style={{cursor: 'pointer'}}
          onClick={() => {
            const mapUrl = `https://www.google.com/maps?q=${record?.appointment?.lat},${record?.appointment?.lng}`;
            window.open(mapUrl, "_blank");
          }}
        >
          Latitude: {record?.appointment?.lat} <br />
          Longitude: {record?.appointment?.lng}
        </span>
      ),
    },

    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span>
          {moment(record?.appointment?.date).format("DD-MM-YYYY")}
          {" | "}
          {record?.appointment?.time}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <span className="text-capitalize">{record?.appointment?.status}</span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record?.appointment?.status === "pending" && (
            <div className="d-flex">
              <h1
                className="anchor px-2"
                onClick={() => changeAppointmentStatus(record, "approved")}
              >
                <button className="btn btn-success btn-sm">Approve</button>
              </h1>
              <h1
                className="anchor"
                onClick={() => changeAppointmentStatus(record, "rejected")}
              >
                <button className="btn btn-danger btn-sm">Reject</button>
              </h1>
            </div>
          )}
          {record?.appointment?.status === "approved" && (
            <div className="d-flex">
              <h1
                className="anchor px-2"
                onClick={() => changeAppointmentStatus(record, "rejected")}
              >
                <button className="btn btn-danger btn-sm">Reject</button>
              </h1>
            </div>
          )}
        </div>
      ),
    },
  ];
  useEffect(() => {
    getAppointmentsData();
    getmobAppointmentsData();
  }, []);
  return (
    <Layout>
      <h6 className="page-header">Mobile Grooming Appointments</h6>
      <hr />
      <Table columns={mobcolumns} dataSource={mobappointments} />

      <h6 className="page-header">Grooming Appointments</h6>
      <hr />
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  );
}

export default GroomerAppointments;
