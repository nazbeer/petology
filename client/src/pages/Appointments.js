import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../components/Layout";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Table, Input } from "antd";
import moment from "moment";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [openappointments, setOpenAppointments] = useState([]);
  const dispatch = useDispatch();

  const cancelAppointment = async (appointmentId) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `/api/user/cancel-appointment/${appointmentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        getAppointmentsData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Error canceling appointment");
    }
  };

  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/admin/get-appointments-by-user-id", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(response);
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Doctor",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          Dr. {record.doctorInfo.firstName} {record.doctorInfo.lastName}
        </span>
      ),
    },
    {
      title: "Pet Details",
      dataIndex: "petInfo",
      render: (petInfo) => (
        <span>
          {petInfo && petInfo.length > 0
            ? `${petInfo[0].pet} - ${petInfo[0].breed} (${petInfo[0].size})`
            : "N/A"}
        </span>
      ),
    },
    {
      title: "Specialization",
      dataIndex: "specialization",
      render: (text, record) => (
        <span className="text-capitalize">
          {record.doctorInfo.specialization}
        </span>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span>
          {moment(record.date).format("D MMM, YYYY")} | {moment(record.time).format("hh:mm")}
        </span>
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
        <button
          className="btn btn-danger btn-sm"
          onClick={() => cancelAppointment(record._id)}
        >
          Cancel Appointment
        </button>
      ),
    },
  ];

  
  const opencolumns = [
    {
      title: "Id",
      dataIndex: "_id",
    },

    {
      title:"Pet",
      dataIndex:'pet',
    },
    {
      title:"Requested Service",
      dataIndex : 'service' ,
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span>
          {moment(record.date).format("D MMM, YYYY")} | {record.time}
        </span>
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
        <button
          className="btn btn-danger btn-sm"
          onClick={() => cancelAppointment(record._id)}
        >
          Cancel Appointment
        </button>
      ),
    },
  ];

  const getOpenAppointmentsData = async () => {
    try {
      const response = await axios.get("/api/user/get-all-open-appointments", {
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
    getOpenAppointmentsData();
    getAppointmentsData();
  }, []);

  return (
    <Layout>
      <div className="d-lg-flex justify-align-between align-items-center">
      <h4 className="page-title">My Appointments</h4>
      <Input placeholder="Search"/>
      </div>
     
      <hr />
      <Table columns={columns} dataSource={appointments} />
      <h4 className="page-title">My Open Appointments</h4>
      <hr />
      <Table columns={opencolumns} dataSource={openappointments} />
    </Layout>
  );
}

export default Appointments;
