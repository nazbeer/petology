import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Modal, Upload, Button, message } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import Layout from "../../components/Layout";

const UploadHistory = ({ selectedUser, visible, onClose }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);


  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/admin/get-all-approved-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(response.data.data);
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
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
    setSelectedUser(userId);
    fetchHistoryRecords(userId);
  };

  useEffect(() => {
    setFileList([]);
  }, [visible]);

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.error("Please select a file to upload");
      return;
    }

    try {
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("files", file);
      });
    //  console.log(formData);
      await axios.post("/api/admin/upload-history", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      message.success("Upload successful");
      setUploadModalVisible(false);
      fetchHistoryRecords(selectedUser);
    } catch (error) {
      message.error("Error Uploading files");
      console.error(error);
    }
  };

  const uploadProps = {
    fileList,
    userId,
    onChange: ({ fileList }) => setFileList(fileList),
  };

  const handleDelete = async (recordId) => {
    try {
      const response = await axios.delete(`/api/admin/history/${recordId}`);
      if (response.data.success) {
        message.success("Record deleted successfully");
        fetchHistoryRecords(selectedUser);
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };
 
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
    },
    // Add other columns as needed
    {
      title: "Actions",
      dataIndex: "actions",
      render: (recordId) => (
        <Button type="link" danger onClick={() => handleDelete(recordId)}>
          Delete
        </Button>
      ),
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
            <select
              className="form-control"
              onChange={(e) => handleViewHistory(e.target.value)}
              value={selectedUser}
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
              disabled={!selectedUser}
            >
              <UploadOutlined /> Upload History
            </Button>
          </div>
        </div>
      </div>
      <div className="card ">
        <div className="card-body">
          <Table columns={columns} dataSource={historyRecords} rowKey="_id" pagination={false} />

          <Modal
            title="Upload History Documents"
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
            <Upload.Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag files to this area to upload</p>
            </Upload.Dragger>
          </Modal>
        </div>
      </div>
    </Layout>
  );
};

export default UploadHistory;
