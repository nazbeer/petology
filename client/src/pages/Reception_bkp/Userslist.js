import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { Table } from "antd";
import moment from "moment";

function Userslist() {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const getUsersData = async () => {
    try {
      dispatch(showLoading());
      const resposne = await axios.get("/api/user/get-all-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (resposne.data.success) {
        setUsers(resposne.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getUsersData();
  }, []);

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
      title:"Type",
      dataIndex:'type',render:(text, record)=>{
        // <select><option>{data.isNurse}</option></select>
      }
    },

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
          <button type="button" className="btn btn-success btn-sm cusrsor-pointer"><i className="ri-eye-line"></i></button>
          <button type="button" className="btn btn-warning btn-sm cusrsor-pointer"><i className="ri-edit-line"></i></button>
          <button type="button" className="btn btn-danger btn-sm cusrsor-pointer"><i className="ri-flag-line"></i></button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h4 className="page-header">Users List</h4>
      <hr />
      <Table columns={columns} dataSource={users}/>
    </Layout>
  );
}

export default Userslist;
