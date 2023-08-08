import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { Table } from "antd";
import { Button, Modal } from "bootstrap";
import moment from "moment";

function Appointmentlist() {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const dispatch = useDispatch();
  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/user/get-all-appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointments(response.data.data);
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
        title: "Id",
        dataIndex: "_id",
    },
    {
      title: "Parent Name",
      dataIndex: "parentname",
      render: (text, record) => (
        <span>
          {record.userInfo.name}
        </span>
      ),
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
    {
      title: "Date",
      dataIndex: "date",
      render:(text, record)=>(
        <span>
          {record.date}
        </span>
      )
    },
    {
      title: "Time",
      dataIndex: "time",
      render:(text, record)=>(
        <span>
          {record.time}
        </span>
      )
    },
    {
      title: "Pet",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.petInfo.name} 
        </span>
      ),
    },
    {
      title: "Pet Sizing",
      dataIndex: "sizing",
      render: (text, record) => (
        <span>
          {record.petInfo.sizing}  - ({record.petInfo.dimension})
        </span>
      ),
    },
      {
        title: "Actions",
        dataIndex: "status",
        render: (text, record) => (
          <div className="d-flex justify-content-evenly">
            <button type="button" className="btn btn-success  btn-sm cusrsor-pointer" title="View" onClick={handleShowModal}><i class="ri-eye-line"></i></button>
            <button type="button" className="btn btn-warning  btn-sm cusrsor-pointer" title="Edit"><i class="ri-edit-line"></i></button>
            <button type="button" className="btn btn-danger  btn-sm cusrsor-pointer" title="Block"><i className="ri-flag-line"></i></button>
          </div>
        ),
      },
    
    
  ];

  return (
    <Layout>
      <h4 className="page-header">Appointments List</h4>
      <hr />
      <Table columns={columns} dataSource={appointments}/>
      {/* <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modal Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>This is the content of the modal.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCloseModal}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal> */}
    </Layout>
  );
}

export default Appointmentlist;
