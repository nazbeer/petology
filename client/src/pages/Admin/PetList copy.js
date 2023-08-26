import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { Table, Modal, Input, Form } from "antd";
import moment from "moment";
import { Buffer } from 'buffer';
import { toast } from "react-hot-toast";
import logo from "../../images/logo-petology.png";

function Petlist() {
  const [pets, setPets] = useState([]);
  const dispatch = useDispatch();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedPet, setEditedPet] = useState({});
  const [usersData, setUsersData] = useState({});
  const getPetsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/pet/get-all-pets", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setPets(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getPetsData();
    fetchUserData();
  }, []);
  const handleView = (record) => {
     Modal.info({
      title: `Viewing Details of ${record.pet} - ${record.breed}`,
      size:`large`,
     
      content: (
        <div className="row">
          <div className="d-lg-flex justify-content-between align-items-center gap-3"><strong>Pet Name:</strong> {record.pet}</div>
          <div className="d-lg-flex justify-content-between align-items-center gap-3"><strong>Breed:</strong> {record.breed}</div>
          <div className="d-lg-flex justify-content-between align-items-center gap-3"><strong>Size:</strong> {record.size}</div>
          <div><img src={record.image}/></div>
         
        </div>
      ),
      onOk() {},
    });
  };
  
  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`/api/admin/get-all-pets-by-user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(response.data);
      if (response.data.success) {
        setUsersData(prevUsersData => ({
          ...prevUsersData,
          [userId]: response.data.data
        }));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  
  const handleEdit = (record) => {
    setEditedPet(record);
    setEditModalVisible(true);
  };

  const handleCancel = () => {
    setEditModalVisible(false);
    setEditedPet({});
  };

  const handleSave = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.put(
        `/api/pet/edit-pet/${editedPet._id}`,
        editedPet,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        getPetsData();
        setEditModalVisible(false);
        setEditedPet({});
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Error editing pet");
    }
  };


  const handleDelete = async (petId) => {
    const confirmed = window.confirm("Are you sure you want to delete this pet?");
    if (confirmed) {
      try {
        dispatch(showLoading());
        const response = await axios.delete(`/api/pet/delete-pet/${petId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        dispatch(hideLoading());
        if (response.data.success) {
          toast.success(response.data.message);
          getPetsData();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        dispatch(hideLoading());
        toast.error("Error deleting pet");
      }
    }
  };
  const renderImage = (record) => {
    const imageUrl = base64ToDataUrl(record.image);
    return (
      <img
        src={imageUrl}
        className="petimg img-responsive"
        alt="Pet Image"
        style={{ borderRadius: '100%' }}
      />
    );
  };
  
  

  const base64ToDataUrl = (filename) => {
    return `http://localhost:5000/routes/uploads/${filename}`;
  };
  
  const columns = [
    {
      title: "Client Name",
      dataIndex: "client",
      render: (text, record) => (
        <span>
          {usersData[record.client.userId]?.firstName || ""}
        </span>
      ),
    },
    {
      title: "Pet Image",
      dataIndex: "image",
      render: (text, record) => (
        <span className="d-flex justify-content-center">
          {renderImage(record)}
        </span>
      ),
    },
    
    {
        title:"Pet",
        dataIndex:"pet",
        
    },
    {
        title:"Breed",
        dataIndex:"breed",
        render:(text, record)=>(
            <span>
                {record.breed}
            </span>
        )
    }, 
    {
        title:"Size",
        dataIndex:"size",
        render:(text, record)=>(
            <span>
                {record.size}
            </span>
        )
    }, 
 
  
    {
      title: "Actions",
      dataIndex: "status",
      render: (text, record) => (
        <div className="d-flex justify-content-evenly">
          <button
            type="button"
            className="btn btn-success btn-sm cusrsor-pointer"
            onClick={() => handleView(record)}
          >
            <i className="ri-eye-line"></i>
          </button>
          <button
            type="button"
            className="btn btn-warning btn-sm cusrsor-pointer"
            onClick={() => handleEdit(record)}
          >
            <i className="ri-edit-line"></i>
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm cusrsor-pointer"
            onClick={() => handleDelete(record._id)}
          >
            <i className="ri-flag-line"></i>
          </button>
        </div>
      ),
    },
    
  ];

  return (
    <Layout>
    <div className="d-flex justify-content-between align-items-center">
      <h4 className="page-header mb-0">Pet List</h4>
     <a href="/admin/addpet" ><button className="btn btn-success btn-sm" type="button">Add New Pet</button></a>

      </div>
      <hr />
      <Table columns={columns} dataSource={pets} rowKey="_id"/>
      <Modal
        title={`Edit Pet - ${editedPet.pet}`}
        visible={editModalVisible}
        onCancel={handleCancel}
        onOk={handleSave}
        okText="Save"
        cancelText="Cancel"
      >
        <Form>
          <Form.Item label="Pet Name">
            <Input
              value={editedPet.pet}
              onChange={(e) =>
                setEditedPet({ ...editedPet, pet: e.target.value })
              }
            />
          </Form.Item>
       
        </Form>
      </Modal>
    </Layout>
  );
}

export default Petlist;
