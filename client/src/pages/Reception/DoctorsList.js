import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import {toast} from 'react-hot-toast'
import axios from "axios";
import { Table, Modal } from "antd";
import moment from "moment";

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const dispatch = useDispatch();
  const getDoctorsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/admin/get-all-approved-doctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };
  const changeDoctorBreakTime = async (breakTime) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/admin/change-doctor-break-time",
        {
          doctorId: selectedDoctor._id,
          userId: selectedDoctor.userId,
          breakTime: breakTime,
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
        closeModal();
        getDoctorsData();
      }
    } catch (error) {
      toast.error("Error changing doctor's break time");
      dispatch(hideLoading());
    }
  };

  const changeDoctorStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const resposne = await axios.post(
        "/api/admin/change-doctor-account-status",
        { doctorId: record._id, userId: record.userId, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (resposne.data.success) {
        toast.success(resposne.data.message);
        getDoctorsData();
      }
    } catch (error) {
      toast.error('Error changing doctor account status');
      dispatch(hideLoading());
    }
  };
  const openModal = (doctor) => {
    setSelectedDoctor(doctor);
  };

  // Function to close the break time modal
  const closeModal = () => {
    setSelectedDoctor(null);
  };

  useEffect(() => {
    getDoctorsData();
    changeDoctorBreakTime();
  }, []);
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
    },
    {
      title:"Specialization",
      dataIndex:"specialization",
      
    },
    {
      title:"Experience", 
      dataIndex:"experience",
      render:(text, record)=>(
        <p>{record.experience} Years</p>
      )
    },
    {
      title:"Consultation Fees",
      dataIndex: "feePerCunsultation",
      render: (number, record) => {
        return (
          <p className="font-weight-600 text-danger">
            {record.feePerCunsultation} AED
          </p>
        );
      }
    },

    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (record , text) => moment(record.createdAt).format("DD-MM-YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render:(text, record) =>(
        <p className="text-capitalize">{record.status}</p>
      )
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
          {(record.status === "pending" || record.status === "Pending")  && (
            <button type="button"
              className="btn btn-warning btn-sm text-capitalize"
              onClick={() => changeDoctorStatus(record, "approved")}
            >
            approve
            </button>
          )}
          {(record.status === "Approved" || record.status === "approved") && (
            <button type="button"
              className="btn btn-danger btn-sm text-capitalize"
              onClick={() => changeDoctorStatus(record, "blocked")}
            >
              block
            </button>
          )}
           {(record.status === "Blocked" || record.status === "blocked") && (
            <button type="button"
              className="btn btn-warning btn-sm text-capitalize"
              onClick={() => changeDoctorStatus(record, "approved")}
            >
              approve
            </button>
          )}
           <button
            type="button"
            className="btn btn-warning btn-sm text-capitalize"
            onClick={() => openModal(record)}
          >
            Change Break Time
          </button>
        </div>
      ),
    },
  ];
  return (
    <Layout>
       <div className="d-flex justify-content-between align-items-center">
      <h3 className="">Doctor List</h3>
     <a href="/apply-doctor" ><button className="btn btn-success " type="button">Add New Doctor</button></a>

      </div>
      <hr />
      <Table columns={columns} dataSource={doctors} />
    </Layout>
  );
}

export default DoctorsList;
