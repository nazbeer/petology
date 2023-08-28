import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Table, Modal, Button, Form, Input, DatePicker } from "antd";
import moment from "moment";

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [editingDoctor, setEditingDoctor] = useState([]);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);

  const [leaveLoading, setLeaveLoading] = useState(false);
  const [leaveForm] = Form.useForm();
  const [leaveDoctor, setLeaveDoctor] = useState([]);
  const openLeaveModal = (doctor) => {
    leaveForm.resetFields();
    setLeaveDoctor(doctor); // Use setLeaveDoctor here
    leaveForm.setFieldsValue({ doctorId: doctor._id });
    setLeaveModalVisible(true);
  };

  const closeLeaveModal = () => {
    setLeaveModalVisible(false);
  };

  const handleSetLeave = async () => {
    try {
      setLeaveLoading(true);
      const values = await leaveForm.validateFields();
      //console.log(values);
      await axios.post("/api/admin/set-doctor-leave", values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Doctor leave set successfully");
      closeLeaveModal();
      setLeaveLoading(false);
    } catch (error) {
      toast.error("Error setting doctor leave");
      setLeaveLoading(false);
    }
  };

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

  const changeDoctorStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/admin/change-doctor-account-status",
        { doctorId: record._id, userId: record.userId, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        getDoctorsData();
      }
    } catch (error) {
      toast.error("Error changing doctor account status");
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  const openEditModal = (record) => {
    setEditingDoctor(record);
    setEditModalVisible(true);
    form.setFieldsValue(record);
  };

  const closeEditModal = () => {
    setEditingDoctor(null);
    setEditModalVisible(false);
    form.resetFields();
  };

  const updateDoctor = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `/api/admin/update-doctor/${editingDoctor._id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        getDoctorsData();
        closeEditModal();
      }
    } catch (error) {
      toast.error("Error updating doctor information");
      dispatch(hideLoading());
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
         Dr. {record.firstName} {record.lastName}
        </span>
      ),
      responsive: ["xs", "md","sm", "lg"],
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      responsive: ["xs", "md","sm", "lg"],
    },
    {
      title:"Specialization",
      dataIndex:"specialization",
      render:(text, record) => (
        <span className="text-capitalize">{record.specialization}</span>
      ),
      responsive: ["xs", "md","sm", "lg"],
    },
    {
      title:"Experience", 
      dataIndex:"experience",
      render:(text, record)=>(
        <p>{record.experience} Years</p>
      ),
      responsive: ["xs", "md","sm", "lg"],
    },
    {
      title:"Reservation Fees",
      dataIndex: "feePerCunsultation",
      render: (number, record) => {
        return (
          <p className="font-weight-600 text-danger">
            {record.feePerCunsultation} AED
          </p>
        );
      },
      responsive: ["xs", "md","sm", "lg"],
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
      ),
      responsive: ["xs", "md","sm", "lg"],
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
          className="btn btn-primary btn-sm text-capitalize"
          onClick={() => openEditModal(record)}
        >
          edit
        </button>
        <button className="btn btn-warning btn-sm " type="button"  onClick={() => openLeaveModal(record)}>
          Set Leave
        </button>
        </div>
      ),
      responsive: ["xs", "md","sm", "lg"],
    },
  ];
  return (
    <Layout>
       <div className="d-flex justify-content-between align-items-center">
      <h3 className="">Doctor List</h3>
     <a href="/admin/apply-doctor" ><button className="btn btn-success " type="button">Add New Doctor</button></a>

      </div>
      <hr />
      <Table columns={columns} dataSource={doctors}  responsive={true}
  scroll={{ x: true }} />
      <Modal
        title="Edit Doctor"
        visible={editModalVisible}
        onCancel={closeEditModal}
        footer={null}
        style={{borderRadius:"6px"}}
        width={600}
      >
        <Form form={form} onFinish={updateDoctor}   labelCol={{ span: 6 }} 
          wrapperCol={{ span: 18 }}>
       
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone"
            rules={[{ required: true, message: "Please enter phone" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="specialization"
            label="Specialization"
            rules={[{ required: true, message: "Please enter Specialization" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="experience"
            label="Experience"
            rules={[{ required: true, message: "Please enter year of experience" }]}
          >
            <Input />
          </Form.Item>
        
          <Form.Item labelAlign="right" >

            <div className="text-center mt-2">
            <button type="submit" className="btn btn-primary text-right btn-sm">
              Update Doctor Details
            </button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
     
      <Modal
        title={`Set Leave for Dr. ${
          leaveDoctor ? leaveDoctor.firstName : ""
        } ${leaveDoctor ? leaveDoctor.lastName : ""}`}
        visible={leaveModalVisible}
        onCancel={closeLeaveModal}
        footer={[
          <Button key="back" onClick={closeLeaveModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={leaveLoading}
            onClick={handleSetLeave}
          >
            Set Leave
          </Button>,
        ]}
      >
        <p>Doctor ID: {leaveDoctor ? leaveDoctor._id : ""}</p>
        <p>
          Doctor Name:{" "}
          {leaveDoctor ? `${leaveDoctor.firstName} ${leaveDoctor.lastName}` : ""}
        </p>
        <Form form={leaveForm}  labelCol={{ span: 6 }} 
          wrapperCol={{ span: 18 }}>
          <Form.Item
            form={leaveForm}
            name="doctorId"
            label="Doctor Id" hidden
            initialValue={leaveDoctor ? leaveDoctor._id : ""} // Pre-fill the doctorId field
          >
            <Input />
          </Form.Item>
          <Form.Item
            form={leaveForm}
            name="startDate"
            label="Start Date"
            rules={[{ required: true, message: "Please select start date" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            form={leaveForm}
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: "Please select end date" }]}
          >
            <DatePicker />
          </Form.Item>
        </Form>
      </Modal>




    </Layout>
  );
}

export default DoctorsList;