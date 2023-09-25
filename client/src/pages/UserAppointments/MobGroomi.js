import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Table, Input } from "antd";
import moment from "moment";

function MobGroomi() {
  const [appointments, setAppointments] = useState([]);
  const [cancelledAppointments, setCancelledAppointments] = useState([]);

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
        setCancelledAppointments((prevAppointments) => [
          ...prevAppointments,
          appointmentId,
        ]);
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
      const response = await axios.get(`/api/user/appointments/mobgroom`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("response", response.data);
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointments(response.data); // Set appointments to response.data.data
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getAppointmentsData();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "customId",
    },
    // {
    //   title: "Doctor",
    //   dataIndex: "name",
    //   render: (text, record) => (
    //     <span>
    //       Dr. {record?.doctor?.firstName} {record?.doctor?.lastName}
    //     </span>
    //   ),
    // },
    {
      title: "Service",
      dataIndex: "service",
      render: (text, record) => (
        <span className="text-capitalize">{record.service}</span>
      ),
    },
    {
      title: "Client",
      dataIndex: "name",
      render: (text, record) => (
        <span className="text-capitalize">{record.user.name}</span>
      ),
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      render: (text, record) => (
        <span className="text-capitalize">{record.user.mobile}</span>
      ),
    },
    {
      title: "Pet",
      dataIndex: "pet",
      render: (text, record) => (
        <span className="text-capitalize">
          {record.pet} - {record.size} - {record.breed}
        </span>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "timing",
      render: (text, record) => (
        <span className="text-capitalize">
          {moment(record.date).format("D MMM, YYYY")}| {record.time}{" "}
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
          disabled={cancelledAppointments.includes(record._id)}
        >
          {cancelledAppointments.includes(record._id) ? "Cancelled" : "Cancel"}
        </button>
      ),
    },
  ];

  useEffect(() => {
    getAppointmentsData();
  }, []);

  return (
    <>
      <div className="d-lg-flex justify-align-between align-items-center">
        <h4 className="page-title">My Appointments</h4>
        {/* <Input placeholder="Search"/> */}
      </div>

      <hr />
      <Table
        columns={columns}
        dataSource={appointments.data}
        responsive={true}
        scroll={{ x: true }}
      />
    </>
  );
}

export default MobGroomi;
