import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Table, Modal, Button, Form, Input, DatePicker, Select, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import moment from "moment";

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [editingDoctor, setEditingDoctor] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      dispatch(showLoading());
      const response = await axios.get("/api/admin/get-all-approved-doctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        const doctorsData = response.data.data;
  
        // Fetch leaves for each doctor and set them in the data
        for (const doctor of doctorsData) {
          const leavesResponse = await axios.get(`/api/admin/get-doctor-leaves/${doctor._id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
  
          if (leavesResponse.data.success) {
            doctor.leaves = leavesResponse.data.data;
          }
        }
  
        setDoctors(doctorsData);
        setLoading(false);
      }
    } catch (error) {
      dispatch(hideLoading());
      setLoading(false); 
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
      title: "Break Time",
      dataIndex: "breakTime",
      render: (text, record) => {
        const breakTime = record.breakTime;
        if (breakTime === '30') {
          return <span className="text-capitalize">{breakTime} mins</span>;
        } else if (breakTime === '1' ||  breakTime === '1.5' || breakTime === '2') {
          return <span >{breakTime} Hour(s)</span>;
        } else {
          // Handle other cases if needed
          return <span className="text-capitalize">{breakTime} </span>;
        }
      },
    },
    {
      title: "Leaves",
      dataIndex: "leaves",
      render: (leaves, record) => (
        <div>
          {leaves && leaves.length > 0 ? (
            leaves.map((leave, index) => (
              <div key={index}>
                <span>Start Date: {moment(leave.startDate).format("DD-MM-YYYY")}</span>
                <br />
                <span>End Date: {moment(leave.endDate).format("DD-MM-YYYY")}</span>
                <br />
              </div>
            ))
          ) : (
            <span>No Leaves Available</span>
          )}
        </div>
      ),
    },
    
    {
      title:"Clinic Fees",
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
  const customLoader = (
    <div style={{ textAlign: "center", margin: "50px auto" }}>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: "#1890ff" }} spin />} />
      <p style={{ marginTop: "10px" }}>Loading...</p>
    </div>
  );
  return (
    <Layout>
       <div className="d-flex justify-content-between align-items-center">
      <h5 className="page-title mb-0">Doctor List</h5>
     <a href="/admin/apply-doctor" ><button className="btn btn-success " type="button">Add New Doctor</button></a>

      </div>
      <hr />
      {loading ? (
        customLoader // Use the custom loader
      ) : (
        <Table columns={columns} dataSource={doctors} responsive={true} scroll={{ x: true }} />
      )}
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
          <Form.Item
    name="breakTime"
    label="Break Time"
    rules={[{ required: true, message: "Please select break time" }]}
  >
    <Select>
      <Select.Option value={30}>30 mins</Select.Option>
      <Select.Option value={45}>45 mins</Select.Option>
      <Select.Option value={1}>1 hour</Select.Option>
      <Select.Option value={1.5}>1.5 hours</Select.Option>
      <Select.Option value={2}>2 hours</Select.Option>
    </Select>
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
        width={800}
        className="d-flex justify-content-center align-items-center"
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
        <div className="d-lg-flex justify-content-between align-items-center gap-3">
        <p className="text-dark">Doctor ID: {leaveDoctor ? leaveDoctor._id : ""}</p>
        <p className="text-dark">
          Doctor Name:{" "}
          {leaveDoctor ? `${leaveDoctor.firstName} ${leaveDoctor.lastName}` : ""}
        </p>
        </div>
        <Form form={leaveForm} labelCol={{ span: 8 }} 
          wrapperCol={{ span: 12 }} >
          <Form.Item
            form={leaveForm}
            name="doctorId" style={{marginTop:'10px'}}
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