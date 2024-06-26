import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { Table, Modal, Input, Form } from "antd";
import moment from "moment";
import { Buffer } from "buffer";
import { toast } from "react-hot-toast";
import logo from "../../images/logo-petology.png";
function Petlist() {
  const [pets, setPets] = useState([]);
  const dispatch = useDispatch();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedPet, setEditedPet] = useState({});
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
        console.log(response.data.data);
        setPets(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getPetsData();
  }, []);
  const handleView = (record) => {
    // Implement the logic to view the pet details
    // You can use a modal or a separate page to display the details
    Modal.info({
      title: `Viewing Details of ${record.pet} - ${record.breed}`,
      // size: `large`,

      content: (
        <div>
          <div className="row">
            <div className="d-lg-flex justify-content-between align-items-center gap-3">
              <strong>Pet:</strong> {record.pet}
            </div>
            <div className="d-lg-flex justify-content-between align-items-center gap-3">
              <strong>Breed:</strong> {record.breed}
            </div>
            <div className="d-lg-flex justify-content-between align-items-center gap-3">
              <strong>Size:</strong> {record.size}
            </div>
            <div className="d-lg-flex justify-content-center align-items-center">
              <img
                width={50}
                height={50}
                src={base64ToDataUrl(record.image)}
                alt="PET"
              />
            </div>
          </div>
        </div>
      ),
      onOk() {},
    });
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
    // Implement the logic to delete the pet
    // Show a confirmation dialog and then make an API call to delete the pet
    const confirmed = window.confirm(
      "Are you sure you want to delete this pet?"
    );
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
    if (!record.image) {
      return (
        <img src={logo} className="petimg img-responsive" alt="Default Logo" />
      );
    } else {
      const imageUrl = base64ToDataUrl(record.image);
      console.log(imageUrl);
      return (
        <img
          src={imageUrl}
          className="petimg img-responsive"
          alt="Pet"
          style={{ borderRadius: "100%" }}
        />
      );
    }
  };

  const base64ToDataUrl = (base64String) => {
    const url = `http://localhost:5000/${base64String}`;
    const mainPath = url.replace(/^uploads\\/, "").toLowerCase();
    console.log(mainPath);

    return mainPath;
  };
  const generateCustomID = (createdAt) => {
    const formattedDate = moment(createdAt).format("YYYYMMDD");
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    return `${formattedDate}-1${randomSuffix}`;
  };

  const columns = [
    {
      title: "Pet Image",
      dataIndex: "image",
      render: (text, record) => (
        <span className="d-flex justify-content-center">
          {renderImage(record)}
        </span>
      ),
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Pet",
      dataIndex: "pet",
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Breed",
      dataIndex: "breed",
      render: (text, record) => <span>{record.breed}</span>,
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Size",
      dataIndex: "size",
      render: (text, record) => <span>{record.size}</span>,
      responsive: ["xs", "md", "sm", "lg"],
    },

    // {
    //   title: "Created At",
    //   dataIndex: "createdAt",
    //   render: (record, text) => moment(record.createdAt).format("DD MMM, YYYY"),
    //   // sorter: (a, b) => moment(a.createdAt) - moment(b.createdAt), // Sorting function
    //   // defaultSortOrder: "descend", // Default sorting order
    // },
    {
      title: "Actions",
      dataIndex: "status",
      render: (text, record) => (
        <div className="d-flex justify-content-evenly gap-3">
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
      responsive: ["xs", "md", "sm", "lg"],
    },
  ];

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="page-header mb-0">Pet List</h4>
        <a href="/admin/addpet">
          <button className="btn btn-success btn-sm" type="button">
            Add New Pet
          </button>
        </a>
      </div>
      <hr />
      <Table
        columns={columns}
        dataSource={pets}
        responsive={true}
        scroll={{ x: true }}
      />
      <Modal
        title={`Edit Pet - ${editedPet.pet}`}
        visible={editModalVisible}
        onCancel={handleCancel}
        onOk={handleSave}
        okText="Save"
        cancelText="Cancel"
      >
        <Form layout="vertical">
          <Form.Item label="Pet">
            <Input
              value={editedPet.pet}
              onChange={(e) =>
                setEditedPet({ ...editedPet, pet: e.target.value })
              }
            />
          </Form.Item>
          {/* Add more form fields for editing */}

          <Form.Item label="Pet Name">
            <Input
              value={editedPet.petName}
              onChange={(e) =>
                setEditedPet({ ...editedPet, pet: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item label="Age">
            <Input
              value={editedPet.age}
              onChange={(e) =>
                setEditedPet({ ...editedPet, pet: e.target.value })
              }
            />
          </Form.Item>
          {/* Add more form fields for editing */}
        </Form>
      </Modal>
    </Layout>
  );
}

export default Petlist;
