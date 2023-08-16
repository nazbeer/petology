import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import {Modal, Button, Table, Input, Form } from "antd";
import moment from "moment";

function Userslist() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const dispatch = useDispatch();

  const getUsersData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/user/get-all-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getUsersData();
  }, []);

  const viewUser = (user) => {
    setSelectedUser(user);
    setViewModalVisible(true);
  };

  const editUser = (user) => {
    setSelectedUser(user);
    setEditModalVisible(true);
  };

  const deleteUser = (user) => {
    setSelectedUser(user);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.delete(
        `/api/user/delete-user/${selectedUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setDeleteModalVisible(false);
        getUsersData();
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const [form] = Form.useForm();

  const handleEdit = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.put(
        `/api/user/edit-user/${selectedUser._id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setEditModalVisible(false);
        getUsersData();
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "mobile",
    },
    {title:"Status",
  dataIndex:"status"},
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (record , text) => moment(record.createdAt).format("DD-MM-YYYY"),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex justify-content-evenly">
          <Button
            type="success" className="btn btn-success btn-sm"
            onClick={() => viewUser(record)}
          >
           <i className="ri-eye-line"></i>
          </Button>
          <Button
            type="warning" className="btn btn-warning btn-sm"
            onClick={() => editUser(record)}
          >
          <i className="ri-edit-line"></i>
          </Button>
          <Button
            type="danger" className="btn btn-danger btn-sm"
            onClick={() => deleteUser(record)}
          >
           <i className="ri-delete-bin-line"></i>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h4 className="page-header">Users List</h4>
      <hr />
      <Table columns={columns} dataSource={users}/>
       {/* View User Modal */}
       <Modal
        title="View User"
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
      >
        {selectedUser && (
          <div>
            <p>Name: {selectedUser.name}</p>
            <p>Email: {selectedUser.email}</p>
            <p>Phone Number: {selectedUser.mobile}</p>
            {/* Add more user details */}
          </div>
        )}
      </Modal>

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleEdit}
          initialValues={{
            name: selectedUser?.name,
            mobile: selectedUser?.mobile,
          }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please enter the name",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="mobile"
            label="Mobile"
            rules={[
              {
                required: true,
                message: "Please enter the mobile number",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* Implement edit user modal with form fields */}
      {/* Delete User Modal */}
      <Modal
        title="Delete User"
        visible={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>
    </Layout>
  );
}

export default Userslist;
