import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../components/Layout";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Table } from "antd";
import moment from "moment";

function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const dispatch = useDispatch();
  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/user/get-appointments-by-user-id", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setSchedules(response.data.data);
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
          {record.doctorInfo.name}
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
    // {
    //   title: "Date & Time",
    //   dataIndex: "createdAt",
    //   render: (text, record) => (
    //     <span>
    //       {moment(record.date).format("DD-MM-YYYY")} {moment(record.time).format("HH:mm")}
    //     </span>
    //   ),
    // },
    {
        title: "Status",
        dataIndex: "status",
    }
  ];
  useEffect(() => {
    getAppointmentsData();
  }, []);
  return  <Layout>
  <h1 className="page-title">My Schedules</h1>
  <hr />
  <Table columns={columns} dataSource={schedules} />
</Layout>
}

export default Schedule;
