import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { Modal, Button, Table, Input, Form, Select, DatePicker } from "antd";
import moment from "moment";

import JsPDF from "jspdf";
import "jspdf-autotable";

function Userslist() {
  const { RangePicker } = DatePicker;

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [filter, setFilter] = useState(true);

  const [filterType, setFilterType] = useState("");
  let [onlyDate, setOnlyDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const dispatch = useDispatch();

  const handleFilterType = (event) => {
    console.log(event.target.value);
    setFilterType(event.target.value);
  };

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
        const usersWithUserType = response.data.data.map((user) => ({
          ...user,
          userType: getUserType(user),
        }));
        setUsers(usersWithUserType);
        //  setUsers(response.data.data);
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

  const closeEditModal = () => {
    setEditModalVisible(false);
    window.location.reload(); // Reload the site
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
      // Handle userType change
      if (values.userType !== selectedUser.userType) {
        const updatedUserType = values.userType;
        values.isDoctor = updatedUserType === "doctor";
        values.isGroomer = updatedUserType === "groomer";
        values.isNurse = updatedUserType === "nurse";
        values.isAdmin = updatedUserType === "admin";
        values.isUser = updatedUserType === "user";
      }
      const response = await axios.put(
        `/api/user/edit-user/${selectedUser._id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log({ response });
      dispatch(hideLoading());
      if (response.data.success) {
        setEditModalVisible(false);
        getUsersData();
        window.location.reload();
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const getUserType = (user) => {
    if (user.isDoctor) {
      return "Doctor";
    } else if (user.isGroomer) {
      return "Groomer";
    } else if (user.isNurse) {
      return "Receptionist";
    } else if (user.isAdmin) {
      return "Admin";
    } else {
      return "User";
    }
  };
  const rescolumns = [
    {
      title: "Name",
      dataIndex: "name",
      responsive: ["xs"],
    },
    {
      title: "Email",
      dataIndex: "email",
      responsive: ["xs"],
    },
    {
      title: "Phone Number",
      dataIndex: "mobile",
      responsive: ["xs"],
    },
    {
      title: "Status",
      dataIndex: "status",
      responsive: ["xs"],
      render: (text, record) => (
        <span className="text-capitalize">{record.status}</span>
      ),
    },
    {
      title: "User Type",
      dataIndex: "userType",
      responsive: ["xs"],
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      responsive: ["xs"],
      //render: (record , text) => moment(record.createdAt).format("D MMM, YYYY"),
      render: (date, record) => (
        <span className="w-100">
          {moment(record.createdAt).format("D MMM, YYYY")}
        </span>
      ),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      responsive: ["xs"],
      render: (date, record) => (
        <span>{moment(record.updatedAt).format("D MMM, YYYY | hh:mm:ss")}</span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      responsive: ["xs"],
      render: (text, record) => (
        <div className="d-flex justify-content-evenly gap-2">
          <Button
            type="success"
            className="btn btn-success btn-sm"
            onClick={() => viewUser(record)}
          >
            <i className="ri-eye-line"></i>
          </Button>
          <Button
            type="warning"
            className="btn btn-warning btn-sm"
            onClick={() => editUser(record)}
          >
            <i className="ri-edit-line"></i>
          </Button>
          <Button
            type="danger"
            className="btn btn-danger btn-sm"
            onClick={() => deleteUser(record)}
          >
            <i className="ri-delete-bin-line"></i>
          </Button>
        </div>
      ),
    },
  ];
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
    {
      title: "Status",
      dataIndex: "status",

      render: (text, record) => (
        <span className="text-capitalize">{record.status}</span>
      ),
    },
    {
      title: "User Type",
      dataIndex: "userType",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",

      //render: (record , text) => moment(record.createdAt).format("D MMM, YYYY"),
      render: (date, record) => (
        <span className="w-100">
          {moment(record.createdAt).format("D MMM, YYYY")}
        </span>
      ),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",

      render: (date, record) => (
        <span>{moment(record.updatedAt).format("D MMM, YYYY | hh:mm:ss")}</span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",

      render: (text, record) => (
        <div className="d-flex justify-content-evenly gap-2">
          <Button
            type="success"
            className="btn btn-success btn-sm"
            onClick={() => viewUser(record)}
          >
            <i className="ri-eye-line"></i>
          </Button>
          <Button
            type="warning"
            className="btn btn-warning btn-sm"
            onClick={() => editUser(record)}
          >
            <i className="ri-edit-line"></i>
          </Button>
          <Button
            type="danger"
            className="btn btn-danger btn-sm"
            onClick={() => deleteUser(record)}
          >
            <i className="ri-delete-bin-line"></i>
          </Button>
        </div>
      ),
    },
  ];

  const handleFilter = () => {
    onlyDate = new Date(onlyDate);
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    const filtered = users.filter((item) => {
      console.log(item);
      const itemDate = new Date(item?.createdAt);
      console.log(
        onlyDate.toDateString(),
        startDateObj.toDateString(),
        endDateObj.toDateString(),
        itemDate.toDateString()
      );
      if (filterType === "Date") {
        return itemDate.toDateString() === onlyDate.toDateString();
      } else {
        // Date range filter
        console.log(
          itemDate.toDateString(),
          startDateObj.toDateString(),
          endDateObj.toDateString()
        );

        return (
          itemDate.toDateString() >= startDateObj.toDateString() &&
          itemDate.toDateString() <= endDateObj.toDateString()
        );
      }
    });

    console.log(filtered);

    setFilteredData(filtered.length > 0 ? filtered : null);

    console.log(filtered.length > 0 ? filtered : null);

    setFilter(false);
  };

  const onChangeDate = (date, dateString) => {
    setOnlyDate(moment(dateString).format("LL"));

    console.log(moment(dateString).format("LL"));
  };

  const onChangeRange = (date, dateString) => {
    setStartDate(moment(dateString[0]).format("LL"));
    setEndDate(moment(dateString[1]).format("LL"));
    console.log(
      moment(dateString[0]).format("LL"),
      moment(dateString[1]).format("LL")
    );
  };

  const createPdfWithTable = async (data) => {
    const doc = new JsPDF();
    doc.setFontSize(30);
    doc.text(80, 20, "Payments");

    doc.setFontSize(20);

    const headers = [
      "Name",
      "Email",
      "Phone Number",
      "Status",
      "User Type",
      "Created At",
    ];
    const datas = filteredData && filteredData.map((item) => [
      item?.name,
      item?.email,
      item?.mobile,
      item?.status,
      item?.userType,
      moment(item?.createdAt).format("LL"),
    ]);
    console.log(datas);

    doc.autoTable({
      head: [headers],
      body: datas,
      theme: "striped",
      margin: { top: 30 },
    });

    const pdfBytes = doc.save("users.pdf");

    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.pdf";
    a.click();

    // Clean up
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <h4 className="page-header">Users List</h4>
      <hr />
      <div className="row">
        <div className="mb-2 col">
          <select
            className="form-control"
            id="break"
            name="break"
            value={filterType}
            onChange={handleFilterType}
          >
            <option defaultValue="">Select Filter...</option>
            <option value="Date">Date</option>
            <option value="Range">Range</option>
            {/* <option value="Weekly">Weekly</option>
              <option value="Montly">Montly</option> */}
          </select>
        </div>
        {filterType === "Range" && (
          <div className="mb-2 col">
            <RangePicker onChange={onChangeRange} style={{ width: "100%" }} />
          </div>
        )}
        {filterType === "Date" && (
          <div className="mb-2 col">
            <DatePicker
              onChange={onChangeDate}
              size="large"
              style={{ width: "100%" }}
            />
          </div>
        )}
        <div className="mt-1 col">
          <button
            type="submit"
            className="btn btn-success btn-sm me-3"
            onClick={handleFilter}
          >
            Filter
          </button>
          <button
            type="submit"
            className="btn btn-success btn-sm"
            onClick={createPdfWithTable}
            disabled={filter}
          >
            Export to PDF
          </button>
        </div>
      </div>

      {filteredData !== null ? (
        filteredData.length > 0 ? (
          <Table
            columns={columns}
            dataSource={filteredData}
            responsive={true}
            scroll={{ x: true }}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={users}
            responsive={true}
            scroll={{ x: true }}
          />
        )
      ) : (
        <div className="text-center m-5">No result found</div>
      )}

      {/* View User Modal */}
      <Modal
        title="View User Details"
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
      >
        {selectedUser && (
          <div>
            <p>Name: {selectedUser.name}</p>
            <p>Email: {selectedUser.email}</p>
            <p>Phone Number: {selectedUser.mobile}</p>
          </div>
        )}
      </Modal>

      {/* Edit User Modal */}
      <Modal
        size="large"
        title="Edit User Details"
        visible={editModalVisible}
        footer={null}
        onCancel={closeEditModal}
        style={{ borderRadius: "6px" }}
        width={700}
      >
        <Form
          form={form}
          onFinish={handleEdit}
          initialValues={{
            name: selectedUser?.name,
            email: selectedUser?.email,
            mobile: selectedUser?.mobile,
            status: selectedUser?.status,
            userType: selectedUser?.userType,
          }}
          style={{ padding: "0px" }}
          labelCol={{ span: 6 }} // Adjust the span value as needed
          wrapperCol={{ span: 18 }} // Adjust the span value as needed
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please enter the New Name",
              },
            ]}
          >
            <Input className="form-control" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Change Email"
            rules={[
              {
                required: true,
                message: "Please enter the New email",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Change Status"
            rules={[
              {
                required: true,
                message: "User Status can be assigned here",
              },
            ]}
          >
            <Select>
              <Select.Option value="approved">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
              <Select.Option value="blocked">Blocked</Select.Option>
              <Select.Option value="pending">Pending</Select.Option>
              {/* Add more status options if needed */}
            </Select>
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
          <Form.Item
            name="userType"
            label="Change User Type"
            rules={[
              {
                required: true,
                message: "Please select a new user type",
              },
            ]}
            style={{ paddingBottom: "5px" }}
          >
            <Select>
              <Select.Option value="user">User</Select.Option>
              <Select.Option value="doctor">Doctor</Select.Option>
              <Select.Option value="groomer">Groomer</Select.Option>
              <Select.Option value="nurse">Nurse</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            style={{ borderTop: "1px solid #f6f6f6" }}
            width={800}
            className="col-md-12"
          >
            <div className="d-flex justify-content-center align-items-center mt-4 mb-0">
              <Button
                type="primary"
                htmlType="submit"
                className="btn btn-success btn-sm"
              >
                Update User Details
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

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
