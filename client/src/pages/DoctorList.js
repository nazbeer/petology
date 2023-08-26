import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../components/Layout";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Table } from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";
// import BookAppointment from "./BookAppointment";

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const getData = async () => {
        try {
          dispatch(showLoading())
          const response = await axios.get("http://127.0.0.1:5000/api/user/get-all-approved-doctors", {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          });
          dispatch(hideLoading())
          if (response.data.success) {
            setDoctors(response.data.data);
            // const approvedD = response.data;
            // setApprovedDoctors(approvedD);
          }
        } catch (error) {
         dispatch(hideLoading())
        }
      };
    
     
      const BookAppointment = (appointmentId, appointmentData) => {
        // Define the function to handle booking
        // For example, make API requests to book the appointment
    
        // After booking, navigate to the BookDoctor.js page and pass appointmentData
        navigate.push({
          pathname: `doctors/book-doctor/${appointmentId}`,
          state: { appointmentData }, // Pass data through the state object
        });
      };
      useEffect(() => {
        getData();
       // BookAppointment();
      }, []);
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
    },
    {
      title: "Doctor",
      dataIndex: "name",
      render: (text, record) => (
        <span className="text-capitalize">
          Dr. {record.firstName} {record.lastName}
        </span>
      ),
    },
   
    {
      title: "Specialization",
      dataIndex: "specialization",
      render: (text, record) => (
        <span className="text-capitalize">
          {record.specialization}
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
          <span className="text-capitalize">
            {record.status === 'approved' ? <span>Available</span> : null}
          </span>
        ),
      },
      
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <button
          className="btn btn-success btn-sm"
          onClick={() => navigate(`/user/bookdoctor/${record._id}`)}
        >
          Book Now
        </button>
      ),
    },
  ];
                    

return(
    <Layout>
    <div className="">
        <div className="card mb-0">
            <div className="card-header">
            <p  >Doctor List</p></div>
      <div className="card-body">
        <Table columns={columns} dataSource={doctors} />
        </div>
        </div>
    </div>
    </Layout>
)
}
export default DoctorList;