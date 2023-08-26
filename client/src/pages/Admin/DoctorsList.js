import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import {toast} from 'react-hot-toast'
import axios from "axios";
import { Table, Modal, Button, Form, Input} from "antd";
import moment from "moment";

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const getDoctorsData = async () => {
    try {
      dispatch(showLoading());
      const resposne = await axios.get("/api/admin/get-all-approved-doctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (resposne.data.success) {
        setDoctors(resposne.data.data);
      }
    } catch (error) {
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
      title:"Reservation Fees",
      dataIndex: "feePerCunsultation",
      render: (number, record) => {
        return (
          <p className="font-weight-600 text-danger">
            {record.feePerCunsultation} AED
          </p>
        );
      }
    },
    // {
    //   title:"Surgery Fees",
    //   dataIndex: "surgeryfees",
    //   render: ( number, record) => {
    //     return (
    //       <p className="font-weight-600 text-success">
    //         {record.surgeryfees} AED
    //       </p>
    //     );
    //   }
    // },
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
          className="btn btn-primary btn-sm text-capitalize"
          onClick={() => openEditModal(record)}
        >
          edit
        </button>
        </div>
      ),
    },
  ];
  return (
    <Layout>
       <div className="d-flex justify-content-between align-items-center">
      <h3 className="">Doctor List</h3>
     <a href="/admin/apply-doctor" ><button className="btn btn-success " type="button">Add New Doctor</button></a>

      </div>
      <hr />
      <Table columns={columns} dataSource={doctors} />
      <Modal
        title="Edit Doctor"
        visible={editModalVisible}
        onCancel={closeEditModal}
        footer={null}
        style={{borderRadius:"6px"}}
        width={600}
      >
        <Form form={form} onFinish={updateDoctor}   labelCol={{ span: 6 }} // Adjust the span value as needed
          wrapperCol={{ span: 18 }}>
          {/* Editable fields */}
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
    </Layout>
  );
}

export default DoctorsList;
