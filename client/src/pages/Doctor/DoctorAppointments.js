import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { toast } from "react-hot-toast";
import PrescriptionForm from "../../components/PrescriptionForm";
import axios from "axios";
import { Table, Button, Modal } from "antd";
import moment from "moment";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(true);

  const showModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const showAddPrescriptionModal = (appointment) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  const hideAddPrescriptionModal = () => {
    setSelectedAppointment(null);
    setModalVisible(false);
  };

  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        "http://127.0.0.1:5000/api/doctor/get-appointments-by-doctor-id",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointments(response.data.data);
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
        { appointmentId : record._id, status: status },
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
      dataIndex: "_id",
    },
    {
      title: "Patient",
      dataIndex: "name",
      render: (text, record) => <span>{record.userInfo.name}</span>,
    },
    // {
    //   title: "Pet",
    //   dataIndex: "pet",
    //   render: (text, record) => <span>{record.petInfo.pet}</span>,
    // },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (text, record) => <span>{record.doctorInfo.phoneNumber}</span>,
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")}{" "}
          {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render:(text, record) => (
        <span className="text-capitalize">{record.status}</span>
      )
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex justify-content-evently gap-2 align-items-center">
          {record.status === "pending" ||record.status === "approved" && (
            <div className="d-flex gap-2">
             
               <Button type="success"  onClick={() => changeAppointmentStatus(record, "approved")}> Approve</Button>
           
            
              <Button type="danger"   onClick={() => changeAppointmentStatus(record, "rejected")}>  Reject</Button>
            
            </div>
          )}
          <Button type="primary" onClick={showAddPrescriptionModal}>
            Add Prescription
          </Button> 
         
        </div>
      ),
    },
  ];
  useEffect(() => {
    getAppointmentsData();
  }, []);
  return (
    <Layout>
      <h1 className="page-header">Appointments</h1>
      <hr />
      <Table columns={columns} dataSource={appointments} />

      <Modal
        title="Add Prescription"
        visible={modalVisible}
        onCancel={hideAddPrescriptionModal}
        footer={null}
        width={700}
      >
        {selectedAppointment && (
          <PrescriptionForm
            appointmentId={selectedAppointment._id} // Pass appointmentId as a prop
            onClose={hideAddPrescriptionModal}
          />
        )}
      </Modal>
    </Layout>
  );
}

export default DoctorAppointments;
