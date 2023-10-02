import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Table, Tooltip } from "antd";
import moment from "moment";

function Groomi() {
  const [appointments, setAppointments] = useState([]);
  const [cancelledAppointments, setCancelledAppointments] = useState([]);

  const dispatch = useDispatch();
  //const [moduleType, setModuleType] = useState('grooming');
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
      const response = await axios.get(`/api/user/appointments/grooming`, {
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
        <span className="text-capitalize">
          {record?.status === "blocked" ? "Cancelled" : record?.status}
        </span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => cancelAppointment(record?._id)}
            disabled={cancel(record?.status)}
          >
            {cancel(record?.status) ? "Cancelled" : "Cancel"}
          </button>
          <button
            className="btn btn-success btn-sm ms-2"
            // onClick={() => cancelAppointment(record?._id)}
            disabled={refund(record?.createdAt, record?.status)}
            style={{
              display: `${
                refund(record?.createdAt, record?.status) ? "none" : ""
              }  `,
            }}
          >
            Refund
          </button>
        </div>
      ),
    },
    {
      render: (text, record) => (
        <Tooltip
          // placement="top"
          title="Payment only be refunded before 24 Hours"
          // arrow={mergedArrow}
        >
          <i className="ri-question-mark"></i>
        </Tooltip>
      ),
    },
  ];

  const cancel = (status) => {
    if (status === "blocked" || status === "user cancelled") {
      return true;
    } else return false;
  };

  const refund = (date, status) => {
    const targetDate = new Date(date);

    // Calculate the date 7 days from now
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() - 7);
    console.log(targetDate, sevenDaysLater);

    // Check if the current date is 7 days or more after the target date
    const isMoreThanSevenDays = targetDate > sevenDaysLater;

    if (
      isMoreThanSevenDays &&
      (status === "blocked" || status === "user cancelled")
    ) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <>
      <div className="d-lg-flex justify-align-between align-items-center">
        <h4 className="page-title">My Appointments</h4>
        {/* <Input placeholder="Search"/> */}
      </div>

      <hr />
      <Table columns={columns} dataSource={appointments.data} />
    </>
  );
}

export default Groomi;
