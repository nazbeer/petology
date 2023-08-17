import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { toast } from "react-hot-toast";
import {Modal, Button } from 'antd';
//import { use } from "../../../../routes/openRoute";

const AddPack = () => {
    const serviceTypes = ["Veterinary", "Grooming", "Mobile Grooming", "Mobile Veterinary"];
    const [serviceType, setServiceType] = useState("");
    const [serviceName, setServiceName] = useState("");
    const [subServiceName, setSubServiceName] = useState("");
    const [subServices, setSubServices] = useState([]);
    const [selectedService, setSelectedService] = useState("");
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editSubServiceId, setEditSubServiceId] = useState("");
    const [editSubService, seteditSubService] = useState("");
    const [editServiceType, setEditServiceType]= useState("");
    const [editServiceName, setEditServiceName] = useState("");
    const [editStatus, setEditStatus] = useState();

  const showEditModal = (subServiceId, serviceType , name , subService) => {
    setEditModalVisible(true);
    setEditSubServiceId(subServiceId);
    setEditServiceType(serviceType);
    setEditServiceName(name);
    seteditSubService(subService);
    

  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setEditSubServiceId("");
    seteditSubService("");
  };
  const handleEditSubService = async () => {
    try {
      const response = await axios.put(
        `/api/admin/edit-subservice/${editSubServiceId}`,
        {
          serviceType: editServiceType,
          name: editServiceName,
          subService: editSubService,
          status: editStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
        console.log(response.data);
      if (response.data.success) {
        toast.success("Sub-service updated successfully");
        closeEditModal();
        fetchSubServices();
      }
    } catch (error) {
      toast.error("Error updating sub-service");
    }
  };

  const handleDeleteSubService = async (subServiceId) => {
    try {
      const response = await axios.delete(`/api/admin/delete-subservice/${subServiceId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        toast.success("Sub-service deleted successfully");
        fetchSubServices();
      }
    } catch (error) {
      toast.error("Error deleting sub-service");
    }
  };

  const handleServiceTypeChange = (event) => {
    setServiceType(event.target.value);
  };

  const fetchSubServices = async () => {
    try {
      const response = await axios.get("/api/admin/subservices", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        setSubServices(response.data.data);
      }
    } catch (error) {
      toast.error("Error fetching sub-services.");
    }
  };

  useEffect(() => {
    fetchSubServices();
  }, []);



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post("/api/admin/create-service", {
            serviceType,
            serviceName,
            subServiceName,
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchSubServices();

      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.code === 11000) {
        toast.error("Service name already exists. Please choose a different name.");
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <Layout>
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Add New Service</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
          <div className="mb-3">
              <label htmlFor="serviceType">Service Type:</label>
              <select
                id="serviceType"
                className="form-control"
                value={serviceType}
                onChange={handleServiceTypeChange}
                required
              >
                <option value="">Select Service Type</option>
                {serviceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="serviceName">Package Name:</label>
              <input
                type="text"
                id="serviceName"
                className="form-control"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="subServiceName">Sub Service Name:</label>
              <input
                type="text"
                id="subServiceName"
                className="form-control"
                value={subServiceName}
                onChange={(e) => setSubServiceName(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-success">
              Add Service
            </button>
          </form>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          <h5 className="mb-0">List of Services &amp; Packages</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive-sm">
            <table className="table table-responsive">
                <thead>
                    <th>Service Name</th>
                    <th>Package Name</th>
                    <th>All Services</th>
                    <th>Status</th>
                    <th>Actions</th>
                </thead>
                <tbody>
                {subServices.map((subService) => (
                    <tr key={subService._id}>
                        <td>
                            <span>
                                {subService.serviceType}
                            </span>
                        </td>
                        <td>
                            <span>
                                {subService.name}
                            </span>
                        </td>

                        <td>            
                            <span>
                                {subService.subService}
                            </span>
                        </td>
                        <td>
                            <span className="text-capitalize">
                                {subService.status}
                            </span>
                        </td>
                        <td>
                        <div className="d-flex justify-content-evenly">
                        <button
                          type="button"
                          className="btn btn-warning btn-sm cusrsor-pointer"
                          onClick={() =>
                            showEditModal(
                              subService._id,
                              subService.serviceType,
                              subService.name,
                              subService.subService,
                              subService.status
                            )
                          }
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm cusrsor-pointer"
                          onClick={() => handleDeleteSubService(subService._id)}
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                        </td>
                    </tr>
                          ))}
                </tbody>
            </table>
            


              
      

          </div>
        </div>
      </div>
      <Modal
        title="Edit Sub-service"
        visible={editModalVisible}
        onCancel={closeEditModal}
        footer={[
          <Button key="cancel" onClick={closeEditModal}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleEditSubService}>
            Update
          </Button>,
        ]}
      >
        <div className="mb-3">
          <label htmlFor="editServiceType">Service Type:</label>
          <select
            id="editServiceType"
            className="form-control"
            value={editServiceType}
            onChange={(e) => setEditServiceType(e.target.value)}
            required
          >
            <option value="">Select Service Type</option>
            {serviceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="editServiceName">Package Name:</label>
          <input
            type="text"
            id="editServiceName"
            className="form-control"
            value={editServiceName}
            onChange={(e) => setEditServiceName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="editSubService">Sub Service Name:</label>
          <input
            type="text"
            id="editSubService"
            className="form-control"
            value={editSubService}
            onChange={(e) => seteditSubService(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="editStatus">Status:</label>
          <select
            id="editStatus"
            className="form-control"
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value)}
            required
          >
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </Modal>
    </Layout>
  );
};

export default AddPack;
