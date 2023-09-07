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
  const [fileList, setFileList] = useState([]);
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
  const renderFile = (path) => {
    const ext = path.split('.').pop().toLowerCase();
    console.log(path);
    // If it's an image
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
      return <img src={path} alt="Uploaded" style={{ width: '100px', height: 'auto' }} />;
    }
    // If it's a PDF
    if (ext === 'pdf') {
      return <iframe src={path} width="100px" height="100px"></iframe>;
    }
    // For .doc or .docx
    if (['doc', 'docx'].includes(ext)) {
      return (
        <iframe 
          src={`https://docs.google.com/viewer?url=${path}&embedded=true`} 
          width="100px" 
          height="100px" 
          frameBorder="0"
        ></iframe>
      );
    }
    // Add other file types if needed
  //  console.log(path);
    return <a href={path} target="_blank" rel="noreferrer">Open File</a>;
  }
  
  const handleUpload = async () => {
    try {
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append("files", file.originFileObj);
        });

        const response = await axios.post(`/api/admin/upload-history/${selecteduser}`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "multipart/form-data",
            },
        });
        console.log('react:', response);
     
        if (response.data.success) {
            message.success("Upload successful");
            setUploadModalVisible(false);
            fetchHistoryRecords(selecteduser);
        } else {
            message.error("Upload failed");
        }
    } catch (error) {
        console.error("Error uploading files:", error);
        message.error("Error uploading files");
    }
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
    {
      title: "Patient History",
      dataIndex: "documentPath",
     render: (path) => renderFile(path),
    }
  ];

  return (
    <Layout>
    <div className="card mb-4">
        <div className="card-header">
      <h5  className="mb-0">Select User and Upload History</h5>
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
        <div className="card-header">
            <h5 className="mb-0">Uploaded Records</h5>
        </div>
        <div className="card-body p-2">
    <Table
        columns={columns}
        dataSource={historyRecords}
        rowKey="_id"
        pagination={false}
        style={{padding:'0px'}}
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
       <Upload.Dragger onChange={(info) => setFileList(info.fileList)}>
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
