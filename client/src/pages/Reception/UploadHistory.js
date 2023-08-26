import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Modal, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Layout from "../../components/Layout";
const UploadHistory = () => {
  const [users, setusers] = useState([]);
  const [selecteduser, setSelecteduser] = useState(null);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);

  useEffect(() => {
    fetchusers();
  }, []);

  const fetchusers = async () => {
    try {
      const response = await axios.get("/api/admin/get-all-approved-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        setusers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchHistoryRecords = async (userId) => {
    try {
      const response = await axios.get(`/api/admin/history/${userId}`);
      if (response.data.success) {
        setHistoryRecords(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching history records:", error);
    }
  };

  const handleViewHistory = (userId) => {
    setSelecteduser(userId);
    fetchHistoryRecords(userId);
  };

  const handleUpload = () => {
    // Implement the logic for uploading user history documents
    // You can use the Upload component from Ant Design and make an API call
    // to upload the documents.
    // After successful upload, close the modal and refresh the history records.
    message.success("Upload successful");
    setUploadModalVisible(false);
    fetchHistoryRecords(selecteduser);
  };

  const handleDelete = async (recordId) => {
    // Implement the logic to delete a user history record
    // Make an API call to delete the record by its ID.
    // After successful deletion, refresh the history records.
    try {
      const response = await axios.delete(`/api/admin/history/${recordId}`);
      if (response.data.success) {
        message.success("Record deleted successfully");
        fetchHistoryRecords(selecteduser);
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const columns = [
    // Define columns for the history records table
    // You can have columns like "Date", "Description", "Actions", etc.
    {
        title: "ID",
        dataIndex: "_id",
    },
  
  ];

  return (
    <Layout>
    <div className="card mb-4">
        <div className="card-header">
      <h5>Select User and Upload History</h5>
      </div>
      <div className="card-body">
        <div className="col-md-4 d-lg-flex justify-content-evenly gap-3 align-items-center">
      <select className="form-control"
        onChange={(e) => handleViewHistory(e.target.value)}
        value={selecteduser}
      >
        <option value="">Select a user</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name} ({user._id})
          </option>
        ))}
      </select>

      <Button
        type="primary"
        onClick={() => setUploadModalVisible(true)}
        disabled={!selecteduser}
      >
        <UploadOutlined /> Upload History
      </Button>
      </div>
      </div>
      
    </div>
    <div className="card ">
        <div className="card-body">
    <Table
        columns={columns}
        dataSource={historyRecords}
        rowKey="_id"
        pagination={false}
      />
     

      <Modal
        title="Upload user History"
        visible={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setUploadModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="upload" type="primary" onClick={handleUpload}>
            Upload
          </Button>,
        ]}
      >
        <Upload.Dragger>
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag files to this area to upload
          </p>
        </Upload.Dragger>
      </Modal>
      </div>
    </div>
    </Layout>
  );
};

export default UploadHistory;
